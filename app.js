// =======================
// FIREBASE
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

import * as task
from "./task/task.js";

import * as review
from "./task/review.js";

import * as backup
from "./task/backup.js";

// =======================
// CALENDAR
// =======================

import * as calendar
from "./calendar/calendar.js";

import * as sync
from "./calendar/sync.js";

// =======================
// MUSIC
// =======================

import * as music
from "./music/music.js";

// =======================
// NOTIFICATION
// =======================

import * as notification
from "./notification/notification.js";

// =======================
// UTILS
// =======================

import * as dom
from "./utils/dom.js";

import * as dateUtils
from "./utils/date.js";

// =======================
// EXPORT TO WINDOW
// =======================

Object.assign(
window,

{

// auth
login,
logout,
handleLoginEnter,
registerUser,
checkProviders,
resetPassword,
googleLogin,

// task
...task,

// review
...review,

// backup
...backup,

// calendar
...calendar,

// sync
...sync,

// music
...music,

// notification
...notification,

// utils
...dom,
...dateUtils

}

);

// =======================
// INIT
// =======================

window.addEventListener(
"DOMContentLoaded",

async()=>{

try{

if(
typeof initAuthState===
"function"
){

await initAuthState();

}

if(
typeof dom.loadWeekHeader===
"function"
){

dom.loadWeekHeader();

}

if(
typeof dom.highlightTodayColumn===
"function"
){

dom.highlightTodayColumn();

}

if(
typeof music.loadUserMusicSettings===
"function"
){

await music.loadUserMusicSettings();

}

if(
typeof notification.requestNotificationPermission===
"function"
){

await notification.requestNotificationPermission();

}

if(
typeof task.loadTasks===
"function"
){

await task.loadTasks();

}

console.log(
"TaskFlow started"
);

}catch(
err
){

console.error(
"INIT ERROR",
err
);

}

}

);
