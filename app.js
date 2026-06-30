// =======================
// FIREBASE
// =======================
import "./config/firebase.js";
import { auth } from "./config/firebase.js";

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

// =======================
// REVIEW
// =======================
import {
rebuildReviewDays,
createCalendarFromReviewCells,
createReviewCalendarForRow
}
from "./task/review.js";

// =======================
// BACKUP
// =======================
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
stopMusic
}
from "./music/music.js";

// =======================
// NOTIFICATION
// =======================
import {
requestNotificationPermission,
refreshAllNotifications
}
from "./notification/notification.js";

// =======================
// DOM
// =======================
import {
loadWeekHeader
}
from "./utils/dom.js";


// =======================
// BIND GLOBAL WINDOW
// =======================

// AUTH
window.login = login;
window.logout = logout;
window.googleLogin = googleLogin;
window.registerUser = registerUser;
window.checkProviders = checkProviders;
window.resetPassword = resetPassword;
window.handleLoginEnter = handleLoginEnter;

// TASK
window.saveTask = saveTask;
window.loadTasks = loadTasks;
window.updateTask = updateTask;
window.addRow = addRow;

window.openTaskModal =
openTaskModal;

window.closeTaskModal =
closeTaskModal;

window.resetForm =
resetForm;

window.showTracker =
showTracker;

window.showKanban =
showKanban;

// REVIEW
window.rebuildReviewDays =
rebuildReviewDays;

window.createCalendarFromReviewCells =
createCalendarFromReviewCells;

window.createReviewCalendarForRow =
createReviewCalendarForRow;

// BACKUP
window.archiveTask =
archiveTask;

window.showBackup =
showBackup;

window.restoreTask =
restoreTask;

window.deleteBackupTask =
deleteBackupTask;

// CALENDAR
window.toggleCreateCalendar =
toggleCreateCalendar;

window.createCalendarFromRow =
createCalendarFromRow;

window.syncFullCalendarFromRow =
syncFullCalendarFromRow;

// MUSIC
window.saveMusicUrl =
saveMusicUrl;

window.toggleAutoPlayMusic =
toggleAutoPlayMusic;

window.playMusicFromUrl =
playMusicFromUrl;

window.playSavedMusic =
playSavedMusic;

window.stopMusic =
stopMusic;

// NOTIFICATION
window.refreshAllNotifications =
refreshAllNotifications;


// =======================
// APP INIT
// =======================
document.addEventListener(
"DOMContentLoaded",
async ()=>{

try{

loadWeekHeader();

if(
typeof initAuthState ===
"function"
){

await initAuthState();

}else{

auth.onAuthStateChanged(
async(user)=>{

if(user){

localStorage.setItem(
"userEmail",
user.email || ""
);

document.getElementById(
"loginPage"
).style.display =
"none";

document.getElementById(
"appPage"
).style.display =
"block";

const welcome =
document.getElementById(
"welcomeUser"
);

if(welcome){

welcome.innerText =
user.email;

}

await requestNotificationPermission();

await loadTasks();

await loadUserMusicSettings();

}else{

localStorage.removeItem(
"userEmail"
);

document.getElementById(
"loginPage"
).style.display =
"block";

document.getElementById(
"appPage"
).style.display =
"none";

}

});

}

}catch(err){

console.error(
"APP INIT ERROR",
err
);

}

});
