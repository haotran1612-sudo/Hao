// =======================
// REVIEW
// =======================

export function hasReviewData(task){

if(!task.reviewDays)
return false;

return Object
.values(
task.reviewDays
)
.some(
v=>
String(
v||""
)
.trim()!==""
);

}

// =======================
// BUILD REVIEW SCHEDULE
// =======================

export function buildReviewSchedule(
task
){

const current=
task.reviewDays||
{};

const result={

day1:
current.day1||
"",

day2:
current.day2||
"",

day3:
current.day3||
"",

day4:
current.day4||
"",

day5:
current.day5||
"",

day6:
current.day6||
"",

day7:
current.day7||
""

};

if(
!task.start||
!task.taskName
)
return result;

const start=
new Date(
task.start
);

if(
isNaN(
start.getTime()
)
)
return result;

const week=
getCurrentWeekDates();

const processingHours=
Number(
task.processingTime||
0
);

const durationMs=
processingHours*
60*
60*
1000;

function formatHM(
date
){

const hh=
String(
date.getHours()
)
.padStart(
2,
"0"
);

const mm=
String(
date.getMinutes()
)
.padStart(
2,
"0"
);

return `${hh}:${mm}`;

}

function addToDay(
dayIndex,
text
){

const key=
"day"+
dayIndex;

if(
!result[key]
){

result[key]=
text;

return;

}

const lines=
result[key]
.split("\n")
.map(
x=>
x.trim()
)
.filter(
Boolean
);

if(
!lines.includes(
text
)
){

result[key]+=
"\n"+
text;

}

}

const reviewDates=[];

reviewDates.push(
new Date(
start
)
);

reviewDates.push(
new Date(
start.getTime()
+
10*
60*
1000
)
);

reviewDates.push(
new Date(
start.getTime()
+
24*
60*
60*
1000
)
);

const d7=
new Date(
start
);

d7.setDate(
d7.getDate()
+
7
);

reviewDates.push(
d7
);

const d30=
new Date(
start
);

d30.setMonth(
d30.getMonth()
+
1
);

reviewDates.push(
d30
);

for(
let i=0;
i<7;
i++
){

const colDate=
week[i];

for(
const r
of
reviewDates
){

if(
isSameDate(
r,
colDate
)
){

const end=
new Date(
r.getTime()
+
durationMs
);

const line=
`${formatHM(r)}-${formatHM(end)} ${task.taskName}`;

addToDay(
i+1,
line
);

}

}

}

return result;

}

// =======================
// BUILD REVIEW DAYS
// =======================

export function buildReviewDays(
task
){

const current=
task.reviewDays||
{};

const result={

day1:
current.day1||
"",

day2:
current.day2||
"",

day3:
current.day3||
"",

day4:
current.day4||
"",

day5:
current.day5||
"",

day6:
current.day6||
"",

day7:
current.day7||
""

};

if(
!task.start
)
return result;

const taskName=
(
task.taskName||
""
)
.trim();

if(
!taskName
)
return result;

if(
task.taskType===
"Ôn tập"
){

return buildReviewSchedule(
task
);

}

return result;

}

// =======================
// REBUILD
// =======================

export async function rebuildReviewDays(
id
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
)
return;

const task=
docRef.data();

const rebuilt=
buildReviewDays({

...task,

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

await db
.collection(
"tasks"
)
.doc(
id
)
.update({

reviewDays:
rebuilt

});

await loadTasks();

}catch(
err
){

console.error(
err
);

alert(
"Rebuild thất bại"
);

}

}

// =======================
// PARSE
// =======================

export function parseReviewTasks(
text
){

if(
!text
)
return [];

const tasks=[];

const lines=
text.split(
"\n"
);

for(
const line
of
lines
){

const t=
line.trim();

if(
!t
)
continue;

let m=
t.match(
/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})\s+(.+)$/
);

if(
m
){

tasks.push({

hour:
Number(
m[1]
),

minute:
Number(
m[2]
),

endHour:
Number(
m[3]
),

endMinute:
Number(
m[4]
),

title:
m[5]

});

continue;

}

m=
t.match(
/^(\d{1,2}):(\d{2})\s+(.+)$/
);

if(
m
){

tasks.push({

hour:
Number(
m[1]
),

minute:
Number(
m[2]
),

endHour:
null,

endMinute:
null,

title:
m[3],

raw:
t

});

}

}

return tasks;

}

// =======================
// REVIEW CALENDAR
// =======================

export async function createCalendarFromReviewCells(){

const week=
getCurrentWeekDates();

const rows=
document.querySelectorAll(
"#taskTableBody tr"
);

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
const t
of tasks
){

await createReviewCalendarTask(
t,
week[i]
);

}

}

}

alert(
"Đã tạo Calendar từ Review Cells"
);

}

export async function createReviewCalendarForRow(
btn
){

const row=
btn.closest(
"tr"
);

const week=
getCurrentWeekDates();

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

alert(
"Đã tạo Calendar"
);

}

// =======================
// NOTIFICATION
// =======================

export function scheduleTodayNotifications(){

const week=
getCurrentWeekDates();

const today=
normalizeDate(
new Date()
);

let todayIndex=
-1;

for(
let i=0;
i<7;
i++
){

if(

normalizeDate(
week[i]
)
.getTime()

===

today.getTime()

){

todayIndex=
i+1;

break;

}

}

if(
todayIndex===
-1
)
return;

document
.querySelectorAll(
"#taskTableBody tr"
)

.forEach(
row=>{

const textarea=
row
.querySelectorAll(
".review-cell"
)
[
todayIndex-
1
];

if(
!textarea
)
return;

const tasks=
parseReviewTasks(
textarea.value
);

tasks.forEach(
t=>{

scheduleNotification(
t,
new Date()
);

});

}

);

}
