// =======================
// REVIEW MODULE
// src/task/review.js
// =======================

import { db } from "../config/firebase.js";

import {
  getCurrentWeekDates
} from "../utils/dom.js";

import {
  isSameDate,
  isDateInRange,
  isOccurrenceForTaskType
} from "../utils/date.js";

import {
  createReviewCalendarTask
} from "../calendar/calendar.js";

import {
  showTaskNotification,
  scheduleNotification
} from "../notification/notification.js";

import {
  loadTasks
} from "./task.js";


// =======================
// REVIEW SCHEDULE
// =======================

export function buildReviewSchedule(task) {

  const current =
    task.reviewDays || {};

  const result = {
    day1: current.day1 || "",
    day2: current.day2 || "",
    day3: current.day3 || "",
    day4: current.day4 || "",
    day5: current.day5 || "",
    day6: current.day6 || "",
    day7: current.day7 || ""
  };

  if (
    !task.start ||
    !task.taskName
  ) {
    return result;
  }

  const start =
    new Date(task.start);

  const week =
    getCurrentWeekDates();

  const hours =
    Number(
      task.processingTime || 0
    );

  function hm(d) {

    return (
      String(
        d.getHours()
      ).padStart(2, "0")

      +

      ":"

      +

      String(
        d.getMinutes()
      ).padStart(2, "0")
    );

  }

  function add(day, text) {

    const key =
      "day" + day;

    if (
      !result[key]
    ) {

      result[key] =
        text;

      return;

    }

    if (
      !result[key]
        .includes(text)
    ) {

      result[key] +=
        "\n" +
        text;

    }

  }

  const dates = [

    start,

    new Date(
      start.getTime()
      +
      10 * 60000
    ),

    new Date(
      start.getTime()
      +
      86400000
    )

  ];

  const d7 =
    new Date(start);

  d7.setDate(
    d7.getDate()
    + 7
  );

  dates.push(d7);

  const d30 =
    new Date(start);

  d30.setMonth(
    d30.getMonth()
    + 1
  );

  dates.push(d30);

  dates.forEach(
    review => {

      week.forEach(
        (
          col,
          index
        ) => {

          if (
            isSameDate(
              review,
              col
            )
          ) {

            const end =
              new Date(
                review.getTime()
                +
                hours
                *
                3600000
              );

            add(
              index + 1,

`${hm(review)}-${hm(end)} ${task.taskName}`

            );

          }

        }

      );

    }

  );

  return result;

}


// =======================
// BUILD REVIEW DAYS
// =======================

export function buildReviewDays(
  task
) {

  const result = {

    day1:"",
    day2:"",
    day3:"",
    day4:"",
    day5:"",
    day6:"",
    day7:""

  };

  Object.assign(
    result,
    task.reviewDays
    || {}
  );

  if (
    !task.start
  ) {

    return result;

  }

  const start =
    new Date(
      task.start
    );

  const deadline =
    task.deadline
    ? new Date(
        task.deadline
      )
    : start;

  if (
    task.taskType
    ===
    "Ôn tập"
  ) {

    return buildReviewSchedule(
      task
    );

  }

  const week =
    getCurrentWeekDates();

  const h =
    String(
      start.getHours()
    ).padStart(
      2,
      "0"
    );

  const m =
    String(
      start.getMinutes()
    ).padStart(
      2,
      "0"
    );

  const duration =
    Number(
      task.processingTime
      || 0
    );

  const end =
    new Date(
      start.getTime()
      +
      duration
      *
      3600000
    );

  const line =

`${h}:${m}-${String(end.getHours()).padStart(2,"0")}:${String(end.getMinutes()).padStart(2,"0")} ${task.taskName}`;

  week.forEach(

(
date,
index
)=>{

if(
!isDateInRange(
date,
start,
deadline
)
){

return;

}

if(
isOccurrenceForTaskType(
task.taskType,
start,
date
)
){

result[
"day"+(
index+1
)
]=line;

}

}

);

return result;

}


// =======================
// REBUILD
// =======================

export async function rebuildReviewDays(
  id
){

const doc=
await db
.collection(
"tasks"
)
.doc(id)
.get();

if(
!doc.exists
){

return;

}

const task=
doc.data();

await db
.collection(
"tasks"
)
.doc(id)
.update({

reviewDays:
buildReviewDays({

...task,

reviewDays:{}

})

});

await loadTasks();

}


// =======================
// PARSE
// =======================

export function parseReviewTasks(
text
){

if(
!text
){

return [];

}

return text
.split("\n")
.map(
x=>
x.trim()
)
.filter(Boolean)
.map(
row=>{

const m=
row.match(
/(\d+):(\d+)-(\d+):(\d+)\s(.+)/
);

if(
!m
){

return null;

}

return{

hour:+m[1],
minute:+m[2],

endHour:+m[3],
endMinute:+m[4],

title:m[5]

};

}
)
.filter(Boolean);

}


// =======================
// REVIEW CALENDAR
// =======================

export async function createCalendarFromReviewCells(){

const rows=
document.querySelectorAll(
"#taskTableBody tr"
);

const week=
getCurrentWeekDates();

for(
const row
of rows
){

const cells=
row.querySelectorAll(
".review-cell"
);

for(
let i=0;
i<cells.length;
i++
){

const tasks=
parseReviewTasks(
cells[i].value
);

for(
const task
of tasks
){

await createReviewCalendarTask(
task,
week[i]
);

}

}

}

alert(
"Đã tạo calendar"
);

}


export async function createReviewCalendarForRow(
btn
){

await createCalendarFromReviewCells(
btn
);

}


// =======================
// NOTIFICATION
// =======================

export function scheduleTodayNotifications(){

const week=
getCurrentWeekDates();

const today=
new Date();

let index=
-1;

week.forEach(
(
d,
i
)=>{

if(
isSameDate(
today,
d
)
){

index=
i;

}

}
);

if(
index===-1
){

return;

}

document
.querySelectorAll(
".review-cell"
)

.forEach(

cell=>{

parseReviewTasks(
cell.value
)

.forEach(

task=>{

scheduleNotification(
task,
today
);

}

);

}

);

}


export function hasReviewData(
task
){

return Object
.values(
task.reviewDays
||{}
)
.some(
x=>
String(
x
)
.trim()
);

}

export {
showTaskNotification
};
