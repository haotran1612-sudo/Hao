// =======================
// BACKUP
// =======================

import { db } from "../config/firebase.js";
import { loadTasks } from "./task.js";
import { toggleCreateCalendar } from "../calendar/sync.js";


// =======================
// ARCHIVE TASK
// =======================

export async function archiveTask(id, checkbox) {

    const ok = confirm(
        "Bạn có chắc muốn archive task này không?"
    );

    if (!ok) {

        checkbox.checked = false;
        return;

    }

    try {

        const docRef =
            await db.collection("tasks")
                .doc(id)
                .get();

        if (!docRef.exists)
            return;

        const task = docRef.data();

        const token =
            localStorage.getItem("googleToken");

        // xóa main calendar
        if (task.calendarId && token) {

            try {

                await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${task.calendarId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

            } catch (err) {

                console.log("Delete main fail");

            }

        }

        // xóa review calendar
        if (
            task.reviewCalendarIds &&
            task.reviewCalendarIds.length &&
            token
        ) {

            for (const eventId of task.reviewCalendarIds) {

                try {

                    await fetch(
                        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                } catch (err) {

                    console.log("Delete review fail");

                }

            }

        }

        await db
            .collection("backupTasks")
            .add({

                ...task,

                email:
                    localStorage.getItem("userEmail"),

                archivedAt:
                    new Date()

            });

        await db
            .collection("tasks")
            .doc(id)
            .delete();

        await loadTasks();

    }

    catch (err) {

        console.error(err);

        alert("Không thể backup task");

        checkbox.checked = false;

    }

}



// =======================
// SHOW BACKUP
// =======================

export async function showBackup() {

    document.getElementById("trackerPage").style.display =
        "none";

    document.getElementById("backupPage").style.display =
        "block";

    const kanban =
        document.querySelector(".kanban");

    if (kanban)
        kanban.style.display = "none";

    const tbody =
        document.getElementById("backupTableBody");

    if (!tbody)
        return;

    tbody.innerHTML = "";

    const email =
        localStorage.getItem("userEmail");

    const snapshot =
        await db
            .collection("backupTasks")
            .where("email", "==", email)
            .get();

    snapshot.forEach(doc => {

        const task = doc.data();

        const tr =
            document.createElement("tr");

        tr.innerHTML = `

<td style="text-align:center;">
<input
type="checkbox"
${task.apply ? "checked" : ""}
onchange="toggleCreateCalendar('${doc.id}',this)">
</td>

<td>${task.taskName || ""}</td>

<td>${task.start || ""}</td>

<td>${task.deadline || ""}</td>

<td>${task.status || ""}</td>

<td>${task.priority || ""}</td>

<td>
${task.archivedAt
? new Date(task.archivedAt.seconds * 1000).toLocaleString()
: ""}
</td>

<td>

<button
onclick="restoreTask('${doc.id}')">

Restore

</button>

<button
onclick="deleteBackupTask('${doc.id}')">

Xóa

</button>

</td>

`;

        tbody.appendChild(tr);

    });

}



// =======================
// RESTORE
// =======================

export async function restoreTask(id) {

    try {

        const docRef =
            await db.collection("backupTasks")
                .doc(id)
                .get();

        if (!docRef.exists)
            return;

        const task =
            docRef.data();

        delete task.archivedAt;

        await db.collection("tasks")
            .add({

                ...task,

                email:
                    localStorage.getItem("userEmail"),

                createdAt:
                    new Date()

            });

        await db.collection("backupTasks")
            .doc(id)
            .delete();

        await showBackup();

        await loadTasks();

    }

    catch (err) {

        console.error(err);

        alert("Không thể restore task");

    }

}



// =======================
// DELETE BACKUP
// =======================

export async function deleteBackupTask(id) {

    const ok =
        confirm(
            "Bạn có chắc muốn xóa vĩnh viễn task này?"
        );

    if (!ok)
        return;

    try {

        await db
            .collection("backupTasks")
            .doc(id)
            .delete();

        alert("Đã xóa backup task");

        await showBackup();

    }

    catch (err) {

        console.error(err);

        alert("Xóa thất bại");

    }

}
