//
// CALENDAR
//

// =======================
// CREATE MAIN EVENT
// =======================

export async function createCalendarEvent(
task,
docId
){

const token=
localStorage.getItem(
"googleToken"
);

if(
!token
){

throw new Error(
"Google chưa kết nối"
);

}

// CHẶN TRÙNG
const eventKey=
buildMainEventKey(
task,
docId
);

const existed=
await findCalendarEventByKey(
eventKey
);

if(
existed
){

return existed;

}

const startDate=
new Date(
task.start
);

if(
isNaN(
startDate.getTime()
)
){

throw new Error(
"Start date không hợp lệ"
);

}

const processingHours=
Number(
task.processingTime||
0
);

const endDate=
new Date(

startDate.getTime()

+

processingHours
*
60
*
60
*
1000

);

const body={

summary:
task.calendarTitle
||
task.taskName,

location:
task.location
||
"",

description:
task.description
||
"",

start:{

dateTime:
startDate.toISOString(),

timeZone:
"Asia/Ho_Chi_Minh"

},

end:{

dateTime:
endDate.toISOString(),

timeZone:
"Asia/Ho_Chi_Minh"

},

extendedProperties:{

private:{

appTaskKey:
eventKey,

appTaskType:
"main"

}

}

};

if(
task.addMeet
){

body.conferenceData={

createRequest:{

requestId:
Date.now()
.toString()

}

};

}

if(
task.repeat &&
task.repeat!=="None"
){

let freq=
task.repeat
.toUpperCase();

let rule=
`RRULE:FREQ=${freq};INTERVAL=${task.repeatInterval||1}`;

if(
task.repeatUntil
){

const until=
task.repeatUntil
.replace(
/-/g,
""
)
+
"T235959Z";

rule+=
`;UNTIL=${until}`;

}

body.recurrence=
[
rule
];

}

const response=
await fetch(

"https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",

{

method:
"POST",

headers:{

Authorization:
`Bearer ${token}`,

"Content-Type":
"application/json"

},

body:
JSON.stringify(
body
)

}

);

if(
!response.ok
){

const error=
await response.json();

console.log(
JSON.stringify(
error,
null,
2
)
);

throw error;

}

return await response.json();

}

// =======================
// CREATE REVIEW EVENT
// =======================

export async function createReviewCalendarTask(
task,
date,
docId="",
dayIndex=""
){

const token=
localStorage.getItem(
"googleToken"
);

if(
!token
)
return null;

const startDate=
new Date(

date.getFullYear(),

date.getMonth(),

date.getDate(),

task.hour,

task.minute

);

let endDate;

if(
task.endHour!=null &&
task.endMinute!=null
){

endDate=
new Date(

date.getFullYear(),

date.getMonth(),

date.getDate(),

task.endHour,

task.endMinute

);

}else{

const match=
`${task.raw||""}`
.match(
/-(\d{1,2}):(\d{2})/
);

if(
match
){

endDate=
new Date(

date.getFullYear(),

date.getMonth(),

date.getDate(),

Number(
match[1]
),

Number(
match[2]
)

);

}else{

endDate=
new Date(
startDate.getTime()
+
30*
60*
1000
);

}

}

const eventKey=
buildReviewEventKey(
docId,
dayIndex,
task,
date
);

const existed=
await findCalendarEventByKey(
eventKey
);

if(
existed
){

return existed.id;

}

const body={

summary:
task.title
||
task.raw
||
"Task",

start:{

dateTime:
startDate.toISOString(),

timeZone:
"Asia/Ho_Chi_Minh"

},

end:{

dateTime:
endDate.toISOString(),

timeZone:
"Asia/Ho_Chi_Minh"

},

extendedProperties:{

private:{

appTaskKey:
eventKey,

appTaskType:
"review"

}

}

};

const response=
await fetch(

"https://www.googleapis.com/calendar/v3/calendars/primary/events",

{

method:
"POST",

headers:{

Authorization:
`Bearer ${token}`,

"Content-Type":
"application/json"

},

body:
JSON.stringify(
body
)

}

);

if(
!response.ok
){

const err=
await response.text();

console.error(
err
);

return null;

}

const event=
await response.json();

return event.id;

}

// =======================
// DUPLICATE KEY
// =======================

export function buildMainEventKey(
task,
docId
){

return [

"main",

docId||"",

task.taskName||"",

task.start||"",

task.deadline||""

].join(
"|"
);

}

export function buildReviewEventKey(
docId,
dayIndex,
taskObj,
date
){

const yyyy=
date.getFullYear();

const mm=
String(
date.getMonth()+1
)
.padStart(
2,
"0"
);

const dd=
String(
date.getDate()
)
.padStart(
2,
"0"
);

return [

"review",

docId||"",

`day${dayIndex}`,

`${yyyy}-${mm}-${dd}`,

taskObj.title
||
taskObj.raw
||
"",

`${String(taskObj.hour).padStart(2,"0")}:${String(taskObj.minute).padStart(2,"0")}`,

`${taskObj.endHour??""}:${taskObj.endMinute??""}`

].join(
"|"
);

}

// =======================
// FIND EVENT
// =======================

export async function findCalendarEventByKey(
eventKey
){

const token=
localStorage.getItem(
"googleToken"
);

if(
!token
)
return null;

const url=

"https://www.googleapis.com/calendar/v3/calendars/primary/events"

+

`?privateExtendedProperty=appTaskKey=${encodeURIComponent(eventKey)}`

+

"&maxResults=1&singleEvents=true";

const res=
await fetch(
url,
{

method:
"GET",

headers:{

Authorization:
`Bearer ${token}`

}

}
);

if(
!res.ok
){

const err=
await res.text();

console.error(
err
);

return null;

}

const data=
await res.json();

if(
data.items &&
data.items.length
){

return data.items[0];

}

return null;

}
