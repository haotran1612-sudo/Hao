// =======================
// MUSIC MODULE
// src/music/music.js
// =======================

import { db } from "../config/firebase.js";


// =======================
// EXTRACT VIDEO ID
// =======================

export function extractYoutubeVideoId(
  url
) {

  if (!url) {

    return "";

  }

  try {

    const u =
      new URL(
        url
      );

    // youtu.be/xxx
    if (

      u.hostname
      .includes(
        "youtu.be"
      )

    ) {

      return u.pathname
        .replace(
          "/",
          ""
        )
        .trim();

    }

    // youtube.com/watch?v=
    const v =
      u.searchParams
      .get(
        "v"
      );

    if (
      v
    ) {

      return v;

    }

    // embed
    if (

      u.pathname
      .includes(
        "/embed/"
      )

    ) {

      return u.pathname
        .split(
          "/embed/"
        )[1]
        .split(
          "/"
        )[0];

    }

    // shorts
    if (

      u.pathname
      .includes(
        "/shorts/"
      )

    ) {

      return u.pathname
        .split(
          "/shorts/"
        )[1]
        .split(
          "/"
        )[0];

    }

    return "";

  }

  catch {

    return "";

  }

}


// =======================
// BUILD EMBED
// =======================

export function buildYoutubeEmbedUrl(

  videoId,

  autoplay = true

) {

  if (

    !videoId

  ) {

    return "";

  }

  return

`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay?1:0}&rel=0`;

}


// =======================
// PLAY
// =======================

export function playMusicFromUrl(
  url
) {

  const videoId =
    extractYoutubeVideoId(
      url
    );

  if (

    !videoId

  ) {

    alert(
      "Link YouTube không hợp lệ"
    );

    return;

  }

  const iframe =
    document.getElementById(
      "musicPlayer"
    );

  const wrap =
    document.getElementById(
      "musicPlayerWrap"
    );

  if (

    !iframe ||

    !wrap

  ) {

    return;

  }

  iframe.src =
    buildYoutubeEmbedUrl(
      videoId,
      true
    );

  wrap.style.display =
    "block";

}


// =======================
// STOP
// =======================

export function stopMusic(){

const iframe=
document.getElementById(
"musicPlayer"
);

if(
iframe
){

iframe.src="";

}

}


// =======================
// PLAY SAVED
// =======================

export function playSavedMusic(){

const url=
document
.getElementById(
"musicUrl"
)
?.value
.trim()

||

"";

if(
!url
){

alert(
"Chưa có link nhạc"
);

return;

}

playMusicFromUrl(
url
);

}


// =======================
// SAVE
// =======================

export async function saveMusicUrl(){

try{

const email=
localStorage
.getItem(
"userEmail"
);

if(
!email
){

alert(
"Bạn chưa đăng nhập"
);

return;

}

const musicUrl=
document
.getElementById(
"musicUrl"
)
?.value
.trim()

||

"";

const autoPlay=
document
.getElementById(
"autoPlayMusic"
)
?.checked

||

false;

const videoId=
extractYoutubeVideoId(
musicUrl
);

if(
!videoId
){

alert(
"Link YouTube không hợp lệ"
);

return;

}

await db
.collection(
"users"
)
.doc(
email
)
.set({

email,

musicUrl,

autoPlayMusic:
autoPlay,

updatedAt:
new Date()

},

{

merge:
true

}

);

alert(
"Đã lưu nhạc"
);

}

catch(
err
){

console.error(
err
);

alert(
"Không lưu được nhạc"
);

}

}


// =======================
// LOAD USER SETTINGS
// =======================

export async function loadUserMusicSettings(){

try{

const email=
localStorage
.getItem(
"userEmail"
);

if(
!email
){

return;

}

const doc=
await db
.collection(
"users"
)
.doc(
email
)
.get();

if(
!doc.exists
){

return;

}

const data=
doc.data()
|| {};

const input=
document
.getElementById(
"musicUrl"
);

if(
input
){

input.value=
data.musicUrl
|| "";

}

const auto=
document
.getElementById(
"autoPlayMusic"
);

if(
auto
){

auto.checked=
!!data.autoPlayMusic;

}

if(

data.musicUrl
&&
data.autoPlayMusic

){

playMusicFromUrl(
data.musicUrl
);

}

}

catch(
err
){

console.error(
err
);

}

}


// =======================
// AUTOPLAY
// =======================

export async function toggleAutoPlayMusic(
checkbox
){

try{

const email=
localStorage
.getItem(
"userEmail"
);

if(
!email
){

return;

}

await db
.collection(
"users"
)
.doc(
email
)
.set({

email,

autoPlayMusic:
checkbox.checked,

updatedAt:
new Date()

},

{

merge:true

}

);

}

catch(
err
){

console.error(
err
);

}

}
