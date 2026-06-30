import { db } from "../config/firebase.js";

import {
  buildReviewDays
} from "./review.js";

import {
  createCalendarFromRow
} from "../calendar/sync.js";

import {
  scheduleTodayNotifications
} from "../notification/notification.js";

import {
  autoResize,
  highlightTodayColumn,
  loadWeekHeader
} from "../utils/dom.js";

import {
  getCurrentWeekDates
} from "../utils/date.js";

import {
  openTaskModal,
  closeTaskModal,
  resetForm
} from "./task-ui.js";

// =======================
// SAVE TASK
// =======================
export async function saveTask() {
  try {
    const email = localStorage.getItem("userEmail");

    const taskData = {
      email,
      taskName: document.getElementById("taskName")?.value || "",
      start: document.getElementById("startDate")?.value || "",
      deadline: document.getElementById("deadline")?.value || "",
      processingTime: Number(document.getElementById("processingTime")?.value || 1),

      reviewDays: {
        day1: "", day2: "", day3: "", day4: "", day5: "", day6: "", day7: ""
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
    };

    const doc = await db.collection("tasks").add(taskData);

    if (taskData.start && localStorage.getItem("googleToken")) {
      await createCalendarFromRow(doc.id);
    }

    await loadTasks();
    closeTaskModal();
    resetForm();

  } catch (err) {
    console.error("saveTask error", err);
    alert(err.message);
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

      tr.innerHTML = renderTaskRow(doc.id, task, reviewDays);

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
// RENDER ROW (PURE UI)
// =======================
function renderTaskRow(id, task, reviewDays) {
  return `
  <td><input type="checkbox" onchange="archiveTask('${id}',this)"></td>

  <td><input type="datetime-local" value="${(task.start || '').substring(0,16)}"
    onchange="updateTask('${id}','start',this.value)"></td>

  <td><input type="datetime-local" value="${(task.deadline || '').substring(0,16)}"
    onchange="updateTask('${id}','deadline',this.value)"></td>

  <td><input type="number" value="${task.processingTime ?? 1}"
    onchange="updateTask('${id}','processingTime',Number(this.value))"></td>

  <td><input type="text" value="${task.taskName || ''}"
    onchange="updateTask('${id}','taskName',this.value)"></td>

  ${renderReviewCells(id, reviewDays)}

  <td>
    <select onchange="updateTask('${id}','priority',this.value)">
      <option ${task.priority==="Normal"?"selected":""}>Normal</option>
      <option ${task.priority==="Urgent"?"selected":""}>Urgent</option>
    </select>
  </td>

  <td>
    <select onchange="updateTask('${id}','status',this.value)">
      <option ${task.status==="Todo"?"selected":""}>Todo</option>
      <option ${task.status==="Processing"?"selected":""}>Processing</option>
      <option ${task.status==="Done"?"selected":""}>Done</option>
    </select>
  </td>

  <td>
    <select onchange="updateTask('${id}','taskType',this.value)">
      <option ${task.taskType==="Daily"?"selected":""}>Daily</option>
      <option ${task.taskType==="Weekly"?"selected":""}>Weekly</option>
      <option ${task.taskType==="Monthly"?"selected":""}>Monthly</option>
      <option ${task.taskType==="Yearly"?"selected":""}>Yearly</option>
      <option ${task.taskType==="Ôn tập"?"selected":""}>Ôn tập</option>
    </select>
  </td>

  <td><input value="${task.calendarTitle || ''}"
    onchange="updateTask('${id}','calendarTitle',this.value)"></td>

  <td style="text-align:center;">
    <input type="checkbox" ${task.apply ? "checked" : ""}
      onchange="toggleCreateCalendar('${id}',this)">
  </td>

  <td>
    <button data-id="${id}" onclick="syncFullCalendarFromRow(this)">📅</button>
    <button onclick="rebuildReviewDays('${id}')">🔄</button>
  </td>
  `;
}

// =======================
// REVIEW CELL RENDER
// =======================
function renderReviewCells(id, reviewDays) {
  let html = "";

  for (let i = 1; i <= 7; i++) {
    html += `
      <td>
        <textarea class="review-cell"
          oninput="autoResize(this)"
          onchange="
            updateTask('${id}','reviewDays.day${i}',this.value);
            scheduleTodayNotifications();
          ">${reviewDays["day"+i] || ""}</textarea>
      </td>
    `;
  }

  return html;
}

// =======================
// ADD ROW
// =======================
export async function addRow() {
  try {
    await db.collection("tasks").add({
      email: localStorage.getItem("userEmail"),
      taskName: "",
      start: "",
      deadline: "",
      processingTime: 0,

      reviewDays: {
        day1:"",day2:"",day3:"",day4:"",day5:"",day6:"",day7:""
      },

      priority:"Normal",
      status:"Todo",
      taskType:"Daily",

      repeat:"None",
      repeatInterval:1,
      repeatUntil:"",

      calendarTitle:"",
      calendarType:"Event",
      attendees:"",
      addMeet:false,

      location:"",
      description:"",

      apply:false,
      calendarId:"",
      meetLink:"",
      calendarStatus:"Create",

      autoDelete:false,
      reviewCalendarIds:[],

      createdAt:new Date()
    });

    loadTasks();
  } catch (err) {
    console.error(err);
    alert("Không thêm được dòng mới");
  }
}

// =======================
// UPDATE TASK (minimal bridge)
// =======================
export async function updateTask(id, field, value) {
  try {
    const updateData = {};
    updateData[field] = value;

    await db.collection("tasks").doc(id).update(updateData);

    if (
      ["taskType","start","deadline","taskName","processingTime"]
      .includes(field)
    ) {
      await db.collection("tasks").doc(id).update({
        reviewDays: {
          day1:"",day2:"",day3:"",day4:"",day5:"",day6:"",day7:""
        }
      });

      await loadTasks();
    }

  } catch (err) {
    console.error(err);
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
// SYNC CALENDAR
// =======================
export async function syncFullCalendarFromRow(btn) {
  const id = btn.getAttribute("data-id");
  const row = btn.closest("tr");

  await createCalendarFromRow(id, row);

  alert("Đồng bộ Calendar hoàn tất");
}

// =======================
// UI HELPERS EXPORT (optional binding)
// =======================
export {
  openTaskModal,
  closeTaskModal,
  resetForm
};
