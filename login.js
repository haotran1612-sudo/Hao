import { auth } from "../config/firebase.js";

// =======================
// LOGIN
// =======================
export async function login() {

  const email =
    document.getElementById("loginEmail")
      .value
      .trim();

  const password =
    document.getElementById("loginPassword")
      .value;

  auth
    .signInWithEmailAndPassword(
      email,
      password
    )

.then(async userCredential => {

    const userEmail =
      userCredential.user.email;

    localStorage.setItem(
      "userEmail",
      userEmail
    );

    document.getElementById(
      "loginPage"
    ).style.display = "none";

    document.getElementById(
      "appPage"
    ).style.display = "block";

    document.getElementById(
      "welcomeUser"
    ).innerText = userEmail;

    await requestNotificationPermission();

    await loadTasks();

    await loadUserMusicSettings();

})

.catch(err => {

    alert(err.message);

    console.error(err);

});

}

// =======================
// LOGOUT
// =======================
export function logout() {

  auth.signOut();

  localStorage.removeItem(
    "userEmail"
  );

  location.reload();

}

// =======================
// ENTER TO LOGIN
// =======================
export function handleLoginEnter(
  event
){

  if(
    event.key === "Enter"
  ){

    login();

  }

}

// =======================
// AUTO LOGIN
// =======================
export function initAuthState(){

  auth.onAuthStateChanged(
    async (user)=>{

    if(user){

      localStorage.setItem(
        "userEmail",
        user.email || ""
      );

      document.getElementById(
        "loginPage"
      ).style.display =
      "none";

      document.getElementById(
        "appPage"
      ).style.display =
      "block";

      document.getElementById(
        "welcomeUser"
      ).innerText =
      user.email || "";

      await requestNotificationPermission();

      await loadTasks();

      await autoPlayMusicAfterLogin();

    }else{

      localStorage.removeItem(
        "userEmail"
      );

      document.getElementById(
        "loginPage"
      ).style.display =
      "block";

      document.getElementById(
        "appPage"
      ).style.display =
      "none";

    }

  });

}
