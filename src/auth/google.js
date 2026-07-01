// =======================
// GOOGLE AUTH MODULE
// =======================

import { auth, provider } from "../config/firebase.js";

import { requestNotificationPermission } from "../notification/notification.js";
import { loadTasks } from "../task/task.js";
import { loadUserMusicSettings } from "../music/music.js";

// =======================
// UI HELPERS
// =======================

function showApp(userEmail) {
  const loginPage = document.getElementById("loginPage");
  const appPage = document.getElementById("appPage");
  const welcome = document.getElementById("welcomeUser");

  if (loginPage) loginPage.style.display = "none";
  if (appPage) appPage.style.display = "block";
  if (welcome) welcome.innerText = userEmail || "";
}

function saveSession(user, token) {
  if (user?.email) {
    localStorage.setItem("userEmail", user.email);
  }

  if (token) {
    localStorage.setItem("googleToken", token);
  }
}

// =======================
// GOOGLE LOGIN
// =======================

export async function googleLogin() {
  try {
    const result = await auth.signInWithPopup(provider);

    const credential = result.credential || null;
    const token = credential?.accessToken || "";
    const user = result.user;

    saveSession(user, token);
    showApp(user?.email);

    await requestNotificationPermission();
    await loadTasks();
    await loadUserMusicSettings();

    alert("Google login thành công");
  } catch (err) {
    console.error("googleLogin error:", err);
    alert(err.message || "Google login failed");
  }
}

// =======================
// BIND GLOBAL (for HTML onclick)
// =======================

window.googleLogin = googleLogin;
