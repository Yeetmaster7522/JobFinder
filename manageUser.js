class UserManager {
    constructor() {
        const name = document.getElementById("name");
        const email = document.getElementById("email");

        name.innerText = getCookie("user");
        email.innerText = `${getCookie("user")}@gmail.com`;
    }

}

const userManager = new UserManager();