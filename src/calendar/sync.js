// =======================
// CALENDAR SYNC
// src/calendar/sync.js
// =======================

import { db } from "../config/firebase.js";

import {
  createCalendarEvent,
  createReviewCalendarTask
} from "./calendar.js";

import {
  parseReviewTasks
} from "../task/review.js";

import {
  getCurrentWeekDates
} from "../utils/dom.js";


// =======================
// TOKEN
// =======================

function getGoogleToken() {

  return localStorage.getItem(
    "googleToken"
  );

}


// =======================
// CREATE EVENT
// =======================

async function createGoogleEvent(
  event
) {

  const token =
    getGoogleToken();

  if (
    !token
  ) {

    throw new Error(
      "Thiếu Google Token"
    );

  }

  const res =
    await fetch(

"https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",

      {

        method:
          "POST",

        headers: {

          Authorization:
`Bearer ${token}`,

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify(
            event
          )

      }

    );

  if (
    !res.ok
  ) {

    throw new Error(
      "Calendar API Error"
    );

  }

  return res.json();

}


// =======================
// ENABLE
// =======================

export async function toggleCreateCalendar(
  checkbox,
  id
) {

  try {

    await db
      .collection(
        "tasks"
      )
      .doc(
        id
      )
      .update({

        apply:
          checkbox.checked

      });

  }

  catch (
    err
  ) {

    console.error(
      err
    );

    checkbox.checked =
      false;

  }

}


// =======================
// MAIN CALENDAR
// =======================

export async function createCalendarFromRow(
  btn
) {

  try {

    const id =
      btn.dataset.id;

    if (
      !id
    ) {

      return;

    }

    const doc =
      await db
      .collection(
        "tasks"
      )
      .doc(
        id
      )
      .get();

    if (
      !doc.exists
    ) {

      return;

    }

    const task =
      doc.data();

    const event =
      createCalendarEvent(
        task
      );

    const result =
      await createGoogleEvent(
        event
      );

    await db
      .collection(
        "tasks"
      )
      .doc(
        id
      )
      .update({

        calendarId:
          result.id,

        meetLink:

          result
          .hangoutLink
          ||

          "",

        calendarStatus:
          "Created"

      });

    alert(
      "Đã tạo Calendar"
    );

  }

  catch (
    err
  ) {

    console.error(
      err
    );

    alert(
      "Không tạo được Calendar"
    );

  }

}


// =======================
// REVIEW CALENDAR
// =======================

async function createReviewEvents(
  id,
  row
) {

  const week =
    getCurrentWeekDates();

  const reviewIds =
    [];

  const cells =
    row.querySelectorAll(
      ".review-cell"
    );

  for (

    let i=0;

    i<
    cells.length;

    i++

  ) {

    const tasks =
      parseReviewTasks(
        cells[i].value
      );

    for (

      const task
      of tasks

    ) {

      const event =
        createReviewCalendarTask(

          task,

          week[i]

        );

      const created =
        await createGoogleEvent(
          event
        );

      reviewIds.push(
        created.id
      );

    }

  }

  await db
    .collection(
      "tasks"
    )
    .doc(
      id
    )
    .update({

      reviewCalendarIds:
        reviewIds

    });

}


// =======================
// FULL SYNC
// =======================

export async function syncFullCalendarFromRow(
  btn
) {

  try {

    btn.disabled =
      true;

    const row =
      btn.closest(
        "tr"
      );

    const id =
      btn.dataset.id;

    if (
      !row ||
      !id
    ) {

      return;

    }

    await createCalendarFromRow(
      btn
    );

    await createReviewEvents(

      id,

      row

    );

    btn.textContent =
      "✅";

  }

  catch (
    err
  ) {

    console.error(
      err
    );

    alert(
      "Đồng bộ thất bại"
    );

  }

  finally {

    btn.disabled =
      false;

  }

}
