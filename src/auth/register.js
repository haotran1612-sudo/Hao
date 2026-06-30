   import {
  auth,
  db
} from "./firebase.js";

// =======================
// REGISTER
// =======================
export async function registerUser() {

  const email =
    document
      .getElementById(
        "registerEmail"
      )
      ?.value
      .trim();

  const password =
    document
      .getElementById(
        "registerPassword"
      )
      ?.value || "";

  // Validate
  if (!email) {
    alert("Vui lòng nhập email");
    return;
  }

  if (!password) {
    alert("Vui lòng nhập mật khẩu");
    return;
  }

  if (password.length < 6) {
    alert(
      "Mật khẩu phải có ít nhất 6 ký tự"
    );
    return;
  }

  try {

    // Tạo tài khoản
    const userCredential =
      await auth
        .createUserWithEmailAndPassword(
          email,
          password
        );

    const user =
      userCredential.user;

    // Lưu user
    await db
      .collection("users")
      .doc(user.uid)
      .set(
      {
        uid: user.uid,
        email:
          user.email ||
          email,

        provider:
          "password",

        musicUrl:
          "",

        autoPlayMusic:
          false,

        createdAt:
          firebase
            .firestore
            .FieldValue
            .serverTimestamp(),

        updatedAt:
          firebase
            .firestore
            .FieldValue
            .serverTimestamp()

      },
      {
        merge: true
      });

    // Auto login
    localStorage.setItem(
      "userEmail",
      user.email ||
      email
    );

    document.getElementById(
      "loginPage"
    ).style.display =
      "none";

    document.getElementById(
      "appPage"
    ).style.display =
      "block";

    document.getElementById(
      "welcomeUser"
    ).innerText =
      user.email ||
      email;

    await requestNotificationPermission();

    await loadTasks();

    await loadUserMusicSettings();

    alert(
      "Đăng ký thành công"
    );

  } catch (err) {

    console.error(
      "Register error:",
      err
    );

    if (
      err.code ===
      "auth/invalid-email"
    ) {

      alert(
        "Email không đúng định dạng."
      );

      return;

    }

    if (
      err.code ===
      "auth/weak-password"
    ) {

      alert(
        "Mật khẩu quá yếu."
      );

      return;

    }

    if (
      err.code ===
      "auth/email-already-in-use"
    ) {

      try {

        const methods =
          await auth
          .fetchSignInMethodsForEmail(
            email
          );

        if (
          methods.includes(
            "password"
          ) &&
          methods.includes(
            "google.com"
          )
        ) {

          alert(
            "Email này có thể đăng nhập bằng cả Password và Google."
          );

          return;

        }

        if (
          methods.includes(
            "password"
          )
        ) {

          alert(
            "Email này đã được đăng ký bằng mật khẩu."
          );

          return;

        }

        if (
          methods.includes(
            "google.com"
          )
        ) {

          alert(
            "Email này đang dùng đăng nhập Google."
          );

          return;

        }

        alert(
          "Email này đã tồn tại."
        );

      } catch (
        checkErr
      ) {

        console.error(
          checkErr
        );

        alert(
          "Email này đã tồn tại."
        );

      }

      return;

    }

    alert(
      err.message ||
      "Đăng ký thất bại"
    );

  }

}

// =======================
// CHECK LOGIN PROVIDERS
// =======================
export async function checkProviders(){

  const email =
    document
    .getElementById(
      "loginEmail"
    )
    .value
    .trim();

  if(!email){

    alert(
      "Vui lòng nhập email trước"
    );

    return;

  }

  try{

    const methods =
      await auth
      .fetchSignInMethodsForEmail(
        email
      );

    if(
      !methods ||
      methods.length===0
    ){

      alert(
        "Email này chưa được đăng ký."
      );

      return;

    }

    const providerText =
      methods.join(", ");

    if(
      methods.includes("password")
      &&
      methods.includes("google.com")
    ){

      alert(
        "Email này có thể đăng nhập bằng cả Password và Google."
      );

    }else if(
      methods.includes("password")
    ){

      alert(
        "Email này đăng nhập bằng Password."
      );

    }else if(
      methods.includes("google.com")
    ){

      alert(
        "Email này đăng nhập bằng Google."
      );

    }else{

      alert(
        "Phương thức đăng nhập: " +
        providerText
      );

    }

  }catch(err){

    console.error(err);

    alert(
      err.message ||
      "Không kiểm tra được phương thức đăng nhập"
    );

  }

}

// =======================
// RESET PASSWORD
// =======================
export async function resetPassword(){

  const email =
    document
    .getElementById(
      "loginEmail"
    )
    .value
    .trim();

  if(!email){

    alert(
      "Vui lòng nhập email trước"
    );

    return;

  }

  try{

    await auth
      .sendPasswordResetEmail(
        email
      );

    alert(
      "Đã gửi email đặt lại mật khẩu"
    );

  }catch(err){

    console.error(
      err
    );

    if(
      err.code===
      "auth/user-not-found"
    ){

      alert(
        "Email chưa được đăng ký"
      );

    }else if(
      err.code===
      "auth/invalid-email"
    ){

      alert(
        "Email không đúng định dạng"
      );

    }else{

      alert(
        err.message ||
        "Không gửi được email reset"
      );

    }

  }

}
