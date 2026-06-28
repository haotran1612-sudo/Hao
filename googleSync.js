// googleSync.js

export async function pushToGoogle(event){

 const token =
 localStorage.getItem(
   "googleToken"
 );

 if(!token)
   return;

 await fetch(
   "https://www.googleapis.com/calendar/v3/calendars/primary/events",
   {
     method:"POST",
     headers:{
       Authorization:`Bearer ${token}`,
       "Content-Type":"application/json"
     },
     body:JSON.stringify({

       summary:event.title,

       start:{
         dateTime:event.start
       },

       end:{
         dateTime:event.end
       }

     })
   }
 );

}

export function googleLogin(){

 console.log(
   "google login"
 );

}

export function logout(){

 firebase.auth().signOut();

}

export function initGoogleSync(){

 console.log(
   "google sync started"
 );

}

import { auth } from "./firebase.js";

// =======================
// GOOGLE PROVIDER
// =======================
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/calendar");

// =======================
// GOOGLE LOGIN
// =======================
export async function googleLogin() {
  try {
    const result = await auth.signInWithPopup(provider);

    const credential = result.credential || null;
    const token = credential?.accessToken || "";
    const user = result.user;

    if (token) {
      localStorage.setItem("googleToken", token);
    }

    if (user?.email) {
      localStorage.setItem("userEmail", user.email);
    }

    return {
      user,
      token
    };

  } catch (err) {
    console.error("googleLogin error:", err);
    throw err;
  }
}

// =======================
// REFRESH GOOGLE TOKEN
// =======================
export async function ensureGoogleToken() {
  try {
    const result = await auth.signInWithPopup(provider);

    const token = result.credential?.accessToken;
    if (token) {
      localStorage.setItem("googleToken", token);
    }

    return token;
  } catch (e) {
    console.log("Token refresh fail");
    return null;
  }
}
