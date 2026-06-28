// ui/calendarView.js

export function renderWeek(events){

 const root =
 document.querySelector("#calendar");

 root.innerHTML = "";

 events.forEach(event=>{

   const div =
   document.createElement("div");

   div.className="event";

   div.innerHTML=`
     <div>${event.title}</div>
   `;

   root.append(div);

 });

}

export function initUI(){

 console.log("ui started");

}

// ===== PAGE =====

export function showCalendar(){

 document.getElementById(
   "calendarPage"
 ).style.display="block";

 document.getElementById(
   "trackerPage"
 ).style.display="none";

 document.getElementById(
   "backupPage"
 ).style.display="none";

}

// chỉ export cái đang tồn tại
window.showCalendar = showCalendar;
