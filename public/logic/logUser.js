class LogUser {
    #users

    constructor(users) {
        this.#users = users;
        console.log(users)

        const logInBtn = document.getElementById("log-in-btn");
        const signUpBtn = document.getElementById("sign-up-btn");
        const forgotPswrd = document.getElementById("forgot-pswrd");

        if (logInBtn) {
            logInBtn.addEventListener("click", () => this.logIn());
            document.getElementById("password-input").addEventListener("keydown", (e) => {
                if (e.key == "Enter") {
                    this.logIn();
                }
            });
        }

        if (signUpBtn) {
            signUpBtn.addEventListener("click", () => this.signUp());
            document.getElementById("password-input").addEventListener("keydown", (e) => {
                if (e.key == "Enter") {
                    this.signUp();
                }
            });
        }

        if (forgotPswrd) {
            forgotPswrd.addEventListener("click", () => {setModal("email sent")});
        }
    }

    findUser(email, pswrd) {
        let UID = -1;

        for (const uid in this.#users) {
            const user = this.#users[uid];
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
                setModal("Email or password is wrong", "Please try again");
            }
            else {
                const user = this.#users[userUid];

                setCookie("UID", userUid, 1);
                setModal("Logged in", `Welcome back ${user.email}`);
                setTimeout(() => {
                    window.location.href = `/webpages/${user.role}/profile.html`;
                }, 500);
            }
        }
        else {
            setModal("Please fill out fields", "One or more fields have not been completed");
        }
    }

    signUp() {
        const userEmail = document.getElementById("email-input").value;
        const userPassword = document.getElementById("password-input").value;
        const newUID = this.genUID();

        ws.send(JSON.stringify( {"request": "createuser", "uid": newUID, "email": userEmail, "password": userPassword, "role": "student"} ))
        setModal("Signed up");
    }

    genUID() {
        let UID = "UID";
        for (let i=0; i<8; i++) {
            UID += randomChar();
        }

        return UID;
    }
}

window.addEventListener("mainReady", async () => {
    const users = await wsRequest("userAccounts");
    const logUser = new LogUser(JSON.parse(users));
});