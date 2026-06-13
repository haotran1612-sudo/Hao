// =======================
// FIREBASE INIT
// =======================
const firebaseConfig = {
  apiKey: "...",
  authDomain: "whoami-73408.firebaseapp.com",
  projectId: "whoami-73408",
  storageBucket: "whoami-73408.appspot.com",
  messagingSenderId: "755566064562",
  appId: "1:755566064562:web:15d0ec2626cf8aa4feeaab"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// =======================
// LOGIN (DEMO)
// =======================
function login() {
  const email = document.getElementById("loginEmail").value;

  localStorage.setItem("userEmail", email);

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("appPage").style.display = "block";

  document.getElementById("welcomeUser").innerText = email;

  loadTasks();
}


// =======================
// REGISTER (DEMO)
// =======================
function registerUser() {
  alert("Đang dùng Firebase demo (chưa bật Auth)");
}


// =======================
// LOGOUT
// =======================
function logout() {
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
// SAVE TASK (FIREBASE)
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

    if (task.priority === "Urgent") {
      tr.classList.add("urgent-row");
    }

    tr.innerHTML = `
      <td>
        <input type="datetime-local"
          value="${task.start || ""}"
          onchange="updateTask('${doc.id}','start',this.value)">
      </td>

      <td>
        <input type="datetime-local"
          value="${task.deadline || ""}"
          onchange="updateTask('${doc.id}','deadline',this.value)">
      </td>

      <td>
        <input value="${task.taskName || ""}"
          onchange="updateTask('${doc.id}','taskName',this.value)">
      </td>

      <td>${task.priority || ""}</td>
      <td>${task.status || ""}</td>
      <td>${task.taskType || ""}</td>
    `;

    tbody.appendChild(tr);
  });
}


// =======================
// UPDATE TASK (FIREBASE ONLY)
// =======================
async function updateTask(id, field, value) {
  try {
    await db.collection("tasks").doc(id).update({
      [field]: value
    });

    console.log("Updated:", field, value);
  } catch (err) {
    console.log("Update error:", err);
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