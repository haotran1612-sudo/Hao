import { db, auth } from "./firebase.js";

// =======================
// SAVE MUSIC URL
// =======================

export async function saveMusicUrl(){

try{

const url=
document
.getElementById(
"musicUrl"
)
?.value
.trim();

if(
!url
){

alert(
"Nhập link nhạc"
);

return;

}

const user=
auth.currentUser;

if(
!user
){

alert(
"Chưa đăng nhập"
);

return;

}

await db
.collection(
"users"
)
.doc(
user.uid
)
.set({

musicUrl:
url,

updatedAt:
new Date()

},{
merge:true
});

localStorage.setItem(
"musicUrl",
url
);

alert(
"Đã lưu nhạc");

}catch(err){

console.error(
err
);

alert(
"Lưu thất bại"
);

}

}

// =======================
// LOAD SETTINGS
// =======================

export async function loadUserMusicSettings(){

try{

const user=
auth.currentUser;

if(
!user
)
return;

const doc=
await db
.collection(
"users"
)
.doc(
user.uid
)
.get();

if(
!doc.exists
)
return;

const data=
doc.data();

const url=
data.musicUrl||
"";

const auto=
data.autoPlayMusic||
false;

localStorage.setItem(
"musicUrl",
url
);

localStorage.setItem(
"autoPlayMusic",
auto
);

const input=
document
.getElementById(
"musicUrl"
);

if(
input)
input.value=
url;

const checkbox=
document
.getElementById(
"autoPlayMusic"
);

if(
checkbox)
checkbox.checked=
auto;

if(
auto){

playSavedMusic();

}

}catch(err){

console.error(
err
);

}

}

// =======================
// AUTOPLAY
// =======================

export async function toggleAutoPlayMusic(){

try{

const checked=
document
.getElementById(
"autoPlayMusic"
)
.checked;

localStorage.setItem(
"autoPlayMusic",
checked
);

const user=
auth.currentUser;

if(
user){

await db
.collection(
"users"
)
.doc(
user.uid
)
.set({

autoPlayMusic:
checked

},{
merge:true
});

}

if(
checked){

playSavedMusic();

}

}catch(err){

console.error(
err
);

}

}

// =======================
// PLAY URL
// =======================

export function playMusicFromUrl(
url
){

if(
!url
)
return;

const frame=
document
.getElementById(
"musicPlayer"
);

if(
!frame
)
return;

frame.src=
buildYoutubeEmbedUrl(
url
);

}

// =======================
// PLAY SAVED
// =======================

export function playSavedMusic(){

const url=

localStorage
.getItem(
"musicUrl"
);

if(
!url
)
return;

playMusicFromUrl(
url
);

}

// =======================
// STOP
// =======================

export function stopMusic(){

const frame=
document
.getElementById(
"musicPlayer"
);

if(
frame){

frame.src=
"";

}

}

// =======================
// EXTRACT ID
// =======================

export function extractYoutubeVideoId(
url
){

if(
!url
)
return null;

let match=
url.match(
/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/i
);

if(
match &&
match[1]
){

return match[1];

}

match=
url.match(
/youtube\.com\/embed\/([^?]+)/i
);

if(
match &&
match[1]
){

return match[1];

}

return null;

}

// =======================
// BUILD EMBED
// =======================

export function buildYoutubeEmbedUrl(
url
){

const id=
extractYoutubeVideoId(
url
);

if(
!id
)
return "";

return `https://www.youtube.com/embed/${id}?autoplay=1`;

}
