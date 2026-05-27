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
        const users = window.main.users;

        if (emailInp.trim() != "" && passwordInp.trim() != "") {
            for (const uid in users) {
                let user = users[uid]
                if (user.email.toLowerCase() == emailInp.toLowerCase()) {
                    if (user.password == passwordInp) {
                        alert("Logged in.")
                        setCookie("UID", uid, 1);
                        if (user.role == "student") {
                            window.location.href = "/webpages/student/profile.html";
                        }
                        else if (user.role == "employer") {
                            window.location.href = "/webpages/employer/profile.html";
                        }
                        break;
                    }
                    else {
                        alert("Username or password incorrect.")
                    }
                }
                else {
                    alert("Email does not exist in userbase, please sign up.");
                    window.location.href = "/webpages/shared/signUp.html";
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
        const newUID = window.main.genUID();
        window.main.users[newUID] = {
            "email": userEmail,
            "password": userPassword,
            "role": ""
        }
        alert("Signed up");
    }
}

window.addEventListener("mainReady", () => {
    const logUser = new LogUser(window.main.users);
});