// =======================
// REVIEW MODULE
// =======================

import { getCurrentWeekDates } from "../utils/dom.js";
import { isDateInRange, isOccurrenceForTaskType } from "../utils/date.js";

// =======================
// BUILD REVIEW DAYS (CORE)
// =======================

export function buildReviewDays(task) {
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

  if (!task.start || isNaN(new Date(task.start).getTime())) {
    return result;
  }

  const start = new Date(task.start);
  const deadline = task.deadline
    ? new Date(task.deadline)
    : new Date(task.start);

  if (isNaN(deadline.getTime())) return result;

  const taskName = (task.taskName || "").trim();
  if (!taskName) return result;

  const week = getCurrentWeekDates();

  const startTime = new Date(task.start);
  const durationHours = Number(task.processingTime || 0);

  const sh = String(startTime.getHours()).padStart(2, "0");
  const sm = String(startTime.getMinutes()).padStart(2, "0");

  const endTime = new Date(
    startTime.getTime() + durationHours * 60 * 60 * 1000
  );

  const eh = String(endTime.getHours()).padStart(2, "0");
  const em = String(endTime.getMinutes()).padStart(2, "0");

  const line = `${sh}:${sm}-${eh}:${em} ${taskName}`;

  function addToDay(dayIndex, text) {
    const key = "day" + dayIndex;

    if (!result[key] || result[key].trim() === "") {
      result[key] = text;
      return;
    }

    const lines = result[key]
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean);

    if (!lines.includes(text)) {
      result[key] += "\n" + text;
    }
  }

  // ===== TYPE: ÔN TẬP (special rule) =====
  if (task.taskType === "Ôn tập") {
    return buildReviewSchedule(task);
  }

  // ===== NORMAL TASK TYPES =====
  for (let i = 0; i < 7; i++) {
    const colDate = week[i];

    if (!isDateInRange(colDate, start, deadline)) continue;

    if (isOccurrenceForTaskType(task.taskType, start, colDate)) {
      addToDay(i + 1, line);
    }
  }

  return result;
}

// =======================
// REVIEW SCHEDULE (SPACED REPETITION)
// =======================

export function buildReviewSchedule(task) {
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

  if (!task.start || !task.taskName) return result;

  const start = new Date(task.start);
  if (isNaN(start.getTime())) return result;

  const week = getCurrentWeekDates();

  const processingHours = Number(task.processingTime || 0);
  const durationMs = processingHours * 60 * 60 * 1000;

  function formatHM(date) {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function addToDay(dayIndex, text) {
    const key = "day" + dayIndex;

    if (!result[key] || result[key].trim() === "") {
      result[key] = text;
      return;
    }

    const lines = result[key]
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean);

    if (!lines.includes(text)) {
      result[key] += "\n" + text;
    }
  }

  const reviewDates = [];

  reviewDates.push(new Date(start));
  reviewDates.push(new Date(start.getTime() + 10 * 60 * 1000));
  reviewDates.push(new Date(start.getTime() + 24 * 60 * 60 * 1000));

  const d7 = new Date(start);
  d7.setDate(d7.getDate() + 7);
  reviewDates.push(d7);

  const d30 = new Date(start);
  d30.setMonth(d30.getMonth() + 1);
  reviewDates.push(d30);

  for (let i = 0; i < 7; i++) {
    const colDate = week[i];

    for (const r of reviewDates) {
      if (r.toDateString() === colDate.toDateString()) {
        const end = new Date(r.getTime() + durationMs);

        const line =
          `${formatHM(r)}-${formatHM(end)} ${task.taskName}`;

        addToDay(i + 1, line);
      }
    }
  }

  return result;
}

// =======================
// REBUILD REVIEW DAYS
// =======================

export async function rebuildReviewDays(id, db) {
  try {
    const docRef = await db.collection("tasks").doc(id).get();
    if (!docRef.exists) return;

    const task = docRef.data();

    const clearedTask = {
      ...task,
      reviewDays: {
        day1: "",
        day2: "",
        day3: "",
        day4: "",
        day5: "",
        day6: "",
        day7: ""
      }
    };

    const rebuilt = buildReviewDays(clearedTask);

    await db.collection("tasks").doc(id).update({
      reviewDays: rebuilt
    });

    return rebuilt;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// =======================
// PARSE REVIEW CELL TEXT
// =======================

export function parseReviewTasks(text) {
  if (!text) return [];

  const tasks = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    let m = t.match(
      /^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})\s+(.+)$/
    );

    if (m) {
      tasks.push({
        hour: Number(m[1]),
        minute: Number(m[2]),
        endHour: Number(m[3]),
        endMinute: Number(m[4]),
        title: m[5],
        raw: t
      });
      continue;
    }

    m = t.match(/^(\d{1,2}):(\d{2})\s+(.+)$/);

    if (m) {
      tasks.push({
        hour: Number(m[1]),
        minute: Number(m[2]),
        endHour: null,
        endMinute: null,
        title: m[3],
        raw: t
      });
    }
  }

  return tasks;
}

// =======================
// CHECK REVIEW DATA
// =======================

export function hasReviewData(task) {
  if (!task.reviewDays) return false;

  return Object.values(task.reviewDays).some(
    v => String(v || "").trim() !== ""
  );
}
