// FIREBASE
import "./firebase.js";

// AUTH
import {
login,
logout,
handleLoginEnter,
initAuthState
}
from "./login.js";

import {
registerUser,
checkProviders,
resetPassword
}
from "./register.js";

import {
googleLogin
}
from "./google.js";

// MODULES
import * as task from "./task.js";
import * as review from "./review.js";
import * as backup from "./backup.js";

import * as calendar from "./calendar.js";
import * as sync from "./sync.js";

import * as music from "./music.js";

import * as notification from "./notification.js";

import * as dom from "./dom.js";

import * as dateUtils from "./date.js";

// EXPORT WINDOW
Object.assign(
window,
{
login,
logout,
handleLoginEnter,

registerUser,
checkProviders,
resetPassword,

googleLogin,

...task,
...review,
...backup,

...calendar,
...sync,

...music,

...notification,

...dom,

...dateUtils
}
);

// INIT
window.addEventListener(
"DOMContentLoaded",

async()=>{

try{

if(initAuthState)
await initAuthState();

if(dom.loadWeekHeader)
dom.loadWeekHeader();

if(dom.highlightTodayColumn)
dom.highlightTodayColumn();

if(music.loadUserMusicSettings)
await music.loadUserMusicSettings();

if(notification.requestNotificationPermission)
await notification.requestNotificationPermission();

if(task.loadTasks)
await task.loadTasks();

console.log(
"APP READY"
);

}catch(e){

console.error(
e
);

}

}
);
