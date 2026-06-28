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
