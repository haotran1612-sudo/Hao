// =======================
// CONFIG
// =======================
import { auth } from "./config/firebase.js";

// =======================
// AUTH
// =======================
import {
    login,
    logout,
    handleLoginEnter
} from "./auth/login.js";

import {
    registerUser,
    checkProviders,
    resetPassword
} from "./auth/register.js";

import {
    googleLogin
} from "./auth/google.js";

// =======================
// TASK
// =======================
import {
    saveTask,
    loadTasks,
    updateTask,
    addRow,
    openTaskModal,
    closeTaskModal,
    resetForm,
    showTracker,
    showKanban,
    syncFullCalendarFromRow
} from "./task/task.js";

import {
    buildReviewDays,
    buildReviewSchedule,
    rebuildReviewDays,
    parseReviewTasks,
    createCalendarFromReviewCells,
    createReviewCalendarForRow,
    scheduleTodayNotifications,
    hasReviewData
} from "./task/review.js";

import {
    archiveTask,
    showBackup,
    restoreTask,
    deleteBackupTask
} from "./task/backup.js";

// =======================
// CALENDAR
// =======================
import {
    createCalendarEvent,
    createReviewCalendarTask,
    findCalendarEventByKey,
    buildMainEventKey,
    buildReviewEventKey
} from "./calendar/calendar.js";

import {
    toggleCreateCalendar,
    createCalendarFromRow,
    syncFullCalendarFromRow as syncCalendar
} from "./calendar/sync.js";

// =======================
// MUSIC
// =======================
import {
    saveMusicUrl,
    loadUserMusicSettings,
    toggleAutoPlayMusic,
    playMusicFromUrl,
    playSavedMusic,
    stopMusic,
    extractYoutubeVideoId,
    buildYoutubeEmbedUrl
} from "./music/music.js";

// =======================
// NOTIFICATION
// =======================
import {
    requestNotificationPermission,
    showTaskNotification,
    scheduleNotification,
    refreshAllNotifications,
    showInAppPopup
} from "./notification/notification.js";

// =======================
// DOM
// =======================
import {
    autoResize,
    highlightTodayColumn,
    loadWeekHeader,
    formatDate,
    getCurrentWeekDates
} from "./utils/dom.js";

// =======================
// DATE
// =======================
import {
    normalizeDate,
    isSameDate,
    isDateInRange,
    diffDays,
    diffMonths,
    isOccurrenceForTaskType
} from "./utils/date.js";


// ======================================================
// EXPORT TO WINDOW
// (HTML onclick="" vẫn dùng được)
// ======================================================

Object.assign(window, {

    login,
    logout,
    googleLogin,

    registerUser,
    checkProviders,
    resetPassword,
    handleLoginEnter,

    saveTask,
    loadTasks,
    updateTask,

    addRow,

    openTaskModal,
    closeTaskModal,
    resetForm,

    showTracker,
    showKanban,

    archiveTask,
    showBackup,
    restoreTask,
    deleteBackupTask,

    toggleCreateCalendar,
    createCalendarFromRow,
    syncFullCalendarFromRow: syncCalendar,

    createCalendarFromReviewCells,
    createReviewCalendarForRow,

    rebuildReviewDays,

    saveMusicUrl,
    toggleAutoPlayMusic,
    playSavedMusic,
    stopMusic,

    refreshAllNotifications
});


// ======================================================
// APP INIT
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    loadWeekHeader();

    auth.onAuthStateChanged(async (user) => {

        if (!user) {

            localStorage.removeItem("userEmail");

            document.getElementById("loginPage").style.display = "block";
            document.getElementById("appPage").style.display = "none";

            return;
        }

        localStorage.setItem(
            "userEmail",
            user.email || ""
        );

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("appPage").style.display = "block";

        document.getElementById("welcomeUser").innerText =
            user.email || "";

        await requestNotificationPermission();

        await loadTasks();

        await loadUserMusicSettings();

        scheduleTodayNotifications();

        highlightTodayColumn();

    });

});
