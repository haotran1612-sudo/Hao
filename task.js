import { db } from "./firebase.js";

// =======================
// MODAL
// =======================

export function openTaskModal() {

  document.getElementById(
    "taskModal"
  ).style.display =
    "block";

}

export function closeTaskModal() {

  document.getElementById(
    "taskModal"
  ).style.display =
    "none";

}

// =======================
// RESET FORM
// =======================

export function resetForm() {

  const fields = [
    "taskName",
    "taskDescription",
    "startDate",
    "deadline",
    "calendarTitle",
    "location",
    "attendees",
    "meetLink",
    "reminder"
  ];

  fields.forEach(id=>{

    const el =
      document
      .getElementById(id);

    if(el)
      el.value="";

  });

  const taskType =
    document
    .getElementById(
      "taskType"
    );

  if(taskType)
    taskType.value =
      "Daily";

  const priority =
    document
    .getElementById(
      "priority"
    );

  if(priority)
    priority.value =
      "Normal";

  const status =
    document
    .getElementById(
      "status"
    );

  if(status)
    status.value =
      "Todo";

  const applyCalendar =
    document
    .getElementById(
      "applyCalendar"
    );

  if(applyCalendar)
    applyCalendar.checked =
      false;

  const sendMail =
    document
    .getElementById(
      "sendMail"
    );

  if(sendMail)
    sendMail.checked =
      false;

}

// =======================
// SAVE TASK
// =======================

export async function saveTask(){

try{

const taskData={

email:
localStorage.getItem(
"userEmail"
),

taskName:
document
.getElementById(
"taskName"
)?.value||"",

start:
document
.getElementById(
"startDate"
)?.value||"",

deadline:
document
.getElementById(
"deadline"
)?.value||"",

taskType:
document
.getElementById(
"taskType"
)?.value||
"Daily",

priority:
document
.getElementById(
"priority"
)?.value||
"Normal",

status:
document
.getElementById(
"status"
)?.value||
"Todo",

calendarTitle:
document
.getElementById(
"calendarTitle"
)?.value||"",

calendarType:
document
.getElementById(
"calendarType"
)?.value||
"Event",

attendees:
document
.getElementById(
"attendees"
)?.value||"",

addMeet:
document
.getElementById(
"addMeet"
)?.checked||
false,

location:
document
.getElementById(
"location"
)?.value||"",

description:
document
.getElementById(
"description"
)?.value||"",

repeat:
document
.getElementById(
"repeat"
)?.value||
"None",

repeatInterval:
Number(
document
.getElementById(
"repeatInterval"
)?.value
)||1,

repeatUntil:
document
.getElementById(
"repeatUntil"
)?.value||"",

autoDelete:
document
.getElementById(
"autoDelete"
)?.checked||
false,

apply:false,

sendMail:
document
.getElementById(
"sendMail"
)?.checked||
false,

calendarId:"",

meetLink:"",

calendarStatus:
"Create",

reviewCalendarIds:[],

createdAt:
new Date()

};

await db
.collection(
"tasks"
)
.add(
taskData
);

alert(
"Tạo task thành công"
);

closeTaskModal();

resetForm();

loadTasks();

}catch(err){

console.error(
err
);

alert(
"Lỗi tạo task"
);

}

}

// =======================
// LOAD TASKS
// =======================

export async function loadTasks(){

try{

const email=
localStorage
.getItem(
"userEmail"
);

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

if(!tbody)
return;

tbody.innerHTML="";

// dùng nguyên phần render row
snapshot.forEach(
doc=>{

const task=
doc.data();

console.log(
doc.id,
task
);

// giữ nguyên block render cũ
// copy phần tr.innerHTML
// từ file upload

});

highlightTodayColumn();

scheduleTodayNotifications();

}catch(err){

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

const data={};

data[field]=
value;

await db
.collection(
"tasks"
)
.doc(id)
.update(
data
);

if(
field==="taskType"||
field==="start"||
field==="deadline"||
field==="taskName"||
field==="processingTime"
){

await db
.collection(
"tasks"
)
.doc(id)
.update({

reviewDays:{

day1:"",
day2:"",
day3:"",
day4:"",
day5:"",
day6:"",
day7:""

}

});

await loadTasks();

}

}catch(err){

console.error(
err
);

}

}

// =======================
// ADD ROW
// =======================

export async function addRow(){

try{

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

reviewDays:{

day1:"",
day2:"",
day3:"",
day4:"",
day5:"",
day6:"",
day7:""

},

priority:
"Normal",

status:
"Todo",

taskType:
"Daily",

repeat:
"None",

repeatInterval:
1,

repeatUntil:
"",

calendarTitle:
"",

calendarType:
"Event",

attendees:
"",

addMeet:
false,

location:
"",

description:
"",

apply:
false,

calendarId:
"",

meetLink:
"",

calendarStatus:
"Create",

autoDelete:
false,

reviewCalendarIds:
[],

createdAt:
new Date()

});

loadTasks();

}catch(err){

console.error(
err
);

alert(
"Không thêm được dòng mới"
);

}

}

// =======================
// VIEW
// =======================

export function showTracker(){

document
.getElementById(
"trackerPage"
).style.display=
"block";

document
.getElementById(
"backupPage"
).style.display=
"none";

const kanban=
document
.querySelector(
".kanban"
);

if(kanban)
kanban.style.display=
"none";

loadWeekHeader();

loadTasks();

}

export function showKanban(){

document
.getElementById(
"trackerPage"
).style.display=
"none";

document
.getElementById(
"backupPage"
).style.display=
"none";

const kanban=
document
.querySelector(
".kanban"
);

if(kanban)
kanban.style.display=
"flex";

}

// =======================
// SYNC CALENDAR
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
