 // =======================
// TASK MODULE
// =======================

import { auth, db } from "../config/firebase.js";

// utils
import {
  autoResize,
  highlightTodayColumn,
  loadWeekHeader,
  getCurrentWeekDates
} from "../utils/dom.js";

// review
import {
  buildReviewDays,
  buildReviewSchedule,
  rebuildReviewDays,
  parseReviewTasks,
  hasReviewData
} from "./review.js";

// calendar sync
import {
  createCalendarFromRow,
  syncFullCalendarFromRow,
  toggleCreateCalendar
} from "../calendar/sync.js";

// notification
import { scheduleTodayNotifications } from "../notification/notification.js";

// =======================
// MODAL
// =======================

export function openTaskModal() {
  document.getElementById("taskModal").style.display = "block";
}

export function closeTaskModal() {
  document.getElementById("taskModal").style.display = "none";
}

// =======================
// RESET FORM
// =======================

export function resetForm() {
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
// SAVE TASK
// =======================

export async function saveTask() {
  try {
    const taskData = {
      email: localStorage.getItem("userEmail"),

      taskName: document.getElementById("taskName")?.value || "",
      start: document.getElementById("startDate")?.value || "",
      deadline: document.getElementById("deadline")?.value || "",

      taskType: document.getElementById("taskType")?.value || "Daily",
      priority: document.getElementById("priority")?.value || "Normal",
      status: document.getElementById("status")?.value || "Todo",

      calendarTitle: document.getElementById("calendarTitle")?.value || "",
      calendarType: document.getElementById("calendarType")?.value || "Event",
      attendees: document.getElementById("attendees")?.value || "",
      addMeet: document.getElementById("addMeet")?.checked || false,

      location: document.getElementById("location")?.value || "",
      description: document.getElementById("description")?.value || "",

      repeat: document.getElementById("repeat")?.value || "None",
      repeatInterval: Number(document.getElementById("repeatInterval")?.value) || 1,
      repeatUntil: document.getElementById("repeatUntil")?.value || "",

      autoDelete: document.getElementById("autoDelete")?.checked || false,
      sendMail: document.getElementById("sendMail")?.checked || false,

      apply: false,
      calendarId: "",
      meetLink: "",
      calendarStatus: "Create",

      reviewDays: {
        day1: "",
        day2: "",
        day3: "",
        day4: "",
        day5: "",
        day6: "",
        day7: ""
      },

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
// LOAD TASKS
// =======================

export async function loadTasks() {
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
      if (!task?.taskName) return;

      const reviewDays = buildReviewDays(task);
      const tr = document.createElement("tr");

      tr.innerHTML = `
<td style="text-align:center;">
  <input type="checkbox" onchange="archiveTask('${doc.id}', this)">
</td>

<td>
  <input type="datetime-local"
    value="${(task.start || "").substring(0, 16)}"
    onkeydown="return false"
    onchange="updateTask('${doc.id}','start',this.value)">
</td>

<td>
  <input type="datetime-local"
    value="${(task.deadline || "").substring(0, 16)}"
    onkeydown="return false"
    onchange="updateTask('${doc.id}','deadline',this.value)">
</td>

<td>
  <input type="number"
    value="${task.processingTime ?? ""}"
    onchange="updateTask('${doc.id}','processingTime',Number(this.value))">
</td>

<td>
  <input type="text"
    value="${task.taskName || ""}"
    onchange="updateTask('${doc.id}','taskName',this.value)">
</td>

<td>
  <textarea class="review-cell"
    oninput="autoResize(this)"
    onchange="updateTask('${doc.id}','reviewDays.day1',this.value)">
    ${reviewDays.day1 || ""}
  </textarea>
</td>

<td>
  <textarea class="review-cell"
    oninput="autoResize(this)"
    onchange="updateTask('${doc.id}','reviewDays.day2',this.value)">
    ${reviewDays.day2 || ""}
  </textarea>
</td>

<td>
  <textarea class="review-cell"
    oninput="autoResize(this)"
    onchange="updateTask('${doc.id}','reviewDays.day3',this.value)">
    ${reviewDays.day3 || ""}
  </textarea>
</td>

<td>
  <textarea class="review-cell"
    oninput="autoResize(this)"
    onchange="updateTask('${doc.id}','reviewDays.day4',this.value)">
    ${reviewDays.day4 || ""}
  </textarea>
</td>

<td>
  <textarea class="review-cell"
    oninput="autoResize(this)"
    onchange="updateTask('${doc.id}','reviewDays.day5',this.value)">
    ${reviewDays.day5 || ""}
  </textarea>
</td>

<td>
  <textarea class="review-cell"
    oninput="autoResize(this)"
    onchange="updateTask('${doc.id}','reviewDays.day6',this.value)">
    ${reviewDays.day6 || ""}
  </textarea>
</td>

<td>
  <textarea class="review-cell"
    oninput="autoResize(this)"
    onchange="updateTask('${doc.id}','reviewDays.day7',this.value)">
    ${reviewDays.day7 || ""}
  </textarea>
</td>

<td>
  <select onchange="updateTask('${doc.id}','priority',this.value)">
    <option value="Normal" ${task.priority === "Normal" ? "selected" : ""}>Normal</option>
    <option value="Urgent" ${task.priority === "Urgent" ? "selected" : ""}>Urgent</option>
  </select>
</td>

<td>
  <select onchange="updateTask('${doc.id}','status',this.value)">
    <option value="Todo" ${task.status === "Todo" ? "selected" : ""}>Todo</option>
    <option value="Processing" ${task.status === "Processing" ? "selected" : ""}>Processing</option>
    <option value="Done" ${task.status === "Done" ? "selected" : ""}>Done</option>
  </select>
</td>

<td>
  <button data-id="${doc.id}" onclick="syncFullCalendarFromRow(this)">📅</button>
  <button onclick="rebuildReviewDays('${doc.id}')">🔄</button>
</td>
`;

      tbody.appendChild(tr);
      tr.querySelectorAll(".review-cell").forEach(autoResize);
    });

    highlightTodayColumn();
    scheduleTodayNotifications();
  } catch (err) {
    console.error(err);
  }
}

// =======================
// ADD ROW
// =======================

export async function addRow() {
  try {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    await db.collection("tasks").add({
      email,

      taskName: "",
      start: "",
      deadline: "",
      processingTime: 0,

      reviewDays: {
        day1: "",
        day2: "",
        day3: "",
        day4: "",
        day5: "",
        day6: "",
        day7: ""
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

    await loadTasks();

  } catch (err) {
    console.error("addRow error:", err);
    alert(err.message || "Add row failed");
  }
}
// =======================
// VIEW SWITCH
// =======================

export function showTracker() {
  document.getElementById("trackerPage").style.display = "block";
  document.getElementById("backupPage").style.display = "none";

  const kanban = document.querySelector(".kanban");
  if (kanban) kanban.style.display = "none";

  loadWeekHeader();
  loadTasks();
}

export function showKanban() {
  document.getElementById("trackerPage").style.display = "none";
  document.getElementById("backupPage").style.display = "none";

  const kanban = document.querySelector(".kanban");
  if (kanban) kanban.style.display = "flex";
}

// =======================
// UPDATE TASK (CORE)
// =======================

export async function updateTask(id, field, value) {
  try {
    const data = {};
    data[field] = value;

    await db.collection("tasks").doc(id).update(data);

    if (
      field === "taskType" ||
      field === "start" ||
      field === "deadline" ||
      field === "taskName" ||
      field === "processingTime"
    ) {
      await db.collection("tasks").doc(id).update({
        reviewDays: {
          day1: "",
          day2: "",
          day3: "",
          day4: "",
          day5: "",
          day6: "",
          day7: ""
        }
      });

      await loadTasks();
    }
  } catch (err) {
    console.error(err);
  }
}

// =======================
// EXPORT BINDINGS (FOR app.js)
// =======================

window.saveTask = saveTask;
window.loadTasks = loadTasks;
window.addRow = addRow;
window.updateTask = updateTask;
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;
window.resetForm = resetForm;
window.showTracker = showTracker;
window.showKanban = showKanban;
window.syncFullCalendarFromRow = syncFullCalendarFromRow;
window.toggleCreateCalendar = toggleCreateCalendar;
