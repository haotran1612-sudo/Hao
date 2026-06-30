// =======================
// FIREBASE CONFIG
// src/config/firebase.js
// =======================

// Firebase CDN đã được load trong index.html
// Không import npm package

const firebaseConfig = {

  apiKey:
    "AIzaSyDCI_kxfza5lY1tdFPsMSEQKC2xqFpbMpM",

  authDomain:
    "whoami-73408.firebaseapp.com",

  projectId:
    "whoami-73408",

  storageBucket:
    "whoami-73408.firebasestorage.app",

  messagingSenderId:
    "755566064562",

  appId:
    "1:755566064562:web:15d0ec2626cf8aa4feeaab"

};


// =======================
// INIT APP
// =======================

let app;

if (

  !firebase.apps.length

) {

  app =
    firebase.initializeApp(
      firebaseConfig
    );

} else {

  app =
    firebase.app();

}


// =======================
// SERVICES
// =======================

const auth =
  firebase.auth();

const db =
  firebase.firestore();

const provider =
  new firebase.auth.GoogleAuthProvider();


// =======================
// GOOGLE CALENDAR SCOPE
// =======================

provider.addScope(

"https://www.googleapis.com/auth/calendar"

);


// =======================
// EXPORT
// =======================

export {

  app,

  auth,

  db,

  provider,

  firebaseConfig

};
