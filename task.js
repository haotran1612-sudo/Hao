// modules/task.js

import { db } from "../firebase.js";

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
