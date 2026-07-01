// =======================
// GOOGLE AUTH MODULE
// =======================

import { auth, provider } from "../config/firebase.js";

import {
  requestNotificationPermission
} from "../notification/notification.js";

import {
  loadTasks
} from "../task/task.js";

import {
  loadUserMusicSettings
} from "../music/music.js";

// =======================
// GOOGLE LOGIN
// =======================

export async function googleLogin() {
  try {
    const result = await auth.signInWithPopup(provider);

    const credential = result.credential || null;
    const token = credential?.accessToken || "";
    const user = result.user;

    // save token for Google Calendar API
    if (token) {
      localStorage.setItem("googleToken", token);
    }

    // save user
    if (user?.email) {
      localStorage.setItem("userEmail", user.email);

      const welcome = document.getElementById("welcomeUser");
      if (welcome) welcome.innerText = user.email;
    }

    // UI switch
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";

    // init app features
    await requestNotificationPermission();
    await loadTasks();
    await loadUserMusicSettings();

    alert("Google login + Calendar connected thành công");
  } catch (err) {
    console.error("googleLogin error:", err);
    alert(err.message || "Google login failed");
  }
}

// =======================
// BIND GLOBAL
// =======================

window.googleLogin = googleLogin;
