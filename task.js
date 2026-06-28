import { db } from "./firebase.js";
import { buildReviewDays } from "./calendar.js";

export async function loadTasks() {
  const email = localStorage.getItem("userEmail");

  const snapshot = await db.collection("tasks")
    .where("email", "==", email)
    .get();

  const tbody = document.getElementById("taskTableBody");
  tbody.innerHTML = "";

  snapshot.forEach(doc => {
    const task = doc.data();

    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${task.taskName}</td>`;

    tbody.appendChild(tr);
  });
}

export async function saveTask(taskData) {
  return await db.collection("tasks").add(taskData);
}

export async function updateTask(id, field, value) {
  const payload = {};
  payload[field] = value;

  await db.collection("tasks").doc(id).update(payload);
}
// modules/task.js

import { db } from "./firebase.js";

export async function createTask(data){

  const ref =
    await db
      .collection("tasks")
      .add({
        ...data,
        createdAt:Date.now()
      });

  return ref.id;

}

export async function updateTask(id,data){

  return db
    .collection("tasks")
    .doc(id)
    .update(data);

}

export async function removeTask(id){

  return db
    .collection("tasks")
    .doc(id)
    .delete();

}

export async function getTasks(){

  const snap =
    await db
      .collection("tasks")
      .get();

  return snap.docs.map(
    x=>({
      id:x.id,
      ...x.data()
    })
  );

}
