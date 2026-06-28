// modules/googleSync.js

export async function pushToGoogle(event){

 const token=
 localStorage
 .getItem(
  "googleToken"
 );

 if(!token)
 return;

 await fetch(
 "https://www.googleapis.com/calendar/v3/calendars/primary/events",
 {
   method:"POST",
   headers:{
      Authorization:
      `Bearer ${token}`,
      "Content-Type":
      "application/json"
   },
   body:
   JSON.stringify({

     summary:
     event.title,

     start:{
      dateTime:
      event.start
     },

     end:{
      dateTime:
      event.end
     }

   })
 });

}


export function initGoogleSync(){

 console.log(
   "google sync started"
 );

}
export function googleLogin(){
 console.log("google login");
}

export function logout(){
 firebase.auth().signOut();
}
