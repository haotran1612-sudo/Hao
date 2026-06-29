// =======================
// FIREBASE INIT SIDE EFFECT (nếu cần chạy init)
// =======================
import "./firebase.js";

import { auth } from "./firebase.js";

// =======================
// AUTH
// =======================
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

// =======================
// MODULES
// =======================
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
// SAFE GLOBAL BINDING
// (giữ HTML onclick hoạt động như tracker cũ)
// =======================
Object.assign(window, {
  // auth
  login,
  logout,
  handleLoginEnter,

  registerUser,
  checkProviders,
  resetPassword,

  googleLogin,

  // modules (namespaced để tránh crash overwrite)
  Task: task,
  Review: review,
  Backup: backup,
  Calendar: calendar,
  Sync: sync,
  Music: music,
  Notification: notification,
  Dom: dom,
  DateUtils: dateUtils
});


// =======================
// APP INIT
// =======================
window.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("🚀 APP INIT START");

    // 1. AUTH STATE FIRST (quan trọng nhất)
    if (typeof initAuthState === "function") {
      await initAuthState();
    }

    // 2. WEEK HEADER UI
    dom.loadWeekHeader?.();
    dom.highlightTodayColumn?.();

    // 3. NOTIFICATION PERMISSION (không chặn app nếu fail)
    try {
      await notification.requestNotificationPermission?.();
    } catch (e) {
      console.warn("Notification permission skipped:", e);
    }

    // 4. MUSIC SETTINGS (không block UI)
    try {
      await music.loadUserMusicSettings?.();
    } catch (e) {
      console.warn("Music load failed:", e);
    }

    // 5. LOAD TASKS (core app)
    await task.loadTasks?.();

    // 6. REFRESH NOTIFICATION SCHEDULER
    notification.scheduleTodayNotifications?.();

    console.log("✅ APP READY");
  } catch (err) {
    console.error("❌ APP INIT ERROR:", err);
  }
});
