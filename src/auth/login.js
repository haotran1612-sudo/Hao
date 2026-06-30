// =======================
// LOGIN
// =======================

import { auth, provider } from "../config/firebase.js";

import {
    requestNotificationPermission
} from "../notification/notification.js";

import {
    loadTasks
} from "../task/task.js";

import {
    loadUserMusicSettings
} from "../music/music.js";

// =======================
// LOGIN
// =======================
export async function login() {

    try {

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const userCredential =
            await auth.signInWithEmailAndPassword(
                email,
                password
            );

        const userEmail =
            userCredential.user.email;

        localStorage.setItem(
            "userEmail",
            userEmail
        );

        document.getElementById(
            "loginPage"
        ).style.display = "none";

        document.getElementById(
            "appPage"
        ).style.display = "block";

        document.getElementById(
            "welcomeUser"
        ).innerText = userEmail;

        await requestNotificationPermission();

        // Nếu chưa có Google Token thì xin quyền Calendar
        if (
            !localStorage.getItem(
                "googleToken"
            )
        ) {

            try {

                const result =
                    await auth.signInWithPopup(
                        provider
                    );

                const token =
                    result.credential?.accessToken;

                if (token) {

                    localStorage.setItem(
                        "googleToken",
                        token
                    );

                }

            } catch (err) {

                console.log(
                    "Calendar chưa được kết nối."
                );

            }

        }

        await loadTasks();

        await loadUserMusicSettings();

    }

    catch (err) {

        console.error(
            "login error:",
            err
        );

        alert(
            err.message
        );

    }

}

// =======================
// LOGOUT
// =======================
export function logout() {

    auth.signOut();

    localStorage.removeItem(
        "userEmail"
    );

    localStorage.removeItem(
        "googleToken"
    );

    location.reload();

}

// =======================
// ENTER TO LOGIN
// =======================
export function handleLoginEnter(event) {

    if (event.key === "Enter") {

        login();

    }

}

// =======================
// AUTO LOGIN
// =======================
export async function handleAuthStateChanged(user) {

    if (user) {

        localStorage.setItem(
            "userEmail",
            user.email || ""
        );

        document.getElementById(
            "loginPage"
        ).style.display = "none";

        document.getElementById(
            "appPage"
        ).style.display = "block";

        document.getElementById(
            "welcomeUser"
        ).innerText =
            user.email || "";

        await requestNotificationPermission();

        await loadTasks();

        await loadUserMusicSettings();

    } else {

        localStorage.removeItem(
            "userEmail"
        );

        document.getElementById(
            "loginPage"
        ).style.display = "block";

        document.getElementById(
            "appPage"
        ).style.display = "none";

    }

}
