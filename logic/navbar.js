class Navbar {
    #element
    #studentHTML
    #employerHTML
    #profileName

    constructor(student, employer) {
        this.#element = document.getElementById("navbar");
        this.#profileName = document.getElementById("profile-name");
        this.#studentHTML = student;
        this.#employerHTML = employer;
    }

    insertHTML(html) {
        this.#element.innerHTML = html;
    }

    setProfileName(text="Log In", href="/webpages/shared/logIn.html") {
        this.#profileName.innerText = text;
        this.#profileName.href = href;
    }

    applyNavbar(role) {
        if (role == "employer") {
            this.insertHTML(this.#employerHTML);
        }
        else if (role == "student") {
            this.insertHTML(this.#studentHTML);
        }
        else {
            this.insertHTML(this.#studentHTML);
        }

    }
}