// =======================
// LOGIN MODULE
// src/auth/login.js
// =======================

import {
  auth
}
from "../config/firebase.js";

import {
  loadTasks,
  showTracker
}
from "../task/task.js";

import {
  loadUserMusicSettings
}
from "../music/music.js";

import {
  requestNotificationPermission
}
from "../notification/notification.js";


// =======================
// UI
// =======================

function showLoggedInUI(
  user
) {

  const login =
    document.getElementById(
      "loginPage"
    );

  const tracker =
    document.getElementById(
      "trackerPage"
    );

  if (
    login
  ) {

    login.style.display =
      "none";

  }

  if (
    tracker
  ) {

    tracker.style.display =
      "block";

  }

  const userName =
    document.getElementById(
      "userName"
    );

  if (

    userName

  ) {

    userName.textContent =

      user.displayName

      ||

      user.email

      ||

      "";

  }

}


function showLoggedOutUI() {

  const login =
    document.getElementById(
      "loginPage"
    );

  const tracker =
    document.getElementById(
      "trackerPage"
    );

  const backup =
    document.getElementById(
      "backupPage"
    );

  if (
    login
  ) {

    login.style.display =
      "block";

  }

  if (
    tracker
  ) {

    tracker.style.display =
      "none";

  }

  if (
    backup
  ) {

    backup.style.display =
      "none";

  }

}


// =======================
// LOGIN
// =======================

export async function login() {

  try {

    const email =
      document
      .getElementById(
        "email"
      )
      ?.value
      .trim();

    const password =
      document
      .getElementById(
        "password"
      )
      ?.value;

    if (

      !email ||

      !password

    ) {

      alert(
        "Nhập email và mật khẩu"
      );

      return;

    }

    const result =

      await auth
      .signInWithEmailAndPassword(

        email,

        password

      );

    const user =
      result.user;

    localStorage.setItem(
      "userEmail",
      user.email
    );

    showLoggedInUI(
      user
    );

  }

  catch (
    err
  ) {

    console.error(
      err
    );

    alert(
      "Đăng nhập thất bại"
    );

  }

}


// =======================
// LOGOUT
// =======================

export async function logout() {

  try {

    await auth.signOut();

    localStorage.removeItem(
      "userEmail"
    );

    localStorage.removeItem(
      "googleToken"
    );

    showLoggedOutUI();

  }

  catch (
    err
  ) {

    console.error(
      err
    );

  }

}


// =======================
// ENTER
// =======================

export function handleLoginEnter(
  event
) {

  if (

    event.key
    ===
    "Enter"

  ) {

    login();

  }

}


// =======================
// AUTH STATE
// =======================

export async function initAuthState() {

  return new Promise(

    resolve => {

      auth.onAuthStateChanged(

        async user => {

          try {

            if (

              !user

            ) {

              showLoggedOutUI();

              resolve(
                null
              );

              return;

            }

            localStorage.setItem(

              "userEmail",

              user.email

            );

            showLoggedInUI(
              user
            );

            await requestNotificationPermission();

            await loadTasks();

            await loadUserMusicSettings();

            showTracker();

            resolve(
              user
            );

          }

          catch (
            err
          ) {

            console.error(
              err
            );

            resolve(
              null
            );

          }

        }

      );

    }

  );

}
