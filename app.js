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

  const ids = [
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

  ids.forEach(id => {

    const el = document.getElementById(id);

    if (el) el.value = "";
  });

  if (document.getElementById("taskType"))
    document.getElementById("taskType").value = "Daily";

  if (document.getElementById("priority"))
    document.getElementById("priority").value = "Normal";

  if (document.getElementById("status"))
    document.getElementById("status").value = "Todo";

  if (document.getElementById("applyCalendar"))
    document.getElementById("applyCalendar").checked = false;

  if (document.getElementById("sendMail"))
    document.getElementById("sendMail").checked = false;
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
        <td>${task.start || ""}</td>
        <td>${task.deadline || ""}</td>
        <td>${task.taskName || ""}</td>
        <td>${task.priority || ""}</td>
        <td>${task.status || ""}</td>
        <td>${task.taskType || ""}</td>
      `;

      tbody.appendChild(tr);
    });

    console.log("Load thành công:", snapshot.size);

  } catch (err) {

    console.error("LOAD TASK ERROR:", err);
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