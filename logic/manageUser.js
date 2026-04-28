class UserManager {
    constructor() {
        document.getElementById("log-out-btn").addEventListener("click", () => {
            this.logOut();
        });

        const UID = getCookie("UID");
        let user = users[UID];
        
        document.getElementById("profile-pic").src = "placeholder.png";
        document.getElementById("name").innerText = user.student.name;
        document.getElementById("email").innerText = user.email;
        document.getElementById("number").innerText = user.student.phoneNumber;
        document.getElementById("suburb").innerText = user.student.suburb;
        document.getElementById("resume-title").innerText = user.student.resume.source;
        document.getElementById("resume-date").innerText = `Added: ${user.student.resume.date}`;
        
        // qualifications
        document.getElementById("education").innerText = user.student.experienceLevel;

        const skillsList = document.getElementById("skills-list");
        for (const i in user.student.skills) {
            let li = document.createElement("li");
            li.innerText = user.student.skills[i];
            skillsList.appendChild(li);
        }

        const certList = document.getElementById("cert-list");
        for (const i in user.student.certifications) {
            let li = document.createElement("li");
            li.innerText = user.student.certifications[i];
            certList.appendChild(li);
        }

        document.getElementById("work-eligibility").innerText = user.student.workEligibility;

        // preferences
        const industryList = document.getElementById("industry-list");
        for (const i in user.student.preferences.industries) {
            let li = document.createElement("li");
            li.innerText = user.student.preferences.industries[i];
            industryList.appendChild(li);
        }

        document.getElementById("min-salary").innerText = user.student.preferences.minSalary;

        const hours = document.getElementById("hours");
        for (const i in user.student.timeIntervals) {
            let li = document.createElement("li");
            let interval = user.student.timeIntervals[i];
            li.innerText = `${interval.start} - ${interval.end}`;
            hours.appendChild(li);

        }

        document.getElementById("work-type").innerText = user.student.preferences.workType;
        document.getElementById("employment-type").innerText = user.student.preferences.employmentType;
        document.getElementById("loc-radius").innerText = `${user.student.preferences.locationRadius}km`;

        // applied jobs
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

        // saved jobs
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

        // hidden jobs
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

    logOut() {
        setCookie("UID", "", -1);
    }

}

window.addEventListener("mainReady", () => {
    const userManager = new UserManager();
});