function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function randomChar() {
    const chars = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    return chars[getRndInteger(0, chars.length)];
}

function genUID() {
    let UID = "";
    for (let i=0; i<8; i++) {
        UID += randomChar();
    }
    return UID;
}

class LogUser {
    constructor() {
        const logInBtn = document.getElementById("log-in-btn");
        const signUpBtn = document.getElementById("sign-up-btn");
        const forgotPswrd = document.getElementById("forgot-pswrd");

        if (logInBtn) {
            logInBtn.addEventListener("click", () => this.logIn());
        }

        if (signUpBtn) {
            signUpBtn.addEventListener("click", () => this.signUp());
        }

        if (forgotPswrd) {
            forgotPswrd.addEventListener("click", () => {alert("email sent")});
        }

    }

    logIn() {
        const emailInp = document.getElementById("email-input").value;
        const passwordInp = document.getElementById("password-input").value;

        if (emailInp.trim() != "" && passwordInp.trim() != "") {
            for (const uid in users) {
                const user = users[uid]
                if (user.email === emailInp) {
                    if (user.password === passwordInp) {
                        alert("Logged in.")
                        setCookie("UID", uid, 1);
                        window.location.href = "profile.html";
                    }
                    else {
                        alert("Username or password incorrect.")
                    }
                }
                else {
                    alert("Email does not exist in userbase, please sign up.");
                    window.location.href = "signUp.html";
                }
            }
        }
        else {
            alert("Please fill out fields")
        }

    }

    signUp() {
        const userEmail = document.getElementById("email-input").value;
        const userPassword = document.getElementById("password-input").value;
        const newUID = genUID();
        users[newUID] = {
            "email": userEmail,
            "password": userPassword,
            "role": ""
        }
        console.log(users);
        alert("Signed up");
    }
}

window.addEventListener("mainReady", () => {
    const logUser = new LogUser();
});