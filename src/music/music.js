// =======================
// MUSIC
// =======================

import { db } from "../config/firebase.js";

// =======================
// Lấy Video ID từ YouTube URL
// =======================
export function extractYoutubeVideoId(url) {

    if (!url) return "";

    try {

        const u = new URL(url);

        // youtu.be/xxxxx
        if (u.hostname.includes("youtu.be")) {
            return u.pathname.replace("/", "").trim();
        }

        // youtube.com/watch?v=xxxxx
        if (u.searchParams.get("v")) {
            return u.searchParams.get("v");
        }

        // youtube.com/embed/xxxxx
        if (u.pathname.includes("/embed/")) {
            return u.pathname.split("/embed/")[1].split("/")[0];
        }

        // youtube.com/shorts/xxxxx
        if (u.pathname.includes("/shorts/")) {
            return u.pathname.split("/shorts/")[1].split("/")[0];
        }

        return "";

    } catch {

        return "";

    }

}

// =======================
// Build Embed URL
// =======================
export function buildYoutubeEmbedUrl(videoId, autoplay = true) {

    if (!videoId) return "";

    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0`;

}

// =======================
// Save Music URL
// =======================
export async function saveMusicUrl() {

    try {

        const email =
            localStorage.getItem("userEmail");

        if (!email) {

            alert("Bạn chưa đăng nhập");

            return;

        }

        const musicUrl =
            document.getElementById("musicUrl")?.value.trim() || "";

        const autoPlay =
            document.getElementById("autoPlayMusic")?.checked || false;

        if (!musicUrl) {

            alert("Vui lòng nhập link YouTube");

            return;

        }

        const videoId =
            extractYoutubeVideoId(musicUrl);

        if (!videoId) {

            alert("Link YouTube không hợp lệ");

            return;

        }

        await db.collection("users")
            .doc(email)
            .set({

                email,

                musicUrl,

                autoPlayMusic: autoPlay,

                updatedAt: new Date()

            }, { merge: true });

        alert("Đã lưu nhạc thành công");

    }

    catch (err) {

        console.error("saveMusicUrl", err);

        alert("Không lưu được nhạc");

    }

}

// =======================
// Load User Music
// =======================
export async function loadUserMusicSettings() {

    try {

        const email =
            localStorage.getItem("userEmail");

        if (!email) return;

        const docRef =
            await db.collection("users")
                .doc(email)
                .get();

        if (!docRef.exists) return;

        const data =
            docRef.data() || {};

        const musicInput =
            document.getElementById("musicUrl");

        if (musicInput) {

            musicInput.value =
                data.musicUrl || "";

        }

        const autoPlay =
            document.getElementById("autoPlayMusic");

        if (autoPlay) {

            autoPlay.checked =
                !!data.autoPlayMusic;

        }

        if (
            data.musicUrl &&
            data.autoPlayMusic
        ) {

            playMusicFromUrl(data.musicUrl);

        }

    }

    catch (err) {

        console.error(
            "loadUserMusicSettings",
            err
        );

    }

}

// =======================
// Toggle Auto Play
// =======================
export async function toggleAutoPlayMusic(checkbox) {

    try {

        const email =
            localStorage.getItem("userEmail");

        if (!email) return;

        await db.collection("users")
            .doc(email)
            .set({

                email,

                autoPlayMusic: checkbox.checked,

                updatedAt: new Date()

            }, { merge: true });

    }

    catch (err) {

        console.error(
            "toggleAutoPlayMusic",
            err
        );

    }

}

// =======================
// Play Music
// =======================
export function playMusicFromUrl(url) {

    const videoId =
        extractYoutubeVideoId(url);

    if (!videoId) {

        alert("Link YouTube không hợp lệ");

        return;

    }

    const iframe =
        document.getElementById("musicPlayer");

    const wrap =
        document.getElementById("musicPlayerWrap");

    if (!iframe || !wrap) return;

    iframe.src =
        buildYoutubeEmbedUrl(videoId, true);

    wrap.style.display = "block";

}

// =======================
// Play Saved Music
// =======================
export function playSavedMusic() {

    const url =
        document.getElementById("musicUrl")
            ?.value
            .trim() || "";

    if (!url) {

        alert("Chưa có link nhạc");

        return;

    }

    playMusicFromUrl(url);

}

// =======================
// Stop Music
// =======================
export function stopMusic() {

    const iframe =
        document.getElementById("musicPlayer");

    if (!iframe) return;

    iframe.src = "";

}

// =======================
// Auto Play After Login
// =======================
export async function autoPlayMusicAfterLogin() {

    await loadUserMusicSettings();

}
