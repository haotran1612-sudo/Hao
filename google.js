  import {
  auth,
  provider
} from "./firebase.js";

// =======================
// GOOGLE LOGIN
// =======================
export async function googleLogin() {

  try {

    const result =
      await auth
      .signInWithPopup(
        provider
      );

    // lấy credential
    const credential =
      result.credential ||
      null;

    const token =
      credential?.accessToken ||
      "";

    const user =
      result.user;

    // lưu token calendar
    if(token){

      localStorage.setItem(
        "googleToken",
        token
      );

    }

    // lưu email
    if(user?.email){

      localStorage.setItem(
        "userEmail",
        user.email
      );

      document.getElementById(
        "welcomeUser"
      ).innerText =
        user.email;

    }

    // chuyển màn hình
    document.getElementById(
      "loginPage"
    ).style.display =
      "none";

    document.getElementById(
      "appPage"
    ).style.display =
      "block";

    await requestNotificationPermission();

    await loadTasks();

    await loadUserMusicSettings();

    alert(
      "Google login + Calendar connected thành công"
    );

  } catch (err) {

    console.error(
      "googleLogin error:",
      err
    );

    alert(
      err.message ||
      "Google login failed"
    );

  }

}
