// =======================
// FIREBASE INIT
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyDCI_kxfza5lY1tdFPsMSEQKC2xqFpbMpM",
  authDomain: "whoami-73408.firebaseapp.com",
  projectId: "whoami-73408",
  storageBucket: "whoami-73408.firebasestorage.app",
  messagingSenderId: "755566064562",
  appId: "1:755566064562:web:15d0ec2626cf8aa4feeaab"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();
// =======================
// NOTIFICATION
// =======================

async function requestNotificationPermission(){

    if(!("Notification" in window)){

        alert("Browser không hỗ trợ Notification");

        return;

    }

    if(Notification.permission==="default"){

        await Notification.requestPermission();

    }

}
provider.addScope(
  "https://www.googleapis.com/auth/calendar"
);

// =======================
// REGISTER
// =======================
function registerUser() {

  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Đăng ký thành công");
    })
   .catch(async err => {

    console.error("Login error:", err);

    const email = document.getElementById("loginEmail").value.trim();

    try {
      const methods = await auth.fetchSignInMethodsForEmail(email);

      if (!methods || methods.length === 0) {
        alert("Email này chưa được đăng ký.");
        return;
      }

      if (methods.includes("google.com") && !methods.includes("password")) {
        alert("Email này đang đăng nhập bằng Google. Vui lòng bấm nút 'Đăng nhập bằng Google'.");
        return;
      }

      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/invalid-login-credentials"
      ) {
        alert("Sai mật khẩu hoặc thông tin đăng nhập không hợp lệ.");
        return;
      }

      if (err.code === "auth/invalid-email") {
        alert("Email không đúng định dạng.");
        return;
      }

      alert(err.message || "Đăng nhập thất bại");

    } catch (checkErr) {
      console.error("Provider check error:", checkErr);
      alert(err.message || "Đăng nhập thất bại");
    }

});
}


// =======================
// LOGIN
// =======================
async function login(){

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

 auth.signInWithEmailAndPassword(email, password)
.then(async userCredential => {

    const userEmail = userCredential.user.email;

    localStorage.setItem("userEmail", userEmail);

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";
    document.getElementById("welcomeUser").innerText = userEmail;

    await requestNotificationPermission();
    loadTasks();

})       // <-- thiếu đoạn này

.catch(err => {

    alert(err.message);
    console.error(err);

});
} 
async function googleLogin() {
  try {
    const result = await auth.signInWithPopup(provider);

    // Lấy credential trực tiếp từ result
    const credential = result.credential || null;
    const token = credential?.accessToken || "";
    const user = result.user;

    if (token) {
      localStorage.setItem("googleToken", token);
    }

    if (user?.email) {
      localStorage.setItem("userEmail", user.email);
      document.getElementById("welcomeUser").innerText = user.email;
    }

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";

    await requestNotificationPermission();
    await loadTasks();

    alert("Google login + Calendar connected thành công");

  } catch (err) {
    console.error("googleLogin error:", err);
    alert(err.message || "Google login failed");
  }
}
// =======================
// CHECK LOGIN PROVIDERS
// =======================
async function checkProviders() {
  const email = document.getElementById("loginEmail").value.trim();

  if (!email) {
    alert("Vui lòng nhập email trước");
    return;
  }

  try {
    const methods = await auth.fetchSignInMethodsForEmail(email);

    if (!methods || methods.length === 0) {
      alert("Email này chưa được đăng ký.");
      return;
    }

    const providerText = methods.join(", ");

    if (methods.includes("password") && methods.includes("google.com")) {
      alert("Email này có thể đăng nhập bằng cả Password và Google.");
    } else if (methods.includes("password")) {
      alert("Email này đăng nhập bằng Password.");
    } else if (methods.includes("google.com")) {
      alert("Email này đăng nhập bằng Google.");
    } else {
      alert("Phương thức đăng nhập: " + providerText);
    }

    console.log("Providers:", methods);

  } catch (err) {
    console.error("checkProviders error:", err);
    alert(err.message || "Không kiểm tra được phương thức đăng nhập");
  }
}


// =======================
// RESET PASSWORD
// =======================
async function resetPassword() {
  const email = document.getElementById("loginEmail").value.trim();

  if (!email) {
    alert("Vui lòng nhập email trước");
    return;
  }

  try {
    await auth.sendPasswordResetEmail(email);
    alert("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.");
  } catch (err) {
    console.error("resetPassword error:", err);

    if (err.code === "auth/user-not-found") {
      alert("Email này chưa được đăng ký.");
    } else if (err.code === "auth/invalid-email") {
      alert("Email không đúng định dạng.");
    } else {
      alert(err.message || "Không gửi được email reset mật khẩu");
    }
  }
}
// =======================
// LOGOUT
// =======================
function logout() {

  auth.signOut();

  localStorage.removeItem("userEmail");

  location.reload();
}


// =======================
// MODAL
// =======================
function openTaskModal() {
  document.getElementById("taskModal").style.display = "block";
}

function closeTaskModal() {
  document.getElementById("taskModal").style.display = "none";
}



