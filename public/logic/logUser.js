class LogUser {
    #modal

    constructor() {
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
                this.setModal("Email or password is wrong", "Please try again");
            }
            else {
                const user = window.main.users[userUid];

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
        window.main.users[newUID] = {
            "email": userEmail,
            "password": userPassword,
            "role": ""
        }
        this.setModal("Signed up");
    }

    genUID() {
        let UID = "";
        for (let i=0; i<8; i++) {
            UID += randomChar();
        }

        return UID;
    }
}

window.addEventListener("mainReady", () => {
    const logUser = new LogUser(window.main.users);
});