class Navbar {
    #element
    #studentHTML
    #employerHTML
    #profileName

    constructor() {
        this.#element = document.getElementById("navbar");
    }

    setHTML(student, employer) {
        this.#studentHTML = student;
        this.#employerHTML = employer;
    }

    insertHTML(html) {
        this.#element.innerHTML = html;
        this.#profileName = document.getElementById("profile-name");
    }

    setProfileName(text="Log In", href="/webpages/shared/logIn.html") {
        this.#profileName.innerText = text;
        this.#profileName.href = href;
    }

    applyNavbar(role) {
        if (role == "employer") {
            this.insertHTML(this.#employerHTML);
        }
        else {
            this.insertHTML(this.#studentHTML);
        }

    }
}