export function normalizeDate(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isSameDate(a, b) {
  return normalizeDate(a).getTime() === normalizeDate(b).getTime();
}

export function getCurrentWeekDates() {
  const today = new Date();
  const monday = new Date(today);
  let dow = today.getDay();
  dow = dow === 0 ? 6 : dow - 1;
  monday.setDate(today.getDate() - dow);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function parseReviewTasks(text) {
  if (!text) return [];
  const tasks = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    let m = t.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})\s+(.+)$/);

    if (m) {
      tasks.push({
        hour: +m[1],
        minute: +m[2],
        endHour: +m[3],
        endMinute: +m[4],
        title: m[5]
      });
      continue;
    }

    m = t.match(/^(\d{1,2}):(\d{2})\s+(.+)$/);
    if (m) {
      tasks.push({
        hour: +m[1],
        minute: +m[2],
        endHour: null,
        endMinute: null,
        title: m[3],
        raw: t
      });
    }
  }
  return tasks;
}


import {
 googleLogin,
 logout
}
from "./googleSync.js";

export function showCalendar(){
 document.getElementById(
   "calendarPage"
 ).style.display="block";

 document.getElementById(
   "trackerPage"
 ).style.display="none";

 document.getElementById(
   "backupPage"
 ).style.display="none";
}

export function showTracker(){

 document.getElementById(
   "trackerPage"
 ).style.display="block";

 document.getElementById(
   "calendarPage"
 ).style.display="none";

 document.getElementById(
   "backupPage"
 ).style.display="none";
}

export function showBackup(){

 document.getElementById(
   "backupPage"
 ).style.display="block";

 document.getElementById(
   "trackerPage"
 ).style.display="none";

 document.getElementById(
   "calendarPage"
 ).style.display="none";
}

export function showKanban(){

 console.log(
   "kanban"
 );

}

export function openTaskModal(){

 document.getElementById(
   "taskModal"
 ).style.display="block";

}

export function initUI(){

 console.log(
   "ui started"
 );

}

// expose cho HTML onclick
window.showCalendar = showCalendar;
window.showTracker = showTracker;
window.showBackup = showBackup;
window.showKanban = showKanban;

window.openTaskModal = openTaskModal;

window.googleLogin = googleLogin;
window.logout = logout;


import { loadTasks } from "./task.js";

export function initUI() {
  window.showTracker = () => {
    document.getElementById("trackerPage").style.display = "block";
    loadTasks();
  };

  window.showKanban = () => {
    document.querySelector(".kanban").style.display = "flex";
  };

  window.openTaskModal = () =>
    document.getElementById("taskModal").style.display = "block";

  window.closeTaskModal = () =>
    document.getElementById("taskModal").style.display = "none";
}
