// =======================
// CALENDAR MODULE
// src/calendar/calendar.js
// =======================


// =======================
// BUILD EVENT KEY
// =======================

export function buildMainEventKey(
  task
) {

  return [

    task.taskName || "",

    task.start || "",

    task.deadline || ""

  ]

  .join("|")

  .trim();

}


// =======================
// BUILD REVIEW KEY
// =======================

export function buildReviewEventKey(

  title,

  date,

  hour,

  minute

) {

  return [

    title || "",

    date
      ?.toISOString(),

    hour,

    minute

  ]

  .join("|")

  .trim();

}


// =======================
// CREATE MAIN EVENT
// =======================

export function createCalendarEvent(
  task
) {

  const start =
    new Date(
      task.start
    );

  let end =
    new Date(
      task.deadline
    );

  if (

    !task.deadline

  ) {

    const duration =
      Number(
        task.processingTime
      ) || 1;

    end =
      new Date(

        start.getTime()

        +

        duration
        *
        3600000

      );

  }

  const attendees =

    String(
      task.attendees
      || ""
    )

    .split(",")

    .map(
      x =>
      x.trim()
    )

    .filter(
      Boolean
    )

    .map(

      email => ({
        email
      })

    );

  return {

    summary:

      task.calendarTitle
      ||

      task.taskName
      ||

      "Task",

    location:

      task.location
      ||

      "",

    description:

      task.description
      ||

      "",

    start: {

      dateTime:

        start
        .toISOString(),

      timeZone:

        Intl
        .DateTimeFormat()

        .resolvedOptions()

        .timeZone

    },

    end: {

      dateTime:

        end
        .toISOString(),

      timeZone:

        Intl
        .DateTimeFormat()

        .resolvedOptions()

        .timeZone

    },

    attendees,

    conferenceData: {

      createRequest: {

        requestId:

          Date.now()
          .toString()

      }

    }

  };

}


// =======================
// REVIEW EVENT
// =======================

export function createReviewCalendarTask(

  reviewTask,

  date

) {

  const start =
    new Date(
      date
    );

  start.setHours(
    reviewTask.hour,
    reviewTask.minute,
    0,
    0
  );

  const end =
    new Date(
      date
    );

  end.setHours(
    reviewTask.endHour,
    reviewTask.endMinute,
    0,
    0
  );

  return {

    summary:

      reviewTask.title,

    description:

      "Review Schedule",

    start: {

      dateTime:

        start
        .toISOString(),

      timeZone:

        Intl
        .DateTimeFormat()

        .resolvedOptions()

        .timeZone

    },

    end: {

      dateTime:

        end
        .toISOString(),

      timeZone:

        Intl
        .DateTimeFormat()

        .resolvedOptions()

        .timeZone

    },

    reminders: {

      useDefault:
        true

    }

  };

}


// =======================
// FIND EVENT
// =======================

export function findCalendarEventByKey(

  events,

  key

) {

  if (

    !Array.isArray(
      events
    )

  ) {

    return null;

  }

  for (

    const event
    of events

  ) {

    const eventKey =
      [

        event.summary
        || "",

        event.start
        ?.dateTime
        || "",

        event.end
        ?.dateTime
        || ""

      ]

      .join("|")

      .trim();

    if (

      eventKey
      ===
      key

    ) {

      return event;

    }

  }

  return null;

}
