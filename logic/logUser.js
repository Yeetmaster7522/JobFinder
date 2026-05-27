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

    findUser(email, pswrd) {
        const users = window.main.users;
        let UID = -1;

        for (const uid in users) {
            const user = users[uid];
            if (
                email.toLowerCase() == user.email.toLowerCase()
                && pswrd == user.password
            ) {
                UID = uid;
            }
        }

        return UID;
    }

    logIn() {
        const emailInp = document.getElementById("email-input").value;
        const pswrdInp = document.getElementById("password-input").value;

        if (emailInp.trim() != "" && pswrdInp.trim() != "") {
            const userUid = this.findUser(emailInp, pswrdInp);

            if (userUid == -1) {
                alert("Email does not exist in userbase, please sign up.");
            }
            else {
                const user = window.main.users[userUid];

                setCookie("UID", userUid, 1);
                window.location.href = `/webpages/${user.role}/profile.html`;
                alert("Logged in");
            }
        }
        else {
            alert("Please fill out fields");
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