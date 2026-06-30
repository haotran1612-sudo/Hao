// =======================
// BACKUP MODULE
// src/task/backup.js
// =======================

import { db } from "../config/firebase.js";
import { loadTasks } from "./task.js";


// =======================
// PRIVATE
// =======================

async function deleteGoogleEvent(eventId, token) {

  if (!eventId || !token) return;

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

    console.error(
      "Delete calendar error:",
      err
    );

  }

}


async function deleteReviewEvents(ids, token) {

  if (!Array.isArray(ids)) return;

  for (const id of ids) {

    await deleteGoogleEvent(
      id,
      token
    );

  }

}


// =======================
// ARCHIVE TASK
// =======================

export async function archiveTask(
  id,
  checkbox = null
) {

  const ok =
    confirm(
      "Bạn có chắc muốn archive task này không?"
    );

  if (!ok) {

    if (checkbox) {
      checkbox.checked = false;
    }

    return;

  }

  try {

    const doc =
      await db
        .collection("tasks")
        .doc(id)
        .get();

    if (!doc.exists) {

      throw new Error(
        "Task không tồn tại"
      );

    }

    const task =
      doc.data();

    const token =
      localStorage.getItem(
        "googleToken"
      );

    // xóa calendar chính
    await deleteGoogleEvent(
      task.calendarId,
      token
    );

    // xóa review calendars
    await deleteReviewEvents(
      task.reviewCalendarIds,
      token
    );

    // lưu backup
    await db
      .collection("backupTasks")
      .add({

        ...task,

        email:
          localStorage.getItem(
            "userEmail"
          ),

        archivedAt:
          new Date()

      });

    // xóa task gốc
    await db
      .collection("tasks")
      .doc(id)
      .delete();

    await loadTasks();

  }

  catch (err) {

    console.error(
      "archiveTask:",
      err
    );

    alert(
      "Không thể backup task"
    );

    if (checkbox) {

      checkbox.checked =
        false;

    }

  }

}


// =======================
// SHOW BACKUP
// =======================

export async function showBackup() {

  try {

    document.getElementById(
      "trackerPage"
    ).style.display =
      "none";

    document.getElementById(
      "backupPage"
    ).style.display =
      "block";

    const kanban =
      document.querySelector(
        ".kanban"
      );

    if (kanban) {

      kanban.style.display =
        "none";

    }

    const tbody =
      document.getElementById(
        "backupTableBody"
      );

    if (!tbody)
      return;

    tbody.innerHTML =
      "";

    const email =
      localStorage.getItem(
        "userEmail"
      );

    const snapshot =
      await db
        .collection(
          "backupTasks"
        )
        .where(
          "email",
          "==",
          email
        )
        .get();

    snapshot.forEach(
      doc => {

        const task =
          doc.data();

        const tr =
          document.createElement(
            "tr"
          );

        tr.innerHTML =
`
<td>
${task.taskName || ""}
</td>

<td>
${task.start || ""}
</td>

<td>
${task.deadline || ""}
</td>

<td>
${task.status || ""}
</td>

<td>
${task.priority || ""}
</td>

<td>
${
task.archivedAt
? new Date(
task.archivedAt.seconds
*1000
).toLocaleString()
: ""
}
</td>

<td>

<button
onclick="
restoreTask(
'${doc.id}'
)
">

Restore

</button>

<button
onclick="
deleteBackupTask(
'${doc.id}'
)
">

Delete

</button>

</td>
`;

        tbody.appendChild(
          tr
        );

      });

  }

  catch (err) {

    console.error(
      err
    );

    alert(
      "Không tải được backup"
    );

  }

}


// =======================
// RESTORE
// =======================

export async function restoreTask(
  id
) {

  try {

    const doc =
      await db
        .collection(
          "backupTasks"
        )
        .doc(id)
        .get();

    if (!doc.exists)
      return;

    const task =
      doc.data();

    delete task.archivedAt;

    await db
      .collection(
        "tasks"
      )
      .add({

        ...task,

        email:
          localStorage.getItem(
            "userEmail"
          ),

        createdAt:
          new Date()

      });

    await db
      .collection(
        "backupTasks"
      )
      .doc(id)
      .delete();

    await showBackup();

  }

  catch (err) {

    console.error(
      err
    );

    alert(
      "Restore thất bại"
    );

  }

}


// =======================
// DELETE BACKUP
// =======================

export async function deleteBackupTask(
  id
) {

  const ok =
    confirm(
      "Bạn có chắc muốn xóa vĩnh viễn?"
    );

  if (!ok)
    return;

  try {

    await db
      .collection(
        "backupTasks"
      )
      .doc(id)
      .delete();

    await showBackup();

  }

  catch (err) {

    console.error(
      err
    );

    alert(
      "Xóa thất bại"
    );

  }

}
