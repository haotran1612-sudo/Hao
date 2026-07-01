// =======================
// DOM UTILITIES
// =======================

// =======================
// AUTO RESIZE TEXTAREA
// =======================

export function autoResize(el) {
  if (!el) return;

  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";

  const tr = el.closest("tr");
  if (tr) tr.style.height = "auto";
}

// =======================
// HIGHLIGHT TODAY COLUMN
// =======================

export function highlightTodayColumn() {
  setTimeout(() => {
    const today = new Date();
    const todayNorm = normalizeDate(today);

    let todayIndex = -1;

    for (let i = 1; i <= 7; i++) {
      const th = document.getElementById("day" + i);
      if (!th) continue;

      if (th.dataset.today === "true") {
        todayIndex = i;
        break;
      }
    }

    if (todayIndex === -1) return;

    const rows = document.querySelectorAll("#taskTableBody tr");

    const OFFSET = 5; // number of columns before review columns

    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      const target = OFFSET + (todayIndex - 1);

      if (cells[target]) {
        cells[target].classList.add("today-column");
      }
    });
  }, 300);
}

// =======================
// LOAD WEEK HEADER (MON → SUN)
// =======================

export function loadWeekHeader() {
  const today = new Date();

  const monday = new Date(today);
  const dayOfWeek = today.getDay();

  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  monday.setDate(today.getDate() - daysFromMonday);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);

    const th = document.getElementById(`day${i + 1}`);
    if (!th) continue;

    th.classList.remove("today-column");

    const w0 = new Date(currentDate);
    const w1 = new Date(currentDate);
    const w2 = new Date(currentDate);
    const w3 = new Date(currentDate);

    w1.setDate(w1.getDate() + 7);
    w2.setDate(w2.getDate() + 14);
    w3.setDate(w3.getDate() + 21);

    th.innerHTML = `
      <div class="week-day">${weekDays[i]}</div>
      <div class="week-date">${w3.getDate()}.${w3.getMonth() + 1}</div>
      <div class="week-subdate">${w2.getDate()}.${w2.getMonth() + 1}</div>
      <div class="week-subdate">${w1.getDate()}.${w1.getMonth() + 1}</div>
      <div class="week-subdate">${w0.getDate()}.${w0.getMonth() + 1}</div>
    `;

    const isToday =
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();

    if (isToday) {
      th.classList.add("today-column");
      th.dataset.today = "true";
    } else {
      th.dataset.today = "false";
    }
  }

  highlightTodayColumn();
}

// =======================
// FORMAT DATE
// =======================

export function formatDate(d) {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return `${d.getDate()}-${months[d.getMonth()]}`;
}

// =======================
// GET CURRENT WEEK DATES
// =======================

export function getCurrentWeekDates() {
  const today = new Date();

  const monday = new Date(today);

  let dow = today.getDay();
  dow = dow === 0 ? 6 : dow - 1;

  monday.setDate(today.getDate() - dow);

  const dates = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }

  return dates;
}

// =======================
// LOCAL HELPERS
// =======================

function normalizeDate(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
