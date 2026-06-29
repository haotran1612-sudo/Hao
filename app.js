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
}
from "./auth/login.js";

import {
registerUser,
checkProviders,
resetPassword
}
from "./auth/register.js";

import {
googleLogin
}
from "./auth/google.js";

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
showKanban

}
from "./task/task.js";

import {

buildReviewDays,
buildReviewSchedule,
rebuildReviewDays,
parseReviewTasks,

createCalendarFromReviewCells,
createReviewCalendarForRow,

scheduleTodayNotifications,
hasReviewData

}
from "./task/review.js";

import {

archiveTask,
showBackup,
restoreTask,
deleteBackupTask

}
from "./task/backup.js";

// =======================
// CALENDAR
// =======================

import {

createCalendarEvent,
createReviewCalendarTask,
findCalendarEventByKey,

buildMainEventKey,
buildReviewEventKey

}
from "./calendar/calendar.js";

import {

toggleCreateCalendar,
createCalendarFromRow,
syncFullCalendarFromRow

}
from "./calendar/sync.js";

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

}
from "./music/music.js";

// =======================
// NOTIFICATION
// =======================

import {

requestNotificationPermission,

showTaskNotification,

scheduleNotification,

refreshAllNotifications,

showInAppPopup

}
from "./notification/notification.js";

// =======================
// UTILS
// =======================

import {

autoResize,

highlightTodayColumn,

loadWeekHeader,

formatDate,

getCurrentWeekDates

}
from "./utils/dom.js";

import {

normalizeDate,

isSameDate,

isDateInRange,

diffDays,

diffMonths,

isOccurrenceForTaskType

}
from "./utils/date.js";

// =======================
// GLOBAL WINDOW
// =======================

Object.assign(
window,

{

// AUTH
login,
logout,
handleLoginEnter,
registerUser,
checkProviders,
resetPassword,
googleLogin,

// TASK
saveTask,
loadTasks,
updateTask,
addRow,

openTaskModal,
closeTaskModal,
resetForm,

showTracker,
showKanban,

// REVIEW
buildReviewDays,
buildReviewSchedule,
rebuildReviewDays,

parseReviewTasks,

createCalendarFromReviewCells,

createReviewCalendarForRow,

scheduleTodayNotifications,

hasReviewData,

// BACKUP
archiveTask,
showBackup,
restoreTask,
deleteBackupTask,

// CALENDAR
createCalendarEvent,
createReviewCalendarTask,

findCalendarEventByKey,

buildMainEventKey,
buildReviewEventKey,

toggleCreateCalendar,
createCalendarFromRow,

syncFullCalendarFromRow,

// MUSIC
saveMusicUrl,

loadUserMusicSettings,

toggleAutoPlayMusic,

playMusicFromUrl,

playSavedMusic,

stopMusic,

extractYoutubeVideoId,

buildYoutubeEmbedUrl,

// NOTIFICATION
requestNotificationPermission,

showTaskNotification,

scheduleNotification,

refreshAllNotifications,

showInAppPopup,

// DOM
autoResize,

highlightTodayColumn,

loadWeekHeader,

formatDate,

getCurrentWeekDates,

// DATE
normalizeDate,

isSameDate,

isDateInRange,

diffDays,

diffMonths,

isOccurrenceForTaskType

}

);

// =======================
// INIT APP
// =======================

window.addEventListener(
"DOMContentLoaded",

async ()=>{

try{

// login state
initAuthState();

// UI
loadWeekHeader();

highlightTodayColumn();

// load music
await loadUserMusicSettings();

// notification
await requestNotificationPermission();

// task
await loadTasks();

}catch(err){

console.error(
"APP INIT ERROR",
err
);

}

}

);
