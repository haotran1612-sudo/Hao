// =======================
// GOOGLE LOGIN
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

export async function googleLogin() {

    try {

        const result =
            await auth.signInWithPopup(provider);

        const credential =
            result.credential || null;

        const token =
            credential?.accessToken || "";

        const user =
            result.user;

        // Lưu Google Access Token
        if (token) {

            localStorage.setItem(
                "googleToken",
                token
            );

        }

        // Lưu email
        if (user?.email) {

            localStorage.setItem(
                "userEmail",
                user.email
            );

            const welcome =
                document.getElementById("welcomeUser");

            if (welcome) {

                welcome.innerText =
                    user.email;

            }

        }

        // Chuyển sang App
        const loginPage =
            document.getElementById("loginPage");

        const appPage =
            document.getElementById("appPage");

        if (loginPage) {

            loginPage.style.display = "none";

        }

        if (appPage) {

            appPage.style.display = "block";

        }

        // Khởi tạo dữ liệu
        await requestNotificationPermission();

        await loadTasks();

        await loadUserMusicSettings();

        alert(
            "Google Login + Calendar connected thành công"
        );

    }

    catch (err) {

        console.error(
            "googleLogin error:",
            err
        );

        alert(
            err.message ||
            "Google Login thất bại"
        );

    }

}
