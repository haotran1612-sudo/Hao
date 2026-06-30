// =======================
// NOTIFICATION MODULE
// src/notification/notification.js
// =======================

import {
  getCurrentWeekDates
} from "../utils/dom.js";

import {
  normalizeDate,
  isSameDate
} from "../utils/date.js";

import {
  parseReviewTasks
} from "../task/review.js";


// =======================
// REQUEST PERMISSION
// =======================

export async function requestNotificationPermission() {

  try {

    if (
      !("Notification" in window)
    ) {

      alert(
        "Browser không hỗ trợ Notification"
      );

      return false;

    }

    if (
      Notification.permission
      ===
      "default"
    ) {

      const result =
        await Notification
          .requestPermission();

      return (
        result ===
        "granted"
      );

    }

    return (
      Notification.permission
      ===
      "granted"
    );

  }

  catch (
    err
  ) {

    console.error(
      err
    );

    return false;

  }

}


// =======================
// POPUP
// =======================

export function showInAppPopup(
  text
) {

  let popup =
    document.getElementById(
      "appPopup"
    );

  if (
    !popup
  ) {

    popup =
      document.createElement(
        "div"
      );

    popup.id =
      "appPopup";

    popup.style.position =
      "fixed";

    popup.style.top =
      "20px";

    popup.style.right =
      "20px";

    popup.style.padding =
      "14px 18px";

    popup.style.background =
      "#111";

    popup.style.color =
      "#fff";

    popup.style.borderRadius =
      "12px";

    popup.style.zIndex =
      "999999";

    popup.style.maxWidth =
      "280px";

    popup.style.boxShadow =
      "0 10px 30px rgba(0,0,0,.25)";

    document.body.appendChild(
      popup
    );

  }

  popup.innerHTML =
    "⏰ " + text;

  popup.style.opacity =
    "1";

  setTimeout(
    () => {

      popup.style.opacity =
        "0";

      setTimeout(
        () => {

          popup.remove();

        },
        300
      );

    },

    4000

  );

}


// =======================
// SHOW NOTIFICATION
// =======================

export function showTaskNotification(
  title
) {

  if (

    Notification.permission
    !==
    "granted"

  ) {

    return;

  }

  try {

    const notif =
      new Notification(

        "⏰ Nhắc việc",

        {

          body:
            title,

          icon:
"https://cdn-icons-png.flaticon.com/512/1827/1827392.png",

          badge:
"https://cdn-icons-png.flaticon.com/512/1827/1827392.png",

          vibrate:
            [
              300,
              100,
              300
            ],

          requireInteraction:
            true

        }

      );

    if (

      navigator.vibrate

    ) {

      navigator.vibrate(

        [
          300,
          100,
          300
        ]

      );

    }

    notif.onclick =
      () => {

        window.focus();

        notif.close();

      };

    showInAppPopup(
      title
    );

  }

  catch (
    err
  ) {

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

  date

) {

  try {

    const target =
      new Date(

        date.getFullYear(),

        date.getMonth(),

        date.getDate(),

        task.hour,

        task.minute,

        0

      );

    const delay =
      target
      -
      Date.now();

    if (
      delay <= 0
    ) {

      return;

    }

    setTimeout(

      () => {

        showTaskNotification(

          task.title

        );

      },

      delay

    );

  }

  catch (
    err
  ) {

    console.error(
      err
    );

  }

}


// =======================
// TODAY NOTIFICATION
// =======================

export function scheduleTodayNotifications() {

  const week =
    getCurrentWeekDates();

  const today =
    normalizeDate(
      new Date()
    );

  let todayIndex =
    -1;

  week.forEach(

    (
      d,
      i
    ) => {

      if (

        isSameDate(
          today,
          d
        )

      ) {

        todayIndex =
          i;

      }

    }

  );

  if (

    todayIndex
    ===
    -1

  ) {

    return;

  }

  document

    .querySelectorAll(
      "#taskTableBody tr"
    )

    .forEach(

      row => {

        const cell =
          row
          .querySelectorAll(
            ".review-cell"
          )[
            todayIndex
          ];

        if (
          !cell
        ) {

          return;

        }

        const tasks =
          parseReviewTasks(
            cell.value
          );

        tasks.forEach(

          task => {

            scheduleNotification(

              task,

              new Date()

            );

          }

        );

      }

    );

}


// =======================
// REFRESH
// =======================

export async function refreshAllNotifications() {

  try {

    await requestNotificationPermission();

    let id =
      setTimeout(
        () => {},
        0
      );

    while (
      id--
    ) {

      clearTimeout(
        id
      );

    }

    scheduleTodayNotifications();

    alert(
      "Đã cập nhật thông báo"
    );

  }

  catch (
    err
  ) {

    console.error(
      err
    );

    alert(
      "Không thể cập nhật notification"
    );

  }

}
