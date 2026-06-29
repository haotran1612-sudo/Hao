
// =======================
// DATE UTILS
// =======================

// =======================
// NORMALIZE
// =======================

export function normalizeDate(
date
){

if(
!(date instanceof Date)
){

date=
new Date(
date
);

}

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

return d;

}

// =======================
// SAME DATE
// =======================

export function isSameDate(
a,
b
){

if(
!a ||
!b
)
return false;

return (

normalizeDate(a)
.getTime()

===

normalizeDate(b)
.getTime()

);

}

// =======================
// DATE RANGE
// =======================

export function isDateInRange(
target,
start,
end
){

if(
!target||
!start||
!end
)
return false;

const t=
normalizeDate(
target
);

const s=
normalizeDate(
start
);

const e=
normalizeDate(
end
);

return (

t.getTime()

>=

s.getTime()

&&

t.getTime()

<=

e.getTime()

);

}

// =======================
// DIFF DAYS
// =======================

export function diffDays(
a,
b
){

const ms=

normalizeDate(b)

-

normalizeDate(a);

return Math.floor(

ms/

(
1000
*
60
*
60
*
24
)

);

}

// =======================
// DIFF MONTHS
// =======================

export function diffMonths(
a,
b
){

a=
new Date(
a
);

b=
new Date(
b
);

return (

(
b.getFullYear()
-
a.getFullYear()
)
*
12

+

(
b.getMonth()
-
a.getMonth()
)

);

}

// =======================
// OCCURRENCE
// =======================

export function isOccurrenceForTaskType(
task,
date
){

if(
!task
)
return false;

const start=
normalizeDate(
task.start
);

const current=
normalizeDate(
date
);

if(
current
<
start
)
return false;

// DAILY
if(
task.taskType===
"Daily"
){

return true;

}

// WEEKLY
if(
task.taskType===
"Weekly"
){

return (
diffDays(
start,
current
)
%
7
===
0
);

}

// MONTHLY
if(
task.taskType===
"Monthly"
){

return (
start.getDate()

===

current.getDate()
);

}

// YEARLY
if(
task.taskType===
"Yearly"
){

return (

start.getDate()
===

current.getDate()

&&

start.getMonth()
===

current.getMonth()

);

}

// CUSTOM REPEAT
if(
task.repeat
&&
task.repeat!=="None"
){

const interval=
Number(
task.repeatInterval
||
1
);

if(
task.repeat===
"Daily"
){

return (
diffDays(
start,
current
)
%
interval
===
0
);

}

if(
task.repeat===
"Weekly"
){

return (
Math.floor(
diffDays(
start,
current
)
/
7
)
%
interval
===
0
);

}

if(
task.repeat===
"Monthly"
){

return (
diffMonths(
start,
current
)
%
interval
===
0
);

}

}

return isSameDate(
start,
current
);

}
