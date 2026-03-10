class logUser {
    constructor() {
        const logInBtn = document.getElementById("log-in-btn");
        const signUpBtn = document.getElementById("sign-up-btn");

        logInBtn.addEventListener("click", this.logIn);
        signUpBtn.addEventListener("click", this.signUp);

    }

    logIn() {
        console.log("logged in");
    }

    signUp() {
        console.log("signed up");
    }
}