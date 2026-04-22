class LogUser {
    constructor() {
        const logInBtn = document.getElementById("log-in-btn");
        const signUpBtn = document.getElementById("sign-up-btn");

        if (logInBtn) {
            logInBtn.addEventListener("click", () => this.logIn());
        }

        if (signUpBtn) {
            signUpBtn.addEventListener("click", () => this.signUp());
        }

    }

    logIn() {
        alert("Logged in!");
        let email = document.getElementById("email-input").value;
        let name = this.extractNames(email);
        setCookie("user", `${name[0]} ${name[1]}`, 1);
        window.location.href = "profile.html";
    }

    signUp() {
        alert("Signed up!");
    }

    extractNames(email) {
        let local = email.split("@")[0];
        let parts = local.split(/[\.\_\-]/);
        let firstName = parts[0] || "";
        let lastName = parts[1] || "";

        return [firstName,lastName];
    }
}

const logUser = new LogUser();