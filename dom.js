// =======================
// DOM HELPERS
// =======================

// =======================
// AUTO RESIZE TEXTAREA
// =======================

export function autoResize(
element
){

if(
!element
)
return;

element.style.height=
"auto";

element.style.height=
element.scrollHeight+
"px";

}

// =======================
// HIGHLIGHT TODAY
// =======================

export function highlightTodayColumn(){

const week=
getCurrentWeekDates();

const today=
new Date();

today.setHours(
0,
0,
0,
0
);

const headers=
document.querySelectorAll(
".week-header"
);

headers.forEach(
el=>
el.classList.remove(
"today"
)
);

week.forEach(
(
date,
index
)=>{

const d=
new Date(
date
);

d.setHours(
0,
0,
0,
0
);

if(
d.getTime()
===
today.getTime()
){

const header=
headers[
index
];

if(
header
){

header.classList.add(
"today"
);

}

}

}
);

}

// =======================
// WEEK HEADER
// =======================

export function loadWeekHeader(){

const container=
document.getElementById(
"weekHeader"
);

if(
!container)
return;

container.innerHTML=
"";

const week=
getCurrentWeekDates();

week.forEach(
date=>{

const div=
document.createElement(
"div"
);

div.className=
"week-header";

div.innerHTML=

`${formatDate(date)}`;

container.appendChild(
div
);

});

highlightTodayColumn();

}

// =======================
// FORMAT DATE
// =======================

export function formatDate(
date
){

if(
!(
date instanceof Date
)
){

date=
new Date(
date
);

}

if(
isNaN(
date.getTime()
)
)
return "";

const day=
String(
date.getDate()
)
.padStart(
2,
"0"
);

const month=
String(
date.getMonth()+1
)
.padStart(
2,
"0"
);

const year=
date.getFullYear();

return `${day}/${month}/${year}`;

}

// =======================
// CURRENT WEEK
// =======================

export function getCurrentWeekDates(){

const today=
new Date();

today.setHours(
0,
0,
0,
0
);

const day=
today.getDay();

const diff=
day===0
? -6
: 1-day;

const monday=
new Date(
today
);

monday.setDate(
today.getDate()
+
diff
);

const week=[];

for(
let i=0;
i<7;
i++
){

const d=
new Date(
monday
);

d.setDate(
monday.getDate()
+
i
);

week.push(
d
);

}

return week;

}
