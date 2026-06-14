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
    })
    .catch(err => {
      alert(err.message);
      console.error(err);
    });
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

    await db.collection("tasks").add({

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

      location:
        document.getElementById("location")?.value || "",

      attendees:
        document.getElementById("attendees")?.value || "",

      apply:
        document.getElementById("applyCalendar")?.checked || false,

      sendMail:
        document.getElementById("sendMail")?.checked || false,

      createdAt: new Date()
    });

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
<td>
  <input
    type="datetime-local"
    value="${task.start || ''}"
    onkeydown="return false"
    onchange="updateTask('${doc.id}','start',this.value)">
</td>

<td>
  <input
    type="datetime-local"
    value="${task.deadline || ''}"
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
`;  

      tbody.appendChild(tr);

    });

  } catch(err) {

    console.error(err);

  }
}

// =======================
// SHOW TRACKER
// =======================
function showTracker() {

  const tracker = document.getElementById("trackerPage");
  const kanban = document.querySelector(".kanban");

  if (tracker) tracker.style.display = "block";
  if (kanban) kanban.style.display = "none";

  loadTasks();
}


// =======================
// SHOW KANBAN
// =======================
function showKanban() {

  const tracker = document.getElementById("trackerPage");
  const kanban = document.querySelector(".kanban");

  if (tracker) tracker.style.display = "none";
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

      priority: "Normal",
      status: "Todo",
      taskType: "Daily",

      createdAt: new Date()

    });

    loadTasks();

  } catch (err) {

    console.error(err);

    alert("Không thêm được dòng mới");
  }
}
// =======================
// AUTO LOGIN
// =======================
window.onload = function () {

  const user = localStorage.getItem("userEmail");

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