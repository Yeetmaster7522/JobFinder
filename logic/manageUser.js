class UserManager {
    constructor() {
        const UID = getCookie("UID");
        let user = users[UID];
        
        document.getElementById("profile-pic").src = "placeholder.png";
        document.getElementById("name").innerText = user.student.name;
        document.getElementById("email").innerText = user.email;
        document.getElementById("number").innerText = user.student.phoneNumber;
        document.getElementById("suburb").innerText = user.student.suburb;
        document.getElementById("resume-title").innerText = user.student.resume.source;
        document.getElementById("resume-date").innerText = `Added: ${user.student.resume.date}`;
        document.getElementById("education").innerText = user.student.experienceLevel;

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

window.addEventListener("mainReady", () => {
    const userManager = new UserManager();
});