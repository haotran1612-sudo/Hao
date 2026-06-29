import {
login
}
from "./auth/login.js"

import {
registerUser,
resetPassword,
checkProviders,
logout
}
from "./auth/register.js"

import {
saveTask,
loadTasks,
showTracker,
showKanban,
openTaskModal,
closeTaskModal,
addRow
}
from "./task/task.js"

import {
googleLogin
}
from "./auth/google.js"

import {
saveMusicUrl,
playSavedMusic,
stopMusic,
toggleAutoPlayMusic
}
from "./music/music.js"

window.login=login

window.registerUser=
registerUser

window.resetPassword=
resetPassword

window.checkProviders=
checkProviders

window.googleLogin=
googleLogin

window.logout=
logout

window.saveTask=
saveTask

window.loadTasks=
loadTasks

window.showTracker=
showTracker

window.showKanban=
showKanban

window.openTaskModal=
openTaskModal

window.closeTaskModal=
closeTaskModal

window.addRow=
addRow

window.saveMusicUrl=
saveMusicUrl

window.playSavedMusic=
playSavedMusic

window.stopMusic=
stopMusic

window.toggleAutoPlayMusic=
toggleAutoPlayMusic
