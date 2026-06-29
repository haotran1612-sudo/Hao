 // =======================
// AUTO RESIZE
// =======================

export function autoResize(
el
){

if(
!el
)
return;

el.style.height=
"auto";

el.style.height=
el.scrollHeight+
"px";

}

// =======================
// HIGHLIGHT TODAY
// =======================

export function highlightTodayColumn(){

const headers=
document.querySelectorAll(
"#taskTable th"
);

headers.forEach(
h=>
h.classList.remove(
"today-column"
)
);

const today=
new Date();

const day=
today.getDay();

// map Mon→Sun
const index=

day===0
?11
:day+4;

if(
headers[index]
){

headers[index]
.classList.add(
"today-column"
);

}

}

// =======================
// WEEK HEADER
// =======================

export function loadWeekHeader(){

const ids=[
"day1",
"day2",
"day3",
"day4",
"day5",
"day6",
"day7"
];

const week=
getCurrentWeekDates();

ids.forEach(
(
id,
i
)=>{

const el=
document.getElementById(
id
);

if(
!el
)
return;

const d=
week[i];

el.innerHTML=
`${formatDate(d)}`;

});

}

// =======================
// FORMAT DATE
// =======================

export function formatDate(
date
){

if(
!date
)
return "";

date=
new Date(
date
);

return (

String(
date.getDate()
)
.padStart(
2,
"0"
)

+

"/"

+

String(
date.getMonth()+1
)
.padStart(
2,
"0"
)

);

}

// =======================
// CURRENT WEEK
// =======================

export function getCurrentWeekDates(){

const result=[];

const now=
new Date();

for(
let i=0;
i<7;
i++
){

const d=
new Date(
now
);

d.setDate(
now.getDate()+i
);

result.push(
d
);

}

return result;

}
