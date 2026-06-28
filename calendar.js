// modules/calendar.js

import { db } from "../firebase.js";

export async function createEvent(event){

 return db
   .collection("calendarEvents")
   .add({
      ...event,
      source:event.source||"calendar",
      createdAt:Date.now()
   });

}

export async function updateEvent(id,data){

 return db
   .collection("calendarEvents")
   .doc(id)
   .update(data);

}

export async function deleteEvent(id){

 return db
   .collection("calendarEvents")
   .doc(id)
   .delete();

}

export async function getEvents(){

 const snap=
 await db
 .collection("calendarEvents")
 .get();

 return snap.docs.map(
  x=>({
    id:x.id,
    ...x.data()
  })
 );

}

export function initCalendar(){

 console.log(
 "calendar started"
 );

}