// =======================
// SAVE TASK
// =======================
async function saveTask() {

  try {

    const taskData = {

      email: localStorage.getItem("userEmail"),

      taskName:
        document.getElementById("taskName")?.value || "",

      start:
        document.getElementById("startDate")?.value || "",

      deadline:
        document.getElementById("deadline")?.value || "",
    
      taskType:
        document.getElementById("taskType")?.value || "Daily",

      priority:
        document.getElementById("priority")?.value || "Normal",

      status:
        document.getElementById("status")?.value || "Todo",

      calendarTitle:
        document.getElementById("calendarTitle")?.value || "",

      calendarType:
        document.getElementById("calendarType")?.value || "Event",

      attendees:
        document.getElementById("attendees")?.value || "",

      addMeet:
        document.getElementById("addMeet")?.checked || false,

      location:
        document.getElementById("location")?.value || "",

      description:
        document.getElementById("description")?.value || "",

      repeat:
        document.getElementById("repeat")?.value || "None",

      repeatInterval:
        Number(document.getElementById("repeatInterval")?.value) || 1,

      repeatUntil:
        document.getElementById("repeatUntil")?.value || "",

      autoDelete:
        document.getElementById("autoDelete")?.checked || false,

      apply: false,

      sendMail:
        document.getElementById("sendMail")?.checked || false,

      calendarId: "",

      meetLink: "",

      calendarStatus: "Create",
reviewCalendarIds: [],
      createdAt: new Date()

    };

    await db.collection("tasks").add(taskData);

    alert("Tạo task thành công");

    closeTaskModal();

    resetForm();

    loadTasks();

  } catch (err) {

    console.error(err);

    alert("Lỗi tạo task");

  }
}
// =======================
// RESET FORM
// =======================
function resetForm() {

  const fields = [
    "taskName",
    "taskDescription",
    "startDate",
    "deadline",
    "calendarTitle",
    "location",
    "attendees",
    "meetLink",
    "reminder"
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const taskType = document.getElementById("taskType");
  if (taskType) taskType.value = "Daily";

  const priority = document.getElementById("priority");
  if (priority) priority.value = "Normal";

  const status = document.getElementById("status");
  if (status) status.value = "Todo";

  const applyCalendar = document.getElementById("applyCalendar");
  if (applyCalendar) applyCalendar.checked = false;

  const sendMail = document.getElementById("sendMail");
  if (sendMail) sendMail.checked = false;
}

// =======================
// LOAD TASKS
// =======================
async function loadTasks() {

  try {

    const email = localStorage.getItem("userEmail");

    const snapshot = await db
      .collection("tasks")
      .where("email", "==", email)
      .get();

    const tbody = document.getElementById("taskTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    snapshot.forEach(doc => {

      const task = doc.data();
const reviewDays = buildReviewDays(task);
      if (!task || !task.taskName) return;
      const tr = document.createElement("tr");

      tr.innerHTML = `
<td style="text-align:center;">
  <input
    type="checkbox"
    onchange="archiveTask('${doc.id}', this)">
</td>

<td>
  <input
    type="datetime-local"
    value="${(task.start || '').substring(0,16)}"
    onkeydown="return false"
    onchange="updateTask('${doc.id}','start',this.value)">
</td>

<td>
  <input
    type="datetime-local"
    value="${(task.deadline || '').substring(0,16)}"
    onkeydown="return false"
    onchange="updateTask('${doc.id}','deadline',this.value)">
</td>
<td>
  <input
    type="number"
    min="0"
    step="0.5"
 value="${task.processingTime ?? ''}h"
    onchange="updateTask('${doc.id}','processingTime',Number(this.value))">
</td>
<td>
  <input
    type="text"
    value="${task.taskName || ''}"
    onchange="updateTask('${doc.id}','taskName',this.value)">
</td>
<td>
<textarea
oninput="autoResize(this)"
onchange="updateTask('${doc.id}','reviewDays.day1',this.value);
scheduleTodayNotifications();"
rows="1"
class="review-cell">${reviewDays.day1 || ""}</textarea>
</td>
<td>
<textarea
oninput="autoResize(this)"
onchange="updateTask('${doc.id}','reviewDays.day2',this.value);
scheduleTodayNotifications();"
rows="1"
class="review-cell">${reviewDays.day2 || ""}</textarea>
</td>
<td>
<textarea
oninput="autoResize(this)"
onchange="updateTask('${doc.id}','reviewDays.day3',this.value);
scheduleTodayNotifications();"
rows="1"
class="review-cell">${reviewDays.day3 || ""}</textarea>
</td>
<td>
<textarea
oninput="autoResize(this)"
onchange="updateTask('${doc.id}','reviewDays.day4',this.value);
scheduleTodayNotifications();"
rows="1"
class="review-cell">${reviewDays.day4 || ""}</textarea>
</td>
<td>
<textarea
oninput="autoResize(this)"
onchange="updateTask('${doc.id}','reviewDays.day5',this.value);
scheduleTodayNotifications();"
rows="1"
class="review-cell">${reviewDays.day5 || ""}</textarea>
</td>
<td>
<textarea
oninput="autoResize(this)"
onchange="updateTask('${doc.id}','reviewDays.day6',this.value);
scheduleTodayNotifications();"
rows="1"
class="review-cell">${reviewDays.day6 || ""}</textarea>
</td>
<td>
<textarea
oninput="autoResize(this)"
onchange="updateTask('${doc.id}','reviewDays.day7',this.value);
scheduleTodayNotifications();"
rows="1"
class="review-cell">${reviewDays.day7 || ""}</textarea>
</td>
<td>
  <select onchange="updateTask('${doc.id}','priority',this.value)">
    <option value="Normal" ${task.priority==="Normal"?"selected":""}>Normal</option>
    <option value="Urgent" ${task.priority==="Urgent"?"selected":""}>Urgent</option>
  </select>
</td>

<td>
  <select onchange="updateTask('${doc.id}','status',this.value)">
    <option value="Todo" ${task.status==="Todo"?"selected":""}>Todo</option>
    <option value="Processing" ${task.status==="Processing"?"selected":""}>Processing</option>
    <option value="Done" ${task.status==="Done"?"selected":""}>Done</option>
  </select>
</td>

<td>
  <select onchange="updateTask('${doc.id}','taskType',this.value)">
      <option value="Ôn tập" ${task.taskType==="Ôn tập"?"selected":""}>Ôn tập</option>
    <option value="Daily" ${task.taskType==="Daily"?"selected":""}>Daily</option>
    <option value="Weekly" ${task.taskType==="Weekly"?"selected":""}>Weekly</option>
    <option value="Monthly" ${task.taskType==="Monthly"?"selected":""}>Monthly</option>
    <option value="Yearly" ${task.taskType==="Yearly"?"selected":""}>Yearly</option>
  </select>
</td>
<td>
  <input
    type="text"
    value="${task.calendarTitle || ''}"
    onchange="updateTask('${doc.id}','calendarTitle',this.value)">
</td>

<td>
  <select onchange="updateTask('${doc.id}','calendarType',this.value)">
    <option value="Event" ${task.calendarType==="Event"?"selected":""}>Event</option>
    <option value="Task" ${task.calendarType==="Task"?"selected":""}>Task</option>
  </select>
</td>

<td>
  <input
    type="text"
    value="${task.attendees || ''}"
    onchange="updateTask('${doc.id}','attendees',this.value)">
</td>

<td style="text-align:center;">
  <input
    type="checkbox"
    ${task.addMeet ? "checked" : ""}
    onchange="updateTask('${doc.id}','addMeet',this.checked)">
</td>

<td>
  <input
    type="text"
    value="${task.location || ''}"
    onchange="updateTask('${doc.id}','location',this.value)">
</td>

<td>
  <input
    type="text"
    value="${task.description || ''}"
    onchange="updateTask('${doc.id}','description',this.value)">
</td>

<td>
  <select onchange="updateTask('${doc.id}','repeat',this.value)">
    <option value="None" ${task.repeat==="None"?"selected":""}>None</option>
    <option value="Daily" ${task.repeat==="Daily"?"selected":""}>Daily</option>
    <option value="Weekly" ${task.repeat==="Weekly"?"selected":""}>Weekly</option>
    <option value="Monthly" ${task.repeat==="Monthly"?"selected":""}>Monthly</option>
    <option value="Yearly" ${task.repeat==="Yearly"?"selected":""}>Yearly</option>
  </select>
</td>
<td>
    <input
        type="number"
        min="1"
        value="${task.repeatInterval || 1}"
        onchange="updateTask('${doc.id}','repeatInterval',Number(this.value))">
</td>
<td>
  <input
    type="date"
    value="${task.repeatUntil || ''}"
    onchange="updateTask('${doc.id}','repeatUntil',this.value)">
</td>
<td style="text-align:center;">
  <input
    type="checkbox"
    ${task.apply ? "checked" : ""}
    onchange="toggleCreateCalendar('${doc.id}',this)">
</td>
<td>
  <input
    type="text"
    value="${task.calendarId || ''}"
    readonly>
</td>

<td>
  <input
    type="text"
    value="${task.meetLink || ''}"
    readonly>
</td>


<td>
  <select onchange="updateTask('${doc.id}','calendarStatus',this.value)">
    <option value="Create" ${task.calendarStatus==="Create"?"selected":""}>Create</option>
    <option value="Created" ${task.calendarStatus==="Created"?"selected":""}>Created</option>
    <option value="Delete" ${task.calendarStatus==="Delete"?"selected":""}>Delete</option>
  </select>
</td>

<td style="text-align:center;">
  <input
    type="checkbox"
    ${task.autoDelete ? "checked" : ""}
    onchange="updateTask('${doc.id}','autoDelete',this.checked)">
</td>
<td style="text-align:center;">
  <button
    onclick="createReviewCalendarForRow(this)">
    📅
  </button>

  <button
    onclick="rebuildReviewDays('${doc.id}')">
    🔄
  </button>
</td>
`;

      tbody.appendChild(tr);
tr.querySelectorAll(".review-cell").forEach(autoResize);
    });
highlightTodayColumn();

scheduleTodayNotifications();

  } catch(err) {

    console.error(err);

  }
}

// =======================
// SHOW TRACKER
// =======================
function showTracker() {

  document.getElementById("trackerPage").style.display = "block";

  document.getElementById("backupPage").style.display = "none";

  const kanban = document.querySelector(".kanban");
  if (kanban) kanban.style.display = "none";

  loadWeekHeader();
  loadTasks();
}
// =======================
// SHOW KANBAN
// =======================
function showKanban() {

  document.getElementById("trackerPage").style.display = "none";

  document.getElementById("backupPage").style.display = "none";

  const kanban = document.querySelector(".kanban");

  if (kanban) kanban.style.display = "flex";
}

// =======================
// ADD EMPTY ROW
// =======================

async function addRow() {

  try {

    await db.collection("tasks").add({

      email: localStorage.getItem("userEmail"),

      taskName: "",
      start: "",
      deadline: "",
      processingTime: 0,
reviewDays:{
    day1:"",
    day2:"",
    day3:"",
    day4:"",
    day5:"",
    day6:"",
    day7:""
},
      priority: "Normal",
      status: "Todo",
      taskType: "Daily",
repeat: "None",
repeatInterval: 1,
repeatUntil: "",
calendarTitle: "",
calendarType: "Event",
attendees: "",
addMeet: false,
location: "",
description: "",
apply: false,
calendarId: "",
meetLink: "",
calendarStatus: "Create",
autoDelete: false,

reviewCalendarIds: [],

createdAt: new Date()

    });

    loadTasks();

  } catch (err) {

    console.error(err);

    alert("Không thêm được dòng mới");
  }
}
// =======================
// LOAD WEEK HEADER
// =======================
function loadWeekHeader() {

  const today = new Date();

  const monday = new Date(today);

  const dayOfWeek = today.getDay();

  const daysFromMonday =
    dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  monday.setDate(today.getDate() - daysFromMonday);

  const weekDays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ];

  for (let i = 0; i < 7; i++) {

    const currentDate = new Date(monday);

    currentDate.setDate(monday.getDate() + i);

    const th =
      document.getElementById(`day${i + 1}`);

    if (!th) continue;

    th.classList.remove("today-column");

  const w0 = new Date(currentDate);

const w1 = new Date(currentDate);
w1.setDate(w1.getDate() + 7);

const w2 = new Date(currentDate);
w2.setDate(w2.getDate() + 14);

const w3 = new Date(currentDate);
w3.setDate(w3.getDate() + 21);

th.innerHTML = `
<div class="week-day">${weekDays[i]}</div>

<div class="week-date">${w3.getDate()}.${w3.getMonth()+1}</div>

<div class="week-subdate">${w2.getDate()}.${w2.getMonth()+1}</div>

<div class="week-subdate">${w1.getDate()}.${w1.getMonth()+1}</div>

<div class="week-subdate">${w0.getDate()}.${w0.getMonth()+1}</div>
`;

    if (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    ) {

      th.classList.add("today-column");

      th.dataset.today = "true";

    } else {

      th.dataset.today = "false";

    }
  }

  highlightTodayColumn();
}
// =======================
// LẤY NGÀY CỦA TUẦN HIỆN TẠI
// =======================
function getCurrentWeekDates() {

    const today = new Date();

    const monday = new Date(today);

    let dow = today.getDay();

    // Chủ nhật = 7
    dow = (dow === 0) ? 6 : dow - 1;

    monday.setDate(today.getDate() - dow);

    const dates = [];

    for (let i = 0; i < 7; i++) {

        const d = new Date(monday);

        d.setDate(monday.getDate() + i);

        dates.push(d);

    }

    return dates;

}
// =======================
// AUTO LOGIN
// =======================
window.onload = function () {
  loadWeekHeader();

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      localStorage.setItem("userEmail", user.email || "");

      document.getElementById("loginPage").style.display = "none";
      document.getElementById("appPage").style.display = "block";
      document.getElementById("welcomeUser").innerText = user.email || "";

      await requestNotificationPermission();
      await loadTasks();
    } else {
      localStorage.removeItem("userEmail");

      document.getElementById("loginPage").style.display = "block";
      document.getElementById("appPage").style.display = "none";
    }
  });
};
// =======================
// update
// ==============
async function updateTask(id, field, value) {

  try {

    const data = {};
    data[field] = value;

    await db.collection("tasks")
      .doc(id)
      .update(data);

    // Nếu đổi taskType / start / taskName thì reset reviewDays
    // để loadTasks() build lại theo logic mới
    if(field === "taskType" || field === "start" || field === "taskName"){

      await db.collection("tasks")
        .doc(id)
        .update({
          reviewDays: {
            day1:"",
            day2:"",
            day3:"",
            day4:"",
            day5:"",
            day6:"",
            day7:""
          }
        });

      await loadTasks();
      return;
    }

  } catch(err) {
    console.error(err);
  }
}
async function toggleCreateCalendar(id, checkbox){

    try{

        await db.collection("tasks")
        .doc(id)
        .update({
            apply: checkbox.checked
        });

        if(checkbox.checked){

            await createCalendarFromRow(id);

        }else{

            const docRef =
            await db.collection("tasks")
            .doc(id)
            .get();

            const task = docRef.data();

            if(task.calendarId){

                const token =
                localStorage.getItem("googleToken");
if(task.calendarId && token){

   try{

      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${task.calendarId}`,
        {
          method:"DELETE",
          headers:{
             Authorization:`Bearer ${token}`
          }
        }
      );

   }catch(err){

      console.error(err);

   }

}
               if(
   task.reviewCalendarIds &&
   task.reviewCalendarIds.length
){

   for(const eventId of task.reviewCalendarIds){

      try{

         await fetch(
           `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
           {
             method:"DELETE",
             headers:{
               Authorization:`Bearer ${token}`
             }
           }
         );

      }catch(err){

         console.error(err);

      }

   }

}

             await db.collection("tasks")
.doc(id)
.update({

    calendarId:"",
    reviewCalendarIds:[],
    meetLink:"",
    calendarStatus:"Create",
    apply:false

});

                loadTasks();

            }

        }

    }catch(err){

        console.error(err);

        checkbox.checked=false;

    }

}
async function createCalendarFromRow(id){

  

  try{

    const docRef =
      await db.collection("tasks")
      .doc(id)
      .get();

    const task =
      docRef.data();

    if(task.calendarId){

      alert("Calendar đã tồn tại");

      return;
    }

    const event =
      await createCalendarEvent(task);
const reviewIds = [];

const reviewDays = task.reviewDays || {};

const week = getCurrentWeekDates();

for(let i=1;i<=7;i++){

    const text =
      reviewDays["day"+i] || "";

    const reviewTasks =
      parseReviewTasks(text);

    for(const t of reviewTasks){

        const eventId =
          await createReviewCalendarTask(
              t,
              week[i-1]
          );

        if(eventId){

            reviewIds.push(eventId);

        }

    }

}
  await db.collection("tasks")
.doc(id)
.update({

    apply:true,

    calendarId:
      event.id || "",

    reviewCalendarIds:
      reviewIds,

    meetLink:
      event.hangoutLink || "",

    calendarStatus:
      "Created"

});

    loadTasks();

}catch(err){

    console.error(err);

    await db.collection("tasks")
    .doc(id)
    .update({

        apply:false,
        calendarStatus:"Create"

    });

    loadTasks();

    alert("Tạo Calendar thất bại");

}

}

