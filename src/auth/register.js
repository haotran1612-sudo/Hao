// =======================
// REGISTER MODULE
// src/auth/register.js
// =======================

import {
  auth,
  db
}
from "../config/firebase.js";


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

          createdAt:
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
// REGISTER
// =======================

export async function registerUser() {

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

    if (

      password.length
      <
      6

    ) {

      alert(
        "Mật khẩu tối thiểu 6 ký tự"
      );

      return;

    }

    const result =

      await auth
      .createUserWithEmailAndPassword(

        email,

        password

      );

    const user =
      result.user;

    await saveUser(
      user
    );

    localStorage.setItem(

      "userEmail",

      user.email

    );

    alert(
      "Đăng ký thành công"
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
      "Không thể đăng ký";

    switch (

      err.code

    ) {

      case
      "auth/email-already-in-use":

        message =
          "Email đã tồn tại";

        break;

      case
      "auth/invalid-email":

        message =
          "Email không hợp lệ";

        break;

      case
      "auth/weak-password":

        message =
          "Mật khẩu quá yếu";

        break;

    }

    alert(
      message
    );

    return null;

  }

}


// =======================
// CHECK PROVIDERS
// =======================

export async function checkProviders(
  email
) {

  try {

    const target =

      email

      ||

      document
      .getElementById(
        "email"
      )
      ?.value
      .trim();

    if (

      !target

    ) {

      return [];

    }

    const providers =

      await auth
      .fetchSignInMethodsForEmail(
        target
      );

    return providers;

  }

  catch (
    err
  ) {

    console.error(
      err
    );

    return [];

  }

}


// =======================
// RESET PASSWORD
// =======================

export async function resetPassword() {

  try {

    const email =
      document
      .getElementById(
        "email"
      )
      ?.value
      .trim();

    if (

      !email

    ) {

      alert(
        "Nhập email"
      );

      return;

    }

    const methods =

      await checkProviders(
        email
      );

    if (

      methods.length
      ===
      0

    ) {

      alert(
        "Email chưa đăng ký"
      );

      return;

    }

    await auth
      .sendPasswordResetEmail(
        email
      );

    alert(
      "Đã gửi email đặt lại mật khẩu"
    );

  }

  catch (
    err
  ) {

    console.error(
      err
    );

    let message =
      "Không gửi được email";

    switch (

      err.code

    ) {

      case
      "auth/invalid-email":

        message =
          "Email không hợp lệ";

        break;

      case
      "auth/user-not-found":

        message =
          "Không tìm thấy tài khoản";

        break;

    }

    alert(
      message
    );

  }

}
