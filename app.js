import "./firebase.js";

import {
  auth
} from "./firebase.js";

// AUTH
import {
  login,
  logout,
  handleLoginEnter,
  initAuthState
} from "./login.js";

import {
  registerUser,
  checkProviders,
  resetPassword
} from "./register.js";

import { googleLogin } from "./google.js";

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


// =======================
// FIX GLOBAL (QUAN TRỌNG)
// =======================
window.login = login;
window.logout = logout;
window.handleLoginEnter = handleLoginEnter;

window.registerUser = registerUser;
window.checkProviders = checkProviders;
window.resetPassword = resetPassword;

window.googleLogin = googleLogin;

// TASK / REVIEW / ETC (GIỮ ONCLICK CŨ CHẠY)
Object.assign(window, {
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
// INIT APP
// =======================
window.addEventListener("DOMContentLoaded", async () => {
  try {

    console.log("APP START");

    // AUTH STATE
    if (initAuthState) {
      await initAuthState();
    }

    // UI
    dom.loadWeekHeader?.();
    dom.highlightTodayColumn?.();

    // NOTIFICATION
    await notification.requestNotificationPermission?.();

    // TASKS
    await task.loadTasks?.();

    // MUSIC
    await music.loadUserMusicSettings?.();

    console.log("APP READY");

  } catch (err) {
    console.error("APP ERROR:", err);
  }
});
