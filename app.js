// =======================
// CONFIG
// =======================
import "./config/firebase.js";

// =======================
// AUTH
// =======================
import {
  login,
  logout,
  handleLoginEnter,
  initAuthState
} from "./auth/login.js";

import {
  registerUser,
  checkProviders,
  resetPassword
} from "./auth/register.js";

import {
  googleLogin
} from "./auth/google.js";

// =======================
// TASK
// =======================
import {
  saveTask,
  loadTasks,
  updateTask,
  addRow,
  openTaskModal,
  closeTaskModal,
  resetForm,
  showTracker,
  showKanban,
  syncFullCalendarFromRow
} from "./task/task.js";

// =======================
// REVIEW
// =======================
import {
  rebuildReviewDays,
  scheduleTodayNotifications
} from "./task/review.js";

// =======================
// BACKUP
// =======================
import {
  archiveTask,
  showBackup,
  restoreTask,
  deleteBackupTask
} from "./task/backup.js";

// =======================
// CALENDAR
// =======================
import {
  toggleCreateCalendar,
  createCalendarFromRow
} from "./calendar/sync.js";

// =======================
// MUSIC
// =======================
import {
  saveMusicUrl,
  loadUserMusicSettings,
  toggleAutoPlayMusic,
  playMusicFromUrl,
  playSavedMusic,
  stopMusic
} from "./music/music.js";

// =======================
// NOTIFICATION
// =======================
import {
  requestNotificationPermission,
  refreshAllNotifications
} from "./notification/notification.js";

// =======================
// UTILS
// =======================
import {
  autoResize,
  highlightTodayColumn,
  loadWeekHeader
} from "./utils/dom.js";


// =======================
// EXPORT RA WINDOW
// (HTML onclick sẽ dùng)
// =======================

// auth
window.login = login;
window.logout = logout;
window.registerUser = registerUser;
window.googleLogin = googleLogin;
window.checkProviders = checkProviders;
window.resetPassword = resetPassword;
window.handleLoginEnter = handleLoginEnter;

// task
window.saveTask = saveTask;
window.loadTasks = loadTasks;
window.updateTask = updateTask;
window.addRow = addRow;

window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;

window.resetForm = resetForm;

window.showTracker = showTracker;
window.showKanban = showKanban;

// review
window.rebuildReviewDays = rebuildReviewDays;
window.scheduleTodayNotifications =
scheduleTodayNotifications;

// backup
window.archiveTask = archiveTask;
window.showBackup = showBackup;
window.restoreTask = restoreTask;
window.deleteBackupTask =
deleteBackupTask;

// calendar
window.toggleCreateCalendar =
toggleCreateCalendar;

window.createCalendarFromRow =
createCalendarFromRow;

window.syncFullCalendarFromRow =
syncFullCalendarFromRow;

// music
window.saveMusicUrl =
saveMusicUrl;

window.loadUserMusicSettings =
loadUserMusicSettings;

window.toggleAutoPlayMusic =
toggleAutoPlayMusic;

window.playMusicFromUrl =
playMusicFromUrl;

window.playSavedMusic =
playSavedMusic;

window.stopMusic =
stopMusic;

// notification
window.requestNotificationPermission =
requestNotificationPermission;

window.refreshAllNotifications =
refreshAllNotifications;

// utils
window.autoResize =
autoResize;

window.highlightTodayColumn =
highlightTodayColumn;


// =======================
// INIT APP
// =======================
document.addEventListener(
  "DOMContentLoaded",
  async () => {

    try {

      loadWeekHeader();

      await initAuthState();

      await requestNotificationPermission();

      highlightTodayColumn();

      scheduleTodayNotifications();

      console.log(
        "✅ TaskFlow initialized"
      );

    } catch (err) {

      console.error(
        "Init error:",
        err
      );

    }

  }
);
