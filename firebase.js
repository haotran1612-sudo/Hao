// firebase.js

const firebaseConfig = {
  apiKey:"",
  authDomain:"",
  projectId:""
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
