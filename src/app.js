// =======================
// FIREBASE
// =======================

import { auth } from "./config/firebase.js";

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
  buildReviewDays,
  buildReviewSchedule,
  rebuildReviewDays,
  parseReviewTasks,
  createCalendarFromReviewCells,
  createReviewCalendarForRow,
  scheduleTodayNotifications,
  hasReviewData
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
  createCalendarEvent,
  createReviewCalendarTask,
  findCalendarEventByKey,
  buildMainEventKey,
  buildReviewEventKey
} from "./calendar/calendar.js";

import {
  toggleCreateCalendar,
  createCalendarFromRow,
  syncFullCalendarFromRow as syncCalendar
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
  stopMusic,
  extractYoutubeVideoId,
  buildYoutubeEmbedUrl
} from "./music/music.js";

// =======================
// NOTIFICATION
// =======================
import {
  requestNotificationPermission,
  showTaskNotification,
  scheduleNotification,
  refreshAllNotifications,
  showInAppPopup
} from "./notification/notification.js";

// =======================
// UTILS
// =======================
import {
  autoResize,
  highlightTodayColumn,
  loadWeekHeader,
  formatDate,
  getCurrentWeekDates
} from "./utils/dom.js";

import {
  normalizeDate,
  isSameDate,
  isDateInRange,
  diffDays,
  diffMonths,
  isOccurrenceForTaskType
} from "./utils/date.js";


// ======================================================
// BIND WINDOW
// (giữ tương thích onclick trong HTML cũ)
// ======================================================

Object.assign(window, {

  // auth
  login,
  logout,
  registerUser,
  googleLogin,
  checkProviders,
  resetPassword,
  handleLoginEnter,

  // task
  saveTask,
  loadTasks,
  updateTask,
  addRow,
  openTaskModal,
  closeTaskModal,
  resetForm,
  showTracker,
  showKanban,
  syncFullCalendarFromRow: syncCalendar,

  // review
  buildReviewDays,
  buildReviewSchedule,
  rebuildReviewDays,
  parseReviewTasks,
  createCalendarFromReviewCells,
  createReviewCalendarForRow,
  scheduleTodayNotifications,
  hasReviewData,

  // backup
  archiveTask,
  showBackup,
  restoreTask,
  deleteBackupTask,

  // calendar
  toggleCreateCalendar,
  createCalendarFromRow,
  createCalendarEvent,
  createReviewCalendarTask,
  findCalendarEventByKey,
  buildMainEventKey,
  buildReviewEventKey,

  // music
  saveMusicUrl,
  loadUserMusicSettings,
  toggleAutoPlayMusic,
  playMusicFromUrl,
  playSavedMusic,
  stopMusic,
  extractYoutubeVideoId,
  buildYoutubeEmbedUrl,

  // notification
  requestNotificationPermission,
  showTaskNotification,
  scheduleNotification,
  refreshAllNotifications,
  showInAppPopup,

  // utils
  autoResize,
  highlightTodayColumn,
  loadWeekHeader,
  formatDate,
  getCurrentWeekDates,

  normalizeDate,
  isSameDate,
  isDateInRange,
  diffDays,
  diffMonths,
  isOccurrenceForTaskType
});


// ======================================================
// INIT APP
// ======================================================

async function initApp() {

  try {

    loadWeekHeader();

    await initAuthState();

    const user = auth.currentUser;

    if (user) {

      await requestNotificationPermission();

      await loadTasks();

      await loadUserMusicSettings();

      scheduleTodayNotifications();

      showTracker();

    }

  } catch (err) {

    console.error("APP INIT ERROR:", err);

  }

}


// ======================================================
// START
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  initApp
);
