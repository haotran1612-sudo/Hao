// =======================
// TASK MODULE
// src/task/task.js
// =======================

import { db } from "../config/firebase.js";

import {
  buildReviewDays,
  scheduleTodayNotifications
} from "./review.js";

import {
  highlightTodayColumn,
  loadWeekHeader,
  autoResize
} from "../utils/dom.js";

import {
  syncFullCalendarFromRow
} from "../calendar/sync.js";


// =======================
// MODAL
// =======================

export function openTaskModal() {

  const modal =
    document.getElementById(
      "taskModal"
    );

  if (
    modal
  ) {

    modal.style.display =
      "block";

  }

}


export function closeTaskModal() {

  const modal =
    document.getElementById(
      "taskModal"
    );

  if (
    modal
  ) {

    modal.style.display =
      "none";

  }

}


// =======================
// RESET FORM
// =======================

export function resetForm(){

[
"taskName",
"taskDescription",
"startDate",
"deadline",
"calendarTitle",
"location",
"attendees",
"meetLink",
"reminder"

]

.forEach(

id=>{

const el=
document.getElementById(
id
);

if(
el
){

el.value=
"";

}

}

);

}


// =======================
// SAVE
// =======================

export async function saveTask(){

try{

const task={

email:
localStorage.getItem(
"userEmail"
),

taskName:
document
.getElementById(
"taskName"
)
?.value
||

"",

start:
document
.getElementById(
"startDate"
)
?.value
||

"",

deadline:
document
.getElementById(
"deadline"
)
?.value
||

"",

processingTime:
Number(

document
.getElementById(
"processingTime"
)
?.value

)

||

0,

priority:
document
.getElementById(
"priority"
)
?.value
||

"Normal",

status:
document
.getElementById(
"status"
)
?.value
||

"Todo",

taskType:
document
.getElementById(
"taskType"
)
?.value
||

"Daily",

calendarTitle:"",
calendarType:"Event",

attendees:"",
location:"",
description:"",

apply:false,

calendarId:"",
meetLink:"",

calendarStatus:
"Create",

reviewCalendarIds:[],

reviewDays:{},

createdAt:
new Date()

};

await db
.collection(
"tasks"
)
.add(
task
);

resetForm();

closeTaskModal();

await loadTasks();

alert(
"Tạo task thành công"
);

}

catch(
err
){

console.error(
err
);

alert(
"Tạo task thất bại"
);

}

}


// =======================
// LOAD
// =======================

export async function loadTasks(){

try{

const email=
localStorage
.getItem(
"userEmail"
);

if(
!email
){

return;

}

const snapshot=
await db
.collection(
"tasks"
)
.where(
"email",
"==",
email
)
.get();

const tbody=
document
.getElementById(
"taskTableBody"
);

if(
!tbody
){

return;

}

tbody.innerHTML=
"";

snapshot
.forEach(

doc=>{

const task=
doc.data();

const review=
buildReviewDays(
task
);

const tr=
document
.createElement(
"tr"
);

tr.innerHTML=`

<td>

<input
type="checkbox">

</td>

<td>

<input
type="datetime-local"

value="${(task.start||"").substring(0,16)}"

onchange="
updateTask(
'${doc.id}',
'start',
this.value
)
">

</td>

<td>

<input
type="datetime-local"

value="${(task.deadline||"").substring(0,16)}"

onchange="
updateTask(
'${doc.id}',
'deadline',
this.value
)
">

</td>

<td>

<input
value="${task.taskName||""}"

onchange="
updateTask(
'${doc.id}',
'taskName',
this.value
)
">

</td>

${Array.from(
{
length:7
}

)

.map(

(
_,
i
)=>

`

<td>

<textarea

class="review-cell"

oninput="
autoResize(
this
)
"

onchange="
updateTask(
'${doc.id}',
'reviewDays.day${i+1}',
this.value
)
"

>

${review[
"day"+(
i+1
)
]||""}

</textarea>

</td>

`

)

.join(
""
)}

<td>

<button
data-id="${doc.id}"

onclick="
syncFullCalendarFromRow(
this
)
"

>

📅

</button>

</td>

`;

tbody
.appendChild(
tr
);

tr
.querySelectorAll(
".review-cell"
)
.forEach(
autoResize
);

}

);

highlightTodayColumn();

scheduleTodayNotifications();

}

catch(
err
){

console.error(
err
);

}

}


// =======================
// UPDATE
// =======================

export async function updateTask(
id,
field,
value
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

[field]:
value

});

if(

[
"taskName",

"taskType",

"start",

"deadline",

"processingTime"

]

.includes(
field
)

){

await loadTasks();

}

}

catch(
err
){

console.error(
err
);

}

}


// =======================
// ADD ROW
// =======================

export async function addRow(){

await db
.collection(
"tasks"
)
.add({

email:
localStorage
.getItem(
"userEmail"
),

taskName:"",

start:"",
deadline:"",

processingTime:0,

priority:"Normal",

status:"Todo",

taskType:"Daily",

reviewDays:{},

calendarStatus:
"Create",

createdAt:
new Date()

});

await loadTasks();

}


// =======================
// VIEW
// =======================

export function showTracker(){

document
.getElementById(
"trackerPage"
)
.style.display=
"block";

document
.getElementById(
"backupPage"
)
.style.display=
"none";

const kanban=
document
.querySelector(
".kanban"
);

if(
kanban
){

kanban.style.display=
"none";

}

loadWeekHeader();

loadTasks();

}


export function showKanban(){

document
.getElementById(
"trackerPage"
)
.style.display=
"none";

document
.getElementById(
"backupPage"
)
.style.display=
"none";

const kanban=
document
.querySelector(
".kanban"
);

if(
kanban
){

kanban.style.display=
"flex";

}

}


// =======================
// EXPORT
// =======================

export {
syncFullCalendarFromRow
};
