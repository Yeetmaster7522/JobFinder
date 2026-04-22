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
        fetch("database/userAccounts.json")
            .then(response => response.json())
            .then(data => {
                this.users = data;
            })
            .catch(err => console.error("Error loading JSON:", err));

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
        // alert("Logged in!");
        // let email = document.getElementById("email-input").value;
        // let name = this.extractNames(email);
        // setCookie("user", `${name[0]} ${name[1]}`, 1);
        // window.location.href = "profile.html";
        const emailInp = document.getElementById("email-input").value;
        const passwordInp = document.getElementById("password-input").value;
        console.log(this.users);

        for (const uid in this.users) {
            if (this.users[uid].email === emailInp) {
                if (this.users[uid].password === passwordInp) {
                    alert("Logged in.")
                }
                else {
                    alert("Username or password incorrect.")
                }
            }
            else {
                alert("Email does not exist in userbase, please sign up.");
                // window.location.href = "signUp.html";
            }
        }

    }

    signUp() {
        const userEmail = document.getElementById("email-input").value;
        const userPassword = document.getElementById("password-input").value;
        const newUID = genUID();
        this.users[newUID] = {
            "email": userEmail,
            "password": userPassword,
            "role": ""
        }
        console.log(this.users);
        alert("Signed up");
    }
}

const logUser = new LogUser();