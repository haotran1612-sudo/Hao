import { db } from "./firebase.js";
import { getCurrentWeekDates, parseReviewTasks } from "./utils.js";

export function buildReviewDays(task) {
  const result = {
    day1: "", day2: "", day3: "",
    day4: "", day5: "", day6: "", day7: ""
  };
  return result;
}

export async function createCalendarEvent(task) {
  const token = localStorage.getItem("googleToken");

  const start = new Date(task.start);
  const end = new Date(start.getTime() + (task.processingTime || 1) * 3600000);

  const body = {
    summary: task.taskName,
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() }
  };

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  return await res.json();
}

export async function createCalendarFromRow(id) {
  const doc = await db.collection("tasks").doc(id).get();
  const task = doc.data();

  if (task.calendarId) return;

  const event = await createCalendarEvent(task);

  await db.collection("tasks").doc(id).update({
    calendarId: event.id
  });
}

// modules/calendar.js

import { db } from "./firebase.js";

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
