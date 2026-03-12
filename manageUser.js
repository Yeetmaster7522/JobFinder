class UserManager {
    constructor() {
        const name = document.getElementById("name");
        const email = document.getElementById("email");

        name.innerText = getCookie("user");
        email.innerText = `${getCookie("user")}@gmail.com`;

        const appliedJobsEl = document.getElementById("applied-jobs");
        let appliedJobs = JSON.parse(getCookie("appliedJobs")) || [];
        for (let i=0; i<appliedJobs.length; i++) {
            let li = document.createElement("li");
            li.classList = "list-group-item bg-secondary text-light";
            let p = document.createElement("p");
            p.textContent = `MM.YY ${appliedJobs[i].jobTitle} / Not yet read`;
            li.appendChild(p);
            appliedJobsEl.appendChild(li);
        }

        const savedBox = document.getElementById("saved-jobs");
        const savedJobs = JSON.parse(getCookie("savedJobs")) || [];
        for (let i=0; i<savedJobs.length; i++) {
            let li = document.createElement("li");
            li.classList = "list-group-item bg-secondary text-light";
            let p = document.createElement("p");
            p.textContent = `${savedJobs[i].jobTitle}`;
            li.appendChild(p);
            savedBox.appendChild(li);
        }

        const hiddenBox = document.getElementById("hidden-jobs");
        const hiddenJobs = JSON.parse(getCookie("hiddenJobs")) || [];
        for (let i=0; i<hiddenJobs.length; i++) {
            let li = document.createElement("li");
            li.classList = "list-group-item bg-secondary text-light";
            let p = document.createElement("p");
            p.textContent = hiddenJobs[i].jobTitle;
            li.appendChild(p);
            hiddenBox.appendChild(li);
        }
    }

}

const userManager = new UserManager();