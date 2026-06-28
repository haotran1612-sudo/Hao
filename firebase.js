import { auth, provider, db } from "./firebase.js";
import { loadTasks } from "./task.js";
import { loadUserMusicSettings } from "./music.js";
import { requestNotificationPermission } from "./notifications.js";

export async function registerUser() {
  const email = document.getElementById("registerEmail")?.value.trim();
  const password = document.getElementById("registerPassword")?.value;

  const userCredential =
    await auth.createUserWithEmailAndPassword(email, password);

  const user = userCredential.user;

  await db.collection("users").doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    provider: "password",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  localStorage.setItem("userEmail", user.email);

  await requestNotificationPermission();
  await loadTasks();
  await loadUserMusicSettings();
}

export async function login() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  const userCredential =
    await auth.signInWithEmailAndPassword(email, password);

  localStorage.setItem("userEmail", userCredential.user.email);

  await requestNotificationPermission();
  await loadTasks();
  await loadUserMusicSettings();
}

export async function googleLogin() {
  const result = await auth.signInWithPopup(provider);
  const token = result.credential?.accessToken;

  if (token) localStorage.setItem("googleToken", token);

  localStorage.setItem("userEmail", result.user.email);

  await requestNotificationPermission();
  await loadTasks();
  await loadUserMusicSettings();
}

export function logout() {
  auth.signOut();
  localStorage.clear();
  location.reload();
}

export async function ensureGoogleToken() {
  try {
    const result = await auth.signInWithPopup(provider);
    const token = result.credential?.accessToken;
    if (token) localStorage.setItem("googleToken", token);
  } catch {}
}
import firebase from "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js";
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "XXX",
  projectId: "XXX",
  storageBucket: "XXX",
  messagingSenderId: "XXX",
  appId: "XXX"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
// firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyDCI_kxfza5lY1tdFPsMSEQKC2xqFpbMpM",
  authDomain: "whoami-73408.firebaseapp.com",
  projectId: "whoami-73408",
  storageBucket: "whoami-73408.firebasestorage.app",
  messagingSenderId: "755566064562",
  appId: "1:755566064562:web:15d0ec2626cf8aa4feeaab"
};

firebase.initializeApp(firebaseConfig);

export const db =
  firebase.firestore();

export const auth =
  firebase.auth();
