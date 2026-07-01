// =======================
// APP ENTRY POINT
// =======================
import { logout } from "./auth/login.js";

// bắt buộc expose ra global
window.logout = logout;

import { addRow } from "./task/task.js";
window.addRow = addRow;
import { googleLogin } from "./auth/google.js";

// bắt buộc expose ra global
window.googleLogin = googleLogin;
// Firebase (core)
import { auth } from "./config/firebase.js";

// TASK
import {
  loadTasks,
  saveTask,
  addRow,
  updateTask,
  openTaskModal,
  closeTaskModal,
  resetForm,
  showTracker,
  showKanban
} from "./task/task.js";

// REVIEW
import {
  rebuildReviewDays
} from "./task/review.js";

// BACKUP
import {
  archiveTask,
  loadBackup,
  restoreTask,
  deleteBackupTask
} from "./task/backup.js";

// CALENDAR SYNC
import {
  syncFullCalendarFromRow,
  toggleCreateCalendar
} from "./calendar/sync.js";

// MUSIC
import {
  saveMusicUrl,
  loadUserMusicSettings,
  toggleAutoPlayMusic,
  playMusicFromUrl,
  playSavedMusic,
  stopMusic
} from "./music/music.js";

// NOTIFICATION
import {
  requestNotificationPermission
} from "./notification/notification.js";

// DOM UTILS
import {
  loadWeekHeader,
  autoResize,
  highlightTodayColumn
} from "./utils/dom.js";

// =======================
// BIND GLOBAL FUNCTIONS (for HTML onclick/onchange)
// =======================

function bindWindow() {
  Object.assign(window, {
    // task
    loadTasks,
    saveTask,
    addRow,
    updateTask,
    openTaskModal,
    closeTaskModal,
    resetForm,
    showTracker,
    showKanban,

    // backup
    archiveTask,
    loadBackup,
    restoreTask,
    deleteBackupTask,

    // review
    rebuildReviewDays,

    // calendar
    syncFullCalendarFromRow,
    toggleCreateCalendar,

    // music
    saveMusicUrl,
    loadUserMusicSettings,
    toggleAutoPlayMusic,
    playMusicFromUrl,
    playSavedMusic,
    stopMusic,

    // utils
    autoResize,
    highlightTodayColumn
  });
}

// =======================
// INIT APP
// =======================

async function initApp() {
  loadWeekHeader();
  bindWindow();

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      localStorage.setItem("userEmail", user.email || "");

      document.getElementById("loginPage").style.display = "none";
      document.getElementById("appPage").style.display = "block";

      document.getElementById("welcomeUser").innerText =
        user.email || "";

      await requestNotificationPermission();
      await loadTasks();
      await loadUserMusicSettings();
    } else {
      localStorage.removeItem("userEmail");

      document.getElementById("loginPage").style.display = "block";
      document.getElementById("appPage").style.display = "none";
    }
  });
}

// =======================
// DOM READY
// =======================

document.addEventListener("DOMContentLoaded", initApp);
