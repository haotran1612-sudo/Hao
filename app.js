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
import * as task from "./task/task.js";
import * as review from "./task/review.js";
import * as backup from "./task/backup.js";

// =======================
// CALENDAR
// =======================
import * as calendar from "./calendar/calendar.js";
import * as sync from "./calendar/sync.js";

// =======================
// MUSIC
// =======================
import * as music from "./music/music.js";

// =======================
// NOTIFICATION
// =======================
import * as notification from "./notification/notification.js";

// =======================
// UTILS
// =======================
import * as dom from "./utils/dom.js";
import * as dateUtils from "./utils/date.js";


// =======================
// GLOBAL EXPORT
// =======================
Object.assign(window, {

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

});


// =======================
// INIT
// =======================
window.addEventListener(
"DOMContentLoaded",

async()=>{

try{

await initAuthState?.();

dom.loadWeekHeader?.();

dom.highlightTodayColumn?.();

await task.loadTasks?.();

await music.loadUserMusicSettings?.();

notification.scheduleTodayNotifications?.();

console.log("APP READY");

}catch(err){

console.error(err);

}

}
);
