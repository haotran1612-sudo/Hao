// ui/calendarView.js

export function renderWeek(events){

 const root=
 document
 .querySelector(
 "#calendar"
 );

 root.innerHTML="";

 events.forEach(
 event=>{

const div=
document
.createElement(
"div"
);

div.className=
"event";

div.innerHTML=
`
<div>
${event.title}
</div>
`;

root.append(
div
);

});

}
