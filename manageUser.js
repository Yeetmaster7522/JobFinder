class UserManager {
    constructor() {
        const name = document.getElementById("name");
        const email = document.getElementById("email");

        name.innerText = getCookie("user");
        email.innerText = `${getCookie("user")}@gmail.com`;

        const appliedJobsEl = document.getElementById("applied-jobs");
        let appliedJobs = JSON.parse(getCookie("appliedJobs"));
        for (let i=0; i<appliedJobs.length; i++) {
            let li = document.createElement("li");
            li.classList = "list-group-item"
            let p = document.createElement("p");
            p.textContent = `MM.YY ${appliedJobs[i].jobTitle} / Not yet read`;
            li.appendChild(p);
            appliedJobsEl.append(li);
        }
    }

}

const userManager = new UserManager();