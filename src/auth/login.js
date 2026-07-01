// =======================
// EMAIL/PASSWORD AUTH MODULE
// =======================

import { auth } from "../config/firebase.js";

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

function saveSession(email) {
  if (email) {
    localStorage.setItem("userEmail", email);
  }
}

// =======================
// LOGIN
// =======================

export async function login() {
  try {
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value || "";

    if (!email) {
      alert("Vui lòng nhập email");
      return;
    }

    if (!password) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );

    const userEmail = userCredential.user.email;

    saveSession(userEmail);
    showApp(userEmail);

    await requestNotificationPermission();
    await loadTasks();
    await loadUserMusicSettings();

  } catch (err) {
    console.error("login error:", err);
    alert(err.message || "Đăng nhập thất bại");
  }
}

// =======================
// LOGOUT
// =======================

export async function logout() {
  try {
    await auth.signOut();

    localStorage.removeItem("userEmail");
    localStorage.removeItem("googleToken");

    location.reload();
  } catch (err) {
    console.error("logout error:", err);
    alert("Logout thất bại");
  }
}

// =======================
// ENTER KEY SUPPORT
// =======================

export function handleLoginEnter(event) {
  if (event.key === "Enter") {
    login();
  }
}

// =======================
// AUTH STATE LISTENER (AUTO LOGIN)
// =======================

export function initAuthListener() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const email = user.email || "";

      localStorage.setItem("userEmail", email);

      showApp(email);

      await requestNotificationPermission();
      await loadTasks();
      await loadUserMusicSettings();
    } else {
      localStorage.removeItem("userEmail");

      const loginPage = document.getElementById("loginPage");
      const appPage = document.getElementById("appPage");

      if (loginPage) loginPage.style.display = "block";
      if (appPage) appPage.style.display = "none";
    }
  });
}

// =======================
// BIND GLOBAL (HTML onclick)
// =======================

window.login = login;
window.logout = logout;
window.handleLoginEnter = handleLoginEnter;
