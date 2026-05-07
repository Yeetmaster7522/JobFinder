class UserManager {
    constructor() {
        document.getElementById("log-out-btn").addEventListener("click", () => {
            this.logOut();
        });

        document.getElementById("profile-pic").addEventListener("click", () => {
            console.log("change profile pic");
        });

        const UID = getCookie("UID");
        let user = users[UID];
        
        document.getElementById("profile-pic").src = "placeholder.png";
        document.getElementById("name").innerText = user.student.name;
        document.getElementById("email").innerText = user.email;
        document.getElementById("number").innerText = user.student.phoneNumber;
        document.getElementById("suburb").innerText = user.student.suburb;
        
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

        // // applied jobs
        // const appliedJobsEl = document.getElementById("applied-jobs");
        // let appliedJobs = JSON.parse(getCookie("appliedJobs")) || [];
        // for (let i=0; i<appliedJobs.length; i++) {
        //     let li = document.createElement("li");
        //     li.classList = "list-group-item bg-secondary text-light";
        //     let p = document.createElement("p");
        //     p.textContent = `MM.YY ${appliedJobs[i].jobTitle} / Not yet read`;
        //     li.appendChild(p);
        //     appliedJobsEl.appendChild(li);
        // }

        // // saved jobs
        // const savedBox = document.getElementById("saved-jobs");
        // const savedJobs = JSON.parse(getCookie("savedJobs")) || [];
        // for (let i=0; i<savedJobs.length; i++) {
        //     let li = document.createElement("li");
        //     li.classList = "list-group-item bg-secondary text-light";
        //     let p = document.createElement("p");
        //     p.textContent = `${savedJobs[i].jobTitle}`;
        //     li.appendChild(p);
        //     savedBox.appendChild(li);
        // }

        // // hidden jobs
        // const hiddenBox = document.getElementById("hidden-jobs");
        // const hiddenJobs = JSON.parse(getCookie("hiddenJobs")) || [];
        // for (let i=0; i<hiddenJobs.length; i++) {
        //     let li = document.createElement("li");
        //     li.classList = "list-group-item bg-secondary text-light";
        //     let p = document.createElement("p");
        //     p.textContent = hiddenJobs[i].jobTitle;
        //     li.appendChild(p);
        //     hiddenBox.appendChild(li);
        // }
    }

    logOut() {
        setCookie("UID", "", -1);
    }

    getUserDetails() {
        const name = document.getElementById("name").textContent;
        // const profilePic = document.getElementById("profile-pic");
        const email = document.getElementById("email").textContent;
        const number = document.getElementById("number").textContent;
        const suburb = document.getElementById("suburb").textContent;
        
        const resume = document.querySelector("#resume-file").files[0];
        
        const edu = document.getElementById("education").textContent;
        let skills = document.getElementById("skills-list").querySelectorAll("li");
        skills = Array.from(skills).map(li => li.textContent.trim());
        let certs = document.getElementById("cert-list").querySelectorAll("li");
        certs = Array.from(certs).map(li => li.textContent.trim());
        const eligibility = document.getElementById("work-eligibility").textContent;

        let industries = document.getElementById("industry-list").querySelectorAll("li");
        industries = Array.from(industries).map(li => li.textContent.trim());
        const salary = document.getElementById("min-salary").textContent;
        const hours = document.getElementById("hours").textContent;
        const workType = document.getElementById("work-type").textContent;
        const employmentType = document.getElementById("employment-type").textContent;
        const locationRadius = document.getElementById("loc-radius").textContent;

        console.log(name);
        console.log(skills);
        console.log(salary);
    }

}

function globalInit() {
    if (mainReady && DOMContentLoaded) {
        console.log("ready")
        const userManager = new UserManager();
        const container = document.getElementById("form-container");

        let timeout = null;

        container.addEventListener("input", () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                userManager.getUserDetails();
            }, 3000);
        });
    };
}

let mainReady = false;
let DOMContentLoaded = false;

window.addEventListener("mainReady", () => {
    mainReady = true;
    globalInit();
});

window.addEventListener("DOMContentLoaded", () => {
    DOMContentLoaded = true;
    globalInit();
});