export async function requestNotificationPermission() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

export function showTaskNotification(title) {
  if (Notification.permission !== "granted") return;

  new Notification("⏰ Task", { body: title });
}
