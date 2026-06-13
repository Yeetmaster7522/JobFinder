class LogUser {
    #users
    #modal

    constructor(users) {
        this.#users = users;
        console.log(users)
        this.#modal = document.getElementById("successModal");

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
            forgotPswrd.addEventListener("click", () => {this.setModal("email sent")});
        }
    }

    setModal(title, body="") {
        const modalTitle = this.#modal.querySelector(".modal-title");
        const modalBody = this.#modal.querySelector(".modal-body");

        modalTitle.textContent = title;
        modalBody.textContent = body;
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
                this.setModal("Email or password is wrong", "Please try again");
            }
            else {
                const user = this.#users[userUid];

                setCookie("UID", userUid, 1);
                this.setModal("Logged in", `Welcome back ${user.email}`);
                setTimeout(() => {
                    window.location.href = `/webpages/${user.role}/profile.html`;
                }, 500);
            }
        }
        else {
            this.setModal("Please fill out fields", "One or more fields have not been completed");
        }
    }

    signUp() {
        const userEmail = document.getElementById("email-input").value;
        const userPassword = document.getElementById("password-input").value;
        const newUID = this.genUID();

        ws.send(JSON.stringify( {"request": "createuser", "uid": newUID, "email": userEmail, "password": userPassword, "role": "student"} ))
        this.setModal("Signed up");
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