// =======================
// GOOGLE AUTH MODULE
// src/auth/google.js
// =======================

import {
  auth,
  provider,
  db
} from "../config/firebase.js";


// =======================
// SAVE USER
// =======================

async function saveUser(
  user
) {

  if (
    !user
  ) {

    return;

  }

  try {

    await db
      .collection(
        "users"
      )
      .doc(
        user.email
      )
      .set(

        {

          uid:
            user.uid,

          email:
            user.email,

          name:
            user.displayName
            || "",

          photo:
            user.photoURL
            || "",

          lastLogin:
            new Date()

        },

        {
          merge:
            true
        }

      );

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
// SAVE SESSION
// =======================

function saveSession(
  user,
  credential
) {

  localStorage.setItem(

    "userEmail",

    user.email

  );

  localStorage.setItem(

    "userName",

    user.displayName
    || ""

  );

  localStorage.setItem(

    "userPhoto",

    user.photoURL
    || ""

  );

  if (

    credential
    ?.accessToken

  ) {

    localStorage.setItem(

      "googleToken",

      credential
      .accessToken

    );

  }

}


// =======================
// REDIRECT
// =======================

function afterLogin(
  user
) {

  const loginPage =
    document.getElementById(
      "loginPage"
    );

  const tracker =
    document.getElementById(
      "trackerPage"
    );

  if (
    loginPage
  ) {

    loginPage.style.display =
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

      user.email;

  }

}


// =======================
// GOOGLE LOGIN
// =======================

export async function googleLogin() {

  try {

    provider.setCustomParameters({

      prompt:
        "select_account"

    });

    const result =

      await auth
      .signInWithPopup(
        provider
      );

    const user =
      result.user;

    const credential =

      firebase
      .auth
      .GoogleAuthProvider
      .credentialFromResult(
        result
      );

    saveSession(

      user,

      credential

    );

    await saveUser(
      user
    );

    afterLogin(
      user
    );

    return user;

  }

  catch (
    err
  ) {

    console.error(
      err
    );

    let message =

      "Đăng nhập Google thất bại";

    if (

      err.code
      ===
      "auth/popup-closed-by-user"

    ) {

      message =
        "Bạn đã đóng popup";

    }

    if (

      err.code
      ===
      "auth/popup-blocked"

    ) {

      message =
        "Popup bị chặn";

    }

    alert(
      message
    );

    return null;

  }

}


// =======================
// GET TOKEN
// =======================

export function getGoogleToken() {

  return localStorage.getItem(
    "googleToken"
  );

}


// =======================
// CHECK LOGIN
// =======================

export function isGoogleLogged() {

  return !!localStorage.getItem(
    "googleToken"
  );

}


// =======================
// CLEAR TOKEN
// =======================

export function clearGoogleSession() {

  localStorage.removeItem(
    "googleToken"
  );

}
