// =======================
// REVIEW
// =======================

import { db } from "../config/firebase.js";

import {
    getCurrentWeekDates,
    isSameDate,
    isDateInRange,
    isOccurrenceForTaskType
} from "../utils/date.js";

import {
    createReviewCalendarTask
} from "../calendar/calendar.js";

import {
    scheduleNotification
} from "../notification/notification.js";


// =======================
// kiểm tra đã có review chưa
// =======================

export function hasReviewData(task){

    if(!task.reviewDays) return false;

    return Object.values(task.reviewDays)
        .some(v => String(v || "").trim() !== "");

}


// =======================
// Build review schedule cho task Ôn tập
// =======================

export function buildReviewSchedule(task){

    const current = task.reviewDays || {};

    const result = {
        day1: current.day1 || "",
        day2: current.day2 || "",
        day3: current.day3 || "",
        day4: current.day4 || "",
        day5: current.day5 || "",
        day6: current.day6 || "",
        day7: current.day7 || ""
    };

    if(!task.start || !task.taskName) return result;

    const start = new Date(task.start);

    if(isNaN(start.getTime()))
        return result;

    const week = getCurrentWeekDates();

    const processingHours =
        Math.max(Number(task.processingTime || 1),0.5);

    const durationMs =
        processingHours * 60 * 60 * 1000;

    function formatHM(date){

        const hh =
            String(date.getHours()).padStart(2,"0");

        const mm =
            String(date.getMinutes()).padStart(2,"0");

        return `${hh}:${mm}`;

    }

    function addToDay(day,text){

        const key="day"+day;

        if(!result[key]){

            result[key]=text;
            return;

        }

        const lines=result[key]
            .split("\n")
            .map(x=>x.trim())
            .filter(Boolean);

        if(!lines.includes(text))
            result[key]+="\n"+text;

    }

    const reviewDates=[];

    reviewDates.push(new Date(start));

    reviewDates.push(
        new Date(start.getTime()+10*60*1000)
    );

    reviewDates.push(
        new Date(start.getTime()+24*60*60*1000)
    );

    const d7=new Date(start);
    d7.setDate(d7.getDate()+7);

    reviewDates.push(d7);

    const d30=new Date(start);
    d30.setMonth(d30.getMonth()+1);

    reviewDates.push(d30);

    for(let i=0;i<7;i++){

        const colDate=week[i];

        for(const r of reviewDates){

            if(isSameDate(r,colDate)){

                const end=
                    new Date(r.getTime()+durationMs);

                addToDay(
                    i+1,
                    `${formatHM(r)}-${formatHM(end)} ${task.taskName}`
                );

            }

        }

    }

    return result;

}



// =======================
// Build reviewDays
// =======================

export function buildReviewDays(task){

    const current = task.reviewDays || {};

    const result = {

        day1:current.day1||"",
        day2:current.day2||"",
        day3:current.day3||"",
        day4:current.day4||"",
        day5:current.day5||"",
        day6:current.day6||"",
        day7:current.day7||""

    };

    if(!task.start)
        return result;

    if(task.taskType==="Ôn tập")
        return buildReviewSchedule(task);

    const start=new Date(task.start);

    const deadline=
        task.deadline
        ? new Date(task.deadline)
        : new Date(task.start);

    const week=getCurrentWeekDates();

    const duration=
        Number(task.processingTime||0);

    const endTime=
        new Date(
            start.getTime()+duration*3600000
        );

    const line=
`${String(start.getHours()).padStart(2,"0")}:${String(start.getMinutes()).padStart(2,"0")}-${String(endTime.getHours()).padStart(2,"0")}:${String(endTime.getMinutes()).padStart(2,"0")} ${task.taskName}`;

    function add(day,text){

        const key="day"+day;

        if(!result[key]){

            result[key]=text;
            return;

        }

        const arr=result[key]
            .split("\n")
            .filter(Boolean);

        if(!arr.includes(text))
            result[key]+="\n"+text;

    }

    for(let i=0;i<7;i++){

        const colDate=week[i];

        if(!isDateInRange(colDate,start,deadline))
            continue;

        if(
            isOccurrenceForTaskType(
                task.taskType,
                start,
                colDate
            )
        ){

            add(i+1,line);

        }

    }

    return result;

}



// =======================
// rebuild review
// =======================

export async function rebuildReviewDays(id){

    const doc=
        await db.collection("tasks")
        .doc(id)
        .get();

    if(!doc.exists)
        return;

    const task=doc.data();

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

    await db.collection("tasks")
        .doc(id)
        .update({

            reviewDays:rebuilt

        });

}



// =======================
// parse review cell
// =======================

export function parseReviewTasks(text){

    if(!text)
        return [];

    const result=[];

    const lines=text.split("\n");

    for(const line of lines){

        const t=line.trim();

        if(!t)
            continue;

        let m=t.match(
            /^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})\s+(.+)$/
        );

        if(m){

            result.push({

                hour:Number(m[1]),
                minute:Number(m[2]),

                endHour:Number(m[3]),
                endMinute:Number(m[4]),

                title:m[5]

            });

            continue;

        }

        m=t.match(
            /^(\d{1,2}):(\d{2})\s+(.+)$/
        );

        if(m){

            result.push({

                hour:Number(m[1]),
                minute:Number(m[2]),

                endHour:null,
                endMinute:null,

                title:m[3],
                raw:t

            });

        }

    }

    return result;

}



// =======================
// tạo calendar toàn bộ review cells
// =======================

export async function createCalendarFromReviewCells(){

    const week=getCurrentWeekDates();

    const rows=
        document.querySelectorAll("#taskTableBody tr");

    for(const row of rows){

        const cells=row.querySelectorAll(".review-cell");

        for(let i=0;i<cells.length;i++){

            const tasks=
                parseReviewTasks(cells[i].value);

            const docId=
                row.querySelector("button[data-id]")
                ?.dataset.id || "";

            for(const task of tasks){

                await createReviewCalendarTask(

                    task,

                    week[i],

                    docId,

                    i+1

                );

            }

        }

    }

}



// =======================
// tạo calendar cho 1 row
// =======================

export async function createReviewCalendarForRow(btn){

    const row=btn.closest("tr");

    const week=getCurrentWeekDates();

    const cells=
        row.querySelectorAll(".review-cell");

    const docId=
        btn.dataset.id;

    for(let i=0;i<cells.length;i++){

        const tasks=
            parseReviewTasks(cells[i].value);

        for(const task of tasks){

            await createReviewCalendarTask(

                task,

                week[i],

                docId,

                i+1

            );

        }

    }

}



// =======================
// Notification hôm nay
// =======================

export function scheduleTodayNotifications(){

    const week=getCurrentWeekDates();

    const today=new Date();

    let index=-1;

    for(let i=0;i<7;i++){

        if(isSameDate(today,week[i])){

            index=i;

            break;

        }

    }

    if(index===-1)
        return;

    document
        .querySelectorAll("#taskTableBody tr")
        .forEach(row=>{

            const textarea=
                row.querySelectorAll(".review-cell")[index];

            if(!textarea)
                return;

            const tasks=
                parseReviewTasks(textarea.value);

            tasks.forEach(task=>{

                scheduleNotification(
                    task,
                    today
                );

            });

        });

}
