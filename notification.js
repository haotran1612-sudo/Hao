// =======================
// NOTIFICATION
// =======================

const notificationTimers = [];

// =======================
// REQUEST PERMISSION
// =======================

export async function requestNotificationPermission(){

try{

if(
!("Notification" in window)
){

console.log(
"Browser không hỗ trợ Notification"
);

return false;

}

if(
Notification.permission===
"granted"
){

return true;

}

if(
Notification.permission===
"denied"
){

return false;

}

const permission=
await Notification.requestPermission();

return (
permission===
"granted"
);

}catch(err){

console.error(
err
);

return false;

}

}

// =======================
// SHOW NOTIFICATION
// =======================

export function showTaskNotification(
title,
body=""
){

try{

if(
Notification.permission===
"granted"
){

new Notification(
title,
{
body
}
);

}

showInAppPopup(
title,
body
);

}catch(err){

console.error(
err
);

}

}

// =======================
// SCHEDULE
// =======================

export function scheduleNotification(
task,
targetDate
){

try{

if(
!task
)
return;

const now=
Date.now();

let notifyTime=
targetDate.getTime();

if(
task.hour!=null
){

notifyTime=
new Date(

targetDate.getFullYear(),

targetDate.getMonth(),

targetDate.getDate(),

task.hour,

task.minute||0

).getTime();

}

const delay=
notifyTime-now;

if(
delay<=0)
return;

const timer=
setTimeout(
()=>{

showTaskNotification(

task.title
||
task.taskName
||
"Task",

task.description
||
"Đến giờ"

);

},
delay
);

notificationTimers.push(
timer
);

}catch(err){

console.error(
err
);

}

}

// =======================
// REFRESH ALL
// =======================

export async function refreshAllNotifications(){

try{

notificationTimers.forEach(
clearTimeout
);

notificationTimers.length=
0;

if(
typeof loadTasks===
"function"
){

await loadTasks();

}

}catch(err){

console.error(
err
);

}

}

// =======================
// IN APP POPUP
// =======================

export function showInAppPopup(
title,
message=""
){

let popup=
document.getElementById(
"inAppNotification"
);

if(
!popup
){

popup=
document.createElement(
"div"
);

popup.id=
"inAppNotification";

popup.style.position=
"fixed";

popup.style.top=
"20px";

popup.style.right=
"20px";

popup.style.zIndex=
99999;

popup.style.padding=
"14px";

popup.style.borderRadius=
"10px";

popup.style.background=
"#222";

popup.style.color=
"#fff";

popup.style.maxWidth=
"320px";

popup.style.boxShadow=
"0 5px 20px rgba(0,0,0,.25)";

document.body.appendChild(
popup
);

}

popup.innerHTML=
`
<div>
<b>${title}</b>
</div>

<div>
${message}
</div>
`;

popup.style.display=
"block";

clearTimeout(
popup._timer
);

popup._timer=
setTimeout(
()=>{

popup.style.display=
"none";

},
5000
);

}
