// =======================
// FIREBASE CONFIG
// =======================

const firebaseConfig = {
  apiKey: "AIzaSyDCI_kxfza5lY1tdFPsMSEQKC2xqFpbMpM",
  authDomain: "whoami-73408.firebaseapp.com",
  projectId: "whoami-73408",
  storageBucket: "whoami-73408.firebasestorage.app",
  messagingSenderId: "755566064562",
  appId: "1:755566064562:web:15d0ec2626cf8aa4feeaab"
};

// =======================
// INIT FIREBASE
// =======================

firebase.initializeApp(firebaseConfig);

// =======================
// EXPORT SERVICES
// =======================

export const auth = firebase.auth();

export const db = firebase.firestore();

export const provider =
  new firebase.auth.GoogleAuthProvider();

// Google Calendar scope
provider.addScope(
  "https://www.googleapis.com/auth/calendar"
);

export default firebase;
