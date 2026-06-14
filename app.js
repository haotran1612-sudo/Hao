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

let currentUser = null;


// =======================
// REGISTER
// =======================
function registerUser() {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Đăng ký thành công");
    })
    .catch(err => {
      alert(err.message);
    });
}


// =======================
// LOGIN
// =======================
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      currentUser = userCredential.user.email;

      localStorage.setItem("userEmail", currentUser);

      document.getElementById("loginPage").style.display = "none";
      document.getElementById("appPage").style.display = "block";

      document.getElementById("welcomeUser").innerText = currentUser;

      loadTasks();
    })
    .catch(err => {
      alert(err.message);
    });
}


// =======================
// LOGOUT
// =======================
function logout() {
  auth.signOut();
  localStorage.clear();
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

      taskName: document.getElementById("taskName").value,
      start: document.getElementById("startDate").value,
      deadline: document.getElementById("deadline").value,

      taskType: document.getElementById("taskType").value,
      priority: document.getElementById("priority").value,
      status: document.getElementById("status").value,

      calendarTitle: document.getElementById("calendarTitle").value,
      location: document.getElementById("location").value,
      attendees: document.getElementById("attendees").value,

      reminder: document.getElementById("reminder").value,
      apply: document.getElementById("applyCalendar").checked,
      sendMail: document.getElementById("sendMail").checked,

      createdAt: new Date()
    });

    alert("Tạo task thành công");

    closeTaskModal();
    resetForm();
    loadTasks();

  } catch (err) {
    console.log(err);
    alert("Lỗi tạo task");
  }
}


// =======================
// RESET FORM
// =======================
function resetForm() {
  document.getElementById("taskName").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("deadline").value = "";
  document.getElementById("taskType").value = "Daily";
  document.getElementById("priority").value = "Normal";
  document.getElementById("status").value = "Todo";
  document.getElementById("calendarTitle").value = "";
  document.getElementById("location").value = "";
  document.getElementById("attendees").value = "";
  document.getElementById("meetLink").value = "";
  document.getElementById("reminder").value = "30";
  document.getElementById("applyCalendar").checked = false;
  document.getElementById("sendMail").checked = false;
}


// =======================
// LOAD TASKS
// =======================
async function loadTasks() {
  const email = localStorage.getItem("userEmail");

  const snapshot = await db.collection("tasks")
    .where("email", "==", email)
    .orderBy("createdAt", "desc")
    .get();

  const tbody = document.getElementById("taskTableBody");
  tbody.innerHTML = "";

  snapshot.forEach(doc => {
    const task = doc.data();

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input type="datetime-local" value="${task.start || ""}"></td>
      <td><input type="datetime-local" value="${task.deadline || ""}"></td>
      <td><input value="${task.taskName || ""}"></td>
      <td>${task.priority || ""}</td>
      <td>${task.status || ""}</td>
      <td>${task.taskType || ""}</td>
    `;

    tbody.appendChild(tr);
  });
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
// SHOW TRACKER
// =======================
function showTracker() {

  const tracker = document.getElementById("trackerPage");
  const kanban = document.querySelector(".kanban");

  if (tracker) tracker.style.display = "block";
  if (kanban) kanban.style.display = "none";
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
      taskType: "Daily",
      priority: "Normal",
      status: "Todo",
      createdAt: new Date()
    });

    loadTasks();

  } catch (err) {

    console.error(err);
    alert("Không thêm được dòng mới");
  }
}