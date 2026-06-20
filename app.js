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
    .catch(err => {
      alert(err.message);
      console.error(err);
    });
}


// =======================
// LOGIN
// =======================
function login() {

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

 auth.signInWithEmailAndPassword(email, password)
.then(userCredential => {

    const userEmail = userCredential.user.email;

    localStorage.setItem("userEmail", userEmail);

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";
    document.getElementById("welcomeUser").innerText = userEmail;

    loadTasks();

})          // <-- thiếu đoạn này

.catch(err => {

    alert(err.message);
    console.error(err);

});
} 
async function googleLogin() {

  try {

    const result =
      await auth.signInWithPopup(provider);

    const credential =
      result.credential;

    const token =
      credential.accessToken;

    localStorage.setItem(
      "googleToken",
      token
    );

    alert("Google Calendar Connected");

  } catch(err){

    console.error(err);

    alert(err.message);

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
    type="text"
    value="${task.taskName || ''}"
    onchange="updateTask('${doc.id}','taskName',this.value)">
</td>
<td>
  <input type="text"
    value="${task.day1 || ''}"
    onchange="updateTask('${doc.id}','day1',this.value)">
</td>

<td>
  <input type="text"
    value="${task.day2 || ''}"
    onchange="updateTask('${doc.id}','day2',this.value)">
</td>

<td>
  <input type="text"
    value="${task.day3 || ''}"
    onchange="updateTask('${doc.id}','day3',this.value)">
</td>

<td>
  <input type="text"
    value="${task.day4 || ''}"
    onchange="updateTask('${doc.id}','day4',this.value)">
</td>

<td>
  <input type="text"
    value="${task.day5 || ''}"
    onchange="updateTask('${doc.id}','day5',this.value)">
</td>

<td>
  <input type="text"
    value="${task.day6 || ''}"
    onchange="updateTask('${doc.id}','day6',this.value)">
</td>

<td>
  <input type="text"
    value="${task.day7 || ''}"
    onchange="updateTask('${doc.id}','day7',this.value)">
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
<td style="text-align:center;">
  <input
    type="checkbox"
    ${task.apply ? "checked" : ""}
    onchange="toggleCreateCalendar('${doc.id}',this)">
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
`;

      tbody.appendChild(tr);

    });
highlightTodayColumn();

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
 day1: "",
  day2: "",
  day3: "",
  day4: "",
  day5: "",
  day6: "",
  day7: "",
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
// AUTO LOGIN
// =======================
window.onload = function () {

  loadWeekHeader();

  const user =
    localStorage.getItem("userEmail");

  if (user) {

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";
    document.getElementById("welcomeUser").innerText = user;

    loadTasks();
  }
};
// =======================
// update
// ==============
async function updateTask(id, field, value) {

  try {

    await db.collection("tasks")
      .doc(id)
      .update({
        [field]: value
      });

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

                await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events/${task.calendarId}`,
                {
                    method:"DELETE",
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });

                await db.collection("tasks")
                .doc(id)
                .update({

                    calendarId:"",
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

    await db.collection("tasks")
.doc(id)
.update({

    apply:true,

    calendarId:
      event.id || "",

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
        apply:false
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

      const th =
        document.getElementById("day" + i);

      if (!th) continue;

      if (th.dataset.today === "true") {

        todayIndex = i;
        break;

      }
    }

    if (todayIndex === -1) return;

    const rows =
      document.querySelectorAll("#taskTableBody tr");

    rows.forEach(row => {

      const cells =
        row.querySelectorAll("td");

      const OFFSET = 4;

      const targetCol =
        OFFSET + (todayIndex - 1);

      if (cells[targetCol]) {

        cells[targetCol]
          .classList.add("today-column");

      }

    });

  }, 300);
}
// =======================
// FORMAT DATE
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

    start:{
      dateTime: task.start
    },

    end:{
      dateTime: task.deadline
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

  console.error(error);

  throw error;

}



  return await response.json();

}
function handleLoginEnter(event) {

  if (event.key === "Enter") {
    login();
  }

}
