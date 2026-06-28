import { db } from "./firebase.js";

export function extractYoutubeVideoId(url) {
  try {
    return new URL(url).searchParams.get("v");
  } catch {
    return "";
  }
}

export function playMusicFromUrl(url) {
  const id = extractYoutubeVideoId(url);
  document.getElementById("musicPlayer").src =
    `https://www.youtube.com/embed/${id}?autoplay=1`;
}

export async function loadUserMusicSettings() {
  const email = localStorage.getItem("userEmail");
  const doc = await db.collection("users").doc(email).get();
  const data = doc.data();

  if (data?.musicUrl) {
    playMusicFromUrl(data.musicUrl);
  }
}
