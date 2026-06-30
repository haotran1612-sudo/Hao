
// =======================
// SYNC CALENDAR
// =======================

import { db } from "./firebase.js";

import {
createCalendarEvent,
createReviewCalendarTask
}
from "./calendar.js";

import {
buildReviewDays,
parseReviewTasks
}
from "./review.js";

import {
loadTasks
}
from "./task.js";

import {
getCurrentWeekDates
}
from "./dom.js";

// =======================
// TOGGLE CREATE CALENDAR
// =======================

export async function toggleCreateCalendar(
id,
checkbox
){

try{

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

if(
checkbox.checked
){

await createCalendarFromRow(
id
);

}else{

const docRef=

await db
.collection(
"tasks"
)
.doc(
id
)
.get();

const task=
docRef.data();

const token=
localStorage.getItem(
"googleToken"
);

// DELETE MAIN EVENT
if(
task.calendarId &&
token
){

try{

await fetch(

`https://www.googleapis.com/calendar/v3/calendars/primary/events/${task.calendarId}`,

{

method:
"DELETE",

headers:{

Authorization:
`Bearer ${token}`

}

}

);

}catch(
err
){

console.error(
err
);

}

}

// DELETE REVIEW EVENTS
if(

task.reviewCalendarIds &&

task.reviewCalendarIds.length

){

for(
const eventId
of
task.reviewCalendarIds
){

try{

await fetch(

`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,

{

method:
"DELETE",

headers:{

Authorization:
`Bearer ${token}`

}

}

);

}catch(
err
){

console.error(
err
);

}

}

}

// RESET FIRESTORE
await db
.collection(
"tasks"
)
.doc(
id
)
.update({

calendarId:
"",

reviewCalendarIds:
[],

meetLink:
"",

calendarStatus:
"Create",

apply:
false

});

loadTasks();

}

}catch(
err
){

console.error(
err
);

checkbox.checked=
false;

}

}

// =======================
// CREATE FROM ROW
// =======================

export async function createCalendarFromRow(
id,
rowEl=null
){

try{

const docRef=

await db
.collection(
"tasks"
)
.doc(
id
)
.get();

if(
!docRef.exists
){

alert(
"Task không tồn tại"
);

return;

}

const task=
docRef.data();

// MAIN EVENT
let mainEvent=
null;

if(
!task.calendarId
){

mainEvent=
await createCalendarEvent(
task,
id
);

}else{

mainEvent={

id:
task.calendarId,

hangoutLink:
task.meetLink||
""

};

}

// REVIEW CELLS
let reviewDays=
{};

if(
rowEl
){

const cells=
rowEl.querySelectorAll(
".review-cell"
);

reviewDays={

day1:
cells[0]?.value||
"",

day2:
cells[1]?.value||
"",

day3:
cells[2]?.value||
"",

day4:
cells[3]?.value||
"",

day5:
cells[4]?.value||
"",

day6:
cells[5]?.value||
"",

day7:
cells[6]?.value||
""

};

}else{

reviewDays=
buildReviewDays(
task
);

}

const reviewIds=
[];

const week=
getCurrentWeekDates();

for(
let i=1;
i<=7;
i++
){

const text=
reviewDays[
"day"+i
]
||
"";

const reviewTasks=
parseReviewTasks(
text
);

for(
const t
of reviewTasks
){

const eventId=

await createReviewCalendarTask(

t,

week[
i-1
],

id,

i

);

if(
eventId &&
!reviewIds.includes(
eventId
)
){

reviewIds.push(
eventId
);

}

}

}

// SAVE
await db
.collection(
"tasks"
)
.doc(
id
)
.update({

apply:
true,

calendarId:

mainEvent?.id ||

task.calendarId ||

"",

reviewCalendarIds:
reviewIds,

meetLink:

mainEvent?.hangoutLink ||

task.meetLink ||

"",

calendarStatus:
"Created",

reviewDays:
reviewDays

});

await loadTasks();

}catch(
err
){

console.error(
err
);

await db
.collection(
"tasks"
)
.doc(
id
)
.update({

apply:
false,

calendarStatus:
"Create"

});

await loadTasks();

alert(
"Tạo Calendar thất bại"
);

}

}

// =======================
// FULL SYNC
// =======================

export async function syncFullCalendarFromRow(
btn
){

const docId=
btn.getAttribute(
"data-id"
);

if(
!docId
){

alert(
"Missing task id"
);

return;

}

const row=
btn.closest(
"tr"
);

await createCalendarFromRow(
docId,
row
);

alert(
"Đồng bộ Calendar hoàn tất"
);

}