// =======================
// ARCHIVE TASK
// =======================
async function archiveTask(id, checkbox) {
  const confirmDelete = confirm("Bạn có chắc muốn archive task này không?");
  if (!confirmDelete) {
    checkbox.checked = false;
    return;
  }

  try {
    const docRef = await db.collection("tasks").doc(id).get();
    if (!docRef.exists) return;

    const task = docRef.data();
    const token =
localStorage.getItem(
  "googleToken"
);

if(
  task.calendarId &&
  token
){

  try{

    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${task.calendarId}`,
      {
        method:"DELETE",
        headers:{
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  }catch(err){

    console.error(
      "Delete calendar error",
      err
    );

  }

}
if(
  task.reviewCalendarIds &&
  task.reviewCalendarIds.length &&
  token
){

  for(const eventId of task.reviewCalendarIds){

    try{

      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method:"DELETE",
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

    }catch(err){

      console.error(
        "Delete review calendar error",
        err
      );

    }

  }

}
    await db.collection("backupTasks").add({
      ...task,
      email: localStorage.getItem("userEmail"),
      archivedAt: new Date()
    });

    await db.collection("tasks").doc(id).delete();

    loadTasks();

  } catch (err) {
    console.error(err);
    alert("Không thể backup task");
    checkbox.checked = false;
  }
}

// =======================
// SHOW BACKUP
// =======================
async function showBackup() {

  document.getElementById("trackerPage").style.display = "none";

  document.getElementById("backupPage").style.display = "block";

  const kanban = document.querySelector(".kanban");
  if (kanban) kanban.style.display = "none";

  const tbody =
    document.getElementById("backupTableBody");

  if (!tbody) return;

  tbody.innerHTML = "";

  const email =
    localStorage.getItem("userEmail");

  const snapshot = await db
    .collection("backupTasks")
    .where("email", "==", email)
    .get();

  snapshot.forEach(doc => {

    const task = doc.data();

    const tr =
      document.createElement("tr");

    tr.innerHTML = `
    <td style="text-align:center;">
<input
type="checkbox"
${task.apply ? "checked" : ""}
onchange="toggleCreateCalendar('${doc.id}',this)">
</td>


      <td>${task.taskName || ""}</td>
      <td>${task.start || ""}</td>
      <td>${task.deadline || ""}</td>
      <td>${task.status || ""}</td>
      <td>${task.priority || ""}</td>
      <td>
        ${task.archivedAt
          ? new Date(task.archivedAt.seconds * 1000)
              .toLocaleString()
          : ""}
      </td>
      <td>
  <button onclick="deleteBackupTask('${doc.id}')">
    Xóa
  </button>
</td>
    `;

    tbody.appendChild(tr);

  });

}
// =======================
// RESTORE TASK
// =======================
async function restoreTask(id) {
  try {
    const docRef = await db.collection("backupTasks").doc(id).get();
    if (!docRef.exists) return;

    const task = docRef.data();

    delete task.archivedAt;

    await db.collection("tasks").add({
      ...task,
      email: localStorage.getItem("userEmail"),
      createdAt: new Date()
    });

    await db.collection("backupTasks").doc(id).delete();

    showBackup();

  } catch (err) {
    console.error(err);
    alert("Không thể restore task");
  }
}
// =======================
// HIGHLIGHT TODAY COLUMN
// =======================
function highlightTodayColumn() {

  setTimeout(() => {

    let todayIndex = -1;

    for (let i = 1; i <= 7; i++) {

      const th = document.getElementById("day" + i);

      if (!th) continue;

      if (th.dataset.today === "true") {
        todayIndex = i;
        break;
      }
    }

    if (todayIndex === -1) return;

    const rows = document.querySelectorAll("#taskTableBody tr");

    rows.forEach(row => {

      const cells = row.querySelectorAll("td");

      // ✅ FIX CHÍNH Ở ĐÂY
      const OFFSET = 5;

      const targetCol = OFFSET + (todayIndex - 1);

      if (cells[targetCol]) {
        cells[targetCol].classList.add("today-column");
      }

    });

  }, 300);
}
// =======================
// Hàm ôn tập
// =======================
function buildReviewSchedule(task){

    const result = {
        day1:"",
        day2:"",
        day3:"",
        day4:"",
        day5:"",
        day6:"",
        day7:""
    };

    if(!task.start || !task.taskName) return result;

    const start = new Date(task.start);
    if (isNaN(start.getTime())) return result;

    const now = new Date();
    const monday = new Date(now);

    let dow = now.getDay();
    dow = (dow === 0) ? 6 : dow - 1;
    monday.setDate(now.getDate() - dow);

    function formatHM(date){
        const hh = String(date.getHours()).padStart(2, "0");
        const mm = String(date.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
    }

    function addToDay(dayIndex, text){
        const key = "day" + dayIndex;
        if(result[key] && result[key].trim() !== ""){
            result[key] += "\n" + text;
        }else{
            result[key] = text;
        }
    }

    // Các mốc ôn tập
    const reviewDates = [];

    // Mốc 1: đúng giờ start
    reviewDates.push(new Date(start));

    // Mốc 2: +10 phút
    reviewDates.push(new Date(start.getTime() + 10 * 60 * 1000));

    // Mốc 3: +24h
    reviewDates.push(new Date(start.getTime() + 24 * 60 * 60 * 1000));

    // Mốc 4: +7 ngày
    const d7 = new Date(start);
    d7.setDate(d7.getDate() + 7);
    reviewDates.push(d7);

    // Mốc 5: +30 ngày
    const d30 = new Date(start);
    d30.setMonth(d30.getMonth() + 1);
    reviewDates.push(d30);

    // Map vào tuần hiện tại
    for(let i = 0; i < 7; i++){

        const colDate = new Date(monday);
        colDate.setDate(monday.getDate() + i);

        for(const r of reviewDates){

            const rr = normalizeDate(r);
            const cc = normalizeDate(colDate);

            if(rr.getTime() === cc.getTime()){
                const line = `${formatHM(r)} ${task.taskName}`;
                addToDay(i + 1, line);
            }
        }
    }

    return result;
}
function hasReviewData(task){

    if(!task.reviewDays) return false;

    return Object.values(task.reviewDays)
        .some(v => String(v || "").trim() !== "");

}
function buildReviewDays(task){

    const current = task.reviewDays || {};

    const result = {
        day1: current.day1 || "",
        day2: current.day2 || "",
        day3: current.day3 || "",
        day4: current.day4 || "",
        day5: current.day5 || "",
        day6: current.day6 || "",
        day7: current.day7 || ""
    };

    if(!task.start || isNaN(new Date(task.start).getTime())){
        return result;
    }

    const start = new Date(task.start);
    const taskName = (task.taskName || "").trim();

    if(!taskName) return result;

    function formatHM(date){
        const hh = String(date.getHours()).padStart(2, "0");
        const mm = String(date.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
    }

    function addToDay(dayIndex, text){
        const key = "day" + dayIndex;

        // Nếu ô đang trống -> điền luôn
        if(!result[key] || result[key].trim() === ""){
            result[key] = text;
            return;
        }

        // Nếu đã có đúng text này rồi thì không thêm trùng
        const lines = result[key]
            .split("\n")
            .map(x => x.trim())
            .filter(Boolean);

        if(!lines.includes(text)){
            result[key] += "\n" + text;
        }
    }

    // JS getDay(): Sun=0, Mon=1 ... Sat=6
    // convert về Mon=1 ... Sun=7
    let day = start.getDay();
    day = (day === 0) ? 7 : day;

   const startTime = new Date(task.start);
const durationHours = Number(task.processingTime || 0);

// start time
const sh = String(startTime.getHours()).padStart(2, "0");
const sm = String(startTime.getMinutes()).padStart(2, "0");

// end time = start + processingTime
const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

const eh = String(endTime.getHours()).padStart(2, "0");
const em = String(endTime.getMinutes()).padStart(2, "0");

const line = `${sh}:${sm}-${eh}:${em} ${taskName}`;

    switch(task.taskType){

        case "Daily":
            for(let i = 1; i <= 7; i++){
                addToDay(i, line);
            }
            break;

        case "Weekly":
        case "Monthly":
        case "Yearly":
            addToDay(day, line);
            break;

        case "Ôn tập":
            // build theo các mốc review riêng
            return buildReviewSchedule(task);

        default:
            // nếu taskType lạ thì coi như Weekly theo ngày start
            addToDay(day, line);
            break;
    }

    return result;
}


async function rebuildReviewDays(id){

    try{

        const docRef =
            await db.collection("tasks")
            .doc(id)
            .get();

        if(!docRef.exists) return;

        const task = docRef.data();

        const emptyReviewDays = {
            day1:"",
            day2:"",
            day3:"",
            day4:"",
            day5:"",
            day6:"",
            day7:""
        };

        await db.collection("tasks")
        .doc(id)
        .update({
            reviewDays: emptyReviewDays
        });

        loadTasks();

    }catch(err){

        console.error(err);

        alert("Rebuild thất bại");

    }

}
function normalizeDate(d){
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
// =======================
// FORMAT EDAT
// =======================
function formatDate(d){

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return `${d.getDate()}-${months[d.getMonth()]}`;
}

// =======================
// ENTER TO LOGIN
// =======================
async function createCalendarEvent(task){

  const token =
    localStorage.getItem("googleToken");

  if(!token){
    throw new Error(
      "Google chưa kết nối"
    );
  }

  const body = {

    summary:
      task.calendarTitle ||
      task.taskName,

    location:
      task.location || "",

    description:
      task.description || "",

   start: {
  dateTime: new Date(task.start).toISOString(),
  timeZone: "Asia/Ho_Chi_Minh"
},

end: {
  dateTime: new Date(task.deadline).toISOString(),
  timeZone: "Asia/Ho_Chi_Minh"
}

  };

  if(task.addMeet){

    body.conferenceData = {
      createRequest:{
        requestId:
          Date.now().toString()
      }
    };

  }

if(task.repeat && task.repeat !== "None"){

  let freq =
    task.repeat.toUpperCase();

  let rule =
    `RRULE:FREQ=${freq};INTERVAL=${task.repeatInterval || 1}`;

  if(task.repeatUntil){

    const until =
      task.repeatUntil.replace(/-/g,"") +
      "T235959Z";

    rule += `;UNTIL=${until}`;

  }

  body.recurrence = [rule];

}
  console.log("task.start =", task.start);
console.log("task.deadline =", task.deadline);
console.log("Body =", JSON.stringify(body, null, 2));
 const response =
await fetch(
  "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
  {
    method:"POST",
    headers:{
      Authorization:`Bearer ${token}`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify(body)
  }
);

if(!response.ok){

const error =
    await response.json();

console.log(
    JSON.stringify(error,null,2)
);

throw error;

}



  return await response.json();

}
// =======================
// Xóa backup
// =======================
function handleLoginEnter(event) {

  if (event.key === "Enter") {
    login();
  }

}
async function deleteBackupTask(id) {
  const ok = confirm("Bạn có chắc muốn xóa vĩnh viễn task này?");
  if (!ok) return;

  try {
    await db.collection("backupTasks").doc(id).delete();
    alert("Đã xóa backup task");

    showBackup(); // reload lại bảng
  } catch (err) {
    console.error(err);
    alert("Xóa thất bại");
  }
}
// =======================
// autoResize
// =======================
function autoResize(el){

    el.style.height = "auto";

    el.style.height = el.scrollHeight + "px";

    const tr = el.closest("tr");

    if(tr){

        tr.style.height = "auto";

    }

}

// =======================
// Hàm parse nhiều task
// =======================
function parseReviewTasks(text){

    if(!text) return [];

    const tasks = [];
    const lines = text.split("\n");

    for(const line of lines){

        const t = line.trim();
        if(!t) continue;

        // hh:mm-hh:mm title
        let m = t.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})\s+(.+)$/);

        if(m){

            tasks.push({
                hour: Number(m[1]),
                minute: Number(m[2]),
                endHour: Number(m[3]),
                endMinute: Number(m[4]),
                title: m[5]
            });

            continue;
        }

        // fallback hh:mm title
       m = t.match(/^(\d{1,2}):(\d{2})\s+(.+)$/);

if (m) {
    tasks.push({
        hour: Number(m[1]),
        minute: Number(m[2]),
        endHour: null,
        endMinute: null,
        title: m[3],
        raw: t
    });
}
    }

    return tasks;
}

// =======================
// showTaskNotification
// =======================
function showTaskNotification(title){

    if(Notification.permission !== "granted") return;

    // 1. Push notification (popup hệ thống)
    const notif = new Notification("⏰ Nhắc việc", {
        body: title,
        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
        badge: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
        vibrate: [200, 100, 200], // rung (Android hỗ trợ)
        requireInteraction: true
    });

    // 2. RUNG ĐIỆN THOẠI (nếu hỗ trợ)
    if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300]);
    }

    // 3. CLICK notification -> focus tab
    notif.onclick = function () {
        window.focus();
        notif.close();
    };

    // 4. POPUP UI trong web (giả mobile popup đẹp)
    showInAppPopup(title);
}
// =======================
// scheduleNotification
// =======================
function scheduleNotification(task,date){

    const target=new Date(

        date.getFullYear(),

        date.getMonth(),

        date.getDate(),

        task.hour,

        task.minute,

        0

    );

    const delay=target-Date.now();

    if(delay<=0) return;

    setTimeout(()=>{

        showTaskNotification(task.title);

    },delay);

}
function scheduleTodayNotifications(){

    const week = getCurrentWeekDates();

    const today = normalizeDate(new Date());

    // tìm cột hôm nay
    let todayIndex = -1;

    for(let i=0;i<7;i++){

        if(normalizeDate(week[i]).getTime()===today.getTime()){

            todayIndex=i+1;

            break;

        }

    }

    if(todayIndex===-1) return;

    document.querySelectorAll("#taskTableBody tr").forEach(row=>{

        const textarea=row.querySelectorAll(".review-cell")[todayIndex-1];

        if(!textarea) return;

        const tasks=parseReviewTasks(textarea.value);

        tasks.forEach(t=>{

            scheduleNotification(t,new Date());

        });

    });

}
// =======================
 //THÊM POPUP GIAO DIỆN TRONG WEB
// =======================

function showInAppPopup(text){

    let popup = document.getElementById("appPopup");

    if(!popup){

        popup = document.createElement("div");
        popup.id = "appPopup";

        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.right = "20px";
        popup.style.background = "#111";
        popup.style.color = "#fff";
        popup.style.padding = "14px 18px";
        popup.style.borderRadius = "12px";
        popup.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
        popup.style.zIndex = "999999";
        popup.style.maxWidth = "260px";
        popup.style.fontSize = "14px";
        popup.style.animation = "fadeIn 0.3s ease";

        document.body.appendChild(popup);
    }

    popup.innerHTML = "⏰ " + text;

    popup.style.display = "block";

    setTimeout(()=>{
        popup.style.opacity = "0";
        setTimeout(()=> popup.remove(), 300);
    }, 4000);
}

async function refreshAllNotifications() {
  try {

    if (Notification.permission !== "granted") {
      await requestNotificationPermission();
    }

    // clear tất cả timeout cũ (giải pháp đơn giản)
    let id = setTimeout(() => {}, 0);
    while (id--) {
      clearTimeout(id);
    }

    // load lại tasks để lấy dữ liệu mới nhất
    await loadTasks();

    // schedule lại toàn bộ notification
    scheduleTodayNotifications();

    alert("Đã cập nhật toàn bộ thông báo!");

  } catch (err) {
    console.error(err);
    alert("Không thể cập nhật notification");
  }
}
//Bước 1: Tạo Calendar cho từng task trong cell

async function createReviewCalendarTask(task, date) {

  const token = localStorage.getItem("googleToken");
  if (!token) return;

  // START: lấy từ hh:mm
  const startDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    task.hour,
    task.minute
  );

  // END: tính từ duration trong text (hh:mm-hh:mm)
 let endDate;

if (task.endHour != null && task.endMinute != null) {

    // nếu vẫn có dữ liệu cũ thì fallback
    endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      task.endHour,
      task.endMinute
    );

  } else {

    // chuẩn mới: end time đã nằm trong format text → tính duration
    const startMinutes = task.hour * 60 + task.minute;

    // nếu parse được end từ title format (fallback an toàn)
    const match = `${task.raw || ""}`.match(/-(\d{1,2}):(\d{2})/);

    if (match) {
      const endMinutes = Number(match[1]) * 60 + Number(match[2]);
  const diff = endMinutes > startMinutes
    ? endMinutes - startMinutes
    : 30; // fallback 30 phút

      endDate = new Date(startDate.getTime() + diff * 60 * 1000);

    } else {
      // fallback mặc định 30 phút
      endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
    }
  }

  const body = {
   summary: task.title || task.raw || "Task",
    start: {
      dateTime: startDate.toISOString(),
      timeZone: "Asia/Ho_Chi_Minh"
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: "Asia/Ho_Chi_Minh"
    }
  };

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  const event = await response.json();
  return event.id;
}


//Bước 2: Quét toàn bộ cột Mon → Sun
async function createCalendarFromReviewCells(){

    const week = getCurrentWeekDates();

    const rows =
      document.querySelectorAll("#taskTableBody tr");

    for(const row of rows){

        const cells =
          row.querySelectorAll(".review-cell");

        for(let i=0;i<cells.length;i++){

            const date = week[i];

            const tasks =
              parseReviewTasks(cells[i].value);

            for(const t of tasks){

                await createReviewCalendarTask(
                    t,
                    date
                );

            }

        }

    }

    alert("Đã tạo Calendar từ Review Cells");
}


async function createReviewCalendarForRow(btn){

    const row = btn.closest("tr");

    const week = getCurrentWeekDates();

    const cells =
      row.querySelectorAll(".review-cell");

    for(let i=0;i<cells.length;i++){

        const tasks =
          parseReviewTasks(cells[i].value);

        const date = week[i];

        for(const task of tasks){

            await createReviewCalendarTask(
                task,
                date
            );

        }

    }

    alert("Đã tạo Calendar");
}
