class UserManager {
    constructor(user) {
        const profilePic = document.getElementById("profile-pic");
        
        profilePic.src = "/assets/placeholder.png";
        profilePic.addEventListener("click", () => {
            console.log("change profile pic");
        });

        document.getElementById("log-out-btn").addEventListener("click", () => {
            this.logOut();
        });
    }

    logOut() {
        setCookie("UID", "", -1);
    }
}

class StudentManager extends UserManager {
    constructor(user) {
        document.getElementById("qualifications-header").addEventListener("click", () => {
            this.toggleArrow(document.getElementById("qualifications-arrow"));
        });
        document.getElementById("preference-header").addEventListener("click", () => {
            this.toggleArrow(document.getElementById("preference-arrow"));
        });
        document.getElementById("saved-header").addEventListener("click", () => {
            this.toggleArrow(document.getElementById("saved-arrow"));
        });
        document.getElementById("hidden-header").addEventListener("click", () => {
            this.toggleArrow(document.getElementById("hidden-arrow"));
        });

        super(user);

        document.getElementById("name").innerText = user.student.name;
        document.getElementById("email").innerText = user.email;
        document.getElementById("number").innerText = user.student.phoneNumber;
        document.getElementById("suburb").innerText = user.student.suburb;
        
        // qualifications
        document.getElementById("education").innerText = user.student.experienceLevel;

        const skillsList = document.getElementById("skills-list");
        for (const s of user.student.skills) {
            appendLI(skillsList, s);
        }

        const certList = document.getElementById("cert-list");
        for (const c of user.student.certifications) {
            appendLI(certList, c)
        }

        document.getElementById("work-eligibility").innerText = user.student.workEligibility;

        // preferences
        const industryList = document.getElementById("industry-list");
        for (const i of user.student.preferences.industries) {
            appendLI(industryList, i)
        }

        document.getElementById("min-salary").innerText = user.student.preferences.minSalary;

        const hours = document.getElementById("hours");
        for (const interval of user.student.timeIntervals) {
            appendLI(hours, `${interval.start} - ${interval.end}`);

        }

        document.getElementById("work-type").innerText = user.student.preferences.workType;
        document.getElementById("employment-type").innerText = user.student.preferences.employmentType;
        document.getElementById("loc-radius").innerText = `${user.student.preferences.locationRadius}km`;

        // applied jobs
        try {
            const appliedJobsEl = document.getElementById("applied-jobs");
            let appliedJobs = JSON.parse(getCookie("appliedJobs")) || [];
            for (let i=0; i<appliedJobs.length; i++) {
                let li = document.createElement("li");
                li.classList = "list-group-item bg-secondary text-light";
                li.classList.add("list-group-item");
                let p = document.createElement("p");
                p.textContent = `MM.YY ${appliedJobs[i].jobTitle} / Not yet read`;
                li.appendChild(p);
                appliedJobsEl.appendChild(li);
            };
        }
        catch (err) {
            console.log(err);
        };

        // saved jobs
        try {
            const savedBox = document.getElementById("saved-jobs");
            const savedJobs = JSON.parse(getCookie("savedJobs")) || [];
            for (let i=0; i<savedJobs.length; i++) {
                let li = document.createElement("li");
                li.classList = "list-group-item bg-secondary text-light";
                li.classList.add("list-group-item");
                let p = document.createElement("p");
                p.textContent = `${savedJobs[i].jobTitle}`;
                li.appendChild(p);
                savedBox.appendChild(li);
            };
        }
        catch (err) {
            console.log(err);
        };

        // hidden jobs
        try {
            const hiddenBox = document.getElementById("hidden-jobs");
            const hiddenJobs = JSON.parse(getCookie("hiddenJobs")) || [];
            for (let i=0; i<hiddenJobs.length; i++) {
                let li = document.createElement("li");
                li.classList = "list-group-item bg-secondary text-light";
                li.classList.add("list-group-item");
                let p = document.createElement("p");
                p.textContent = hiddenJobs[i].jobTitle;
                li.appendChild(p);
                hiddenBox.appendChild(li);
            };
        }
        catch (err) {
            console.log(err);
        };
    }

    getUserDetailInp() {
        // const profilePic = document.getElementById("profile-pic");
        let skills = document.getElementById("skills-list").querySelectorAll("li");
        skills = Array.from(skills).map(li => li.textContent.trim());
        let certs = document.getElementById("cert-list").querySelectorAll("li");
        certs = Array.from(certs).map(li => li.textContent.trim());
        const eligibility = document.getElementById("work-eligibility").textContent;

        let industries = document.getElementById("industry-list").querySelectorAll("li");
        industries = Array.from(industries).map(li => li.textContent.trim());
        let hours = document.getElementById("hours").querySelectorAll("li");
        hours = Array.from(hours).map(li => {
            li = li.textContent;
            li = li.split(" ");
            li = {
                "start": li[0],
                "end": li[2]
            };

            return li;
        });

        return {
            "name": document.getElementById("name").textContent,
            "email": document.getElementById("email").textContent,
            "number": document.getElementById("number").textContent,
            "suburb": document.getElementById("suburb").textContent,
            "resume": document.querySelector("#resume-file").files[0],
            "education": document.getElementById("education").textContent,
            "skills": skills,
            "certifications": certs,
            "eligibility": eligibility,
            "industries": industries,
            "salary": document.getElementById("min-salary").textContent,
            "hours": hours,
            "workType": document.getElementById("work-type").textContent,
            "employmentType": document.getElementById("employment-type").textContent,
            "locationRadius": document.getElementById("loc-radius").textContent
        };
    }

    toggleArrow(element) {
        if (element.innerText == ">") {
            element.innerText = "^";
        }
        else {
            element.innerText = ">";
        }
    }
}

class EmployerManager extends UserManager {
    constructor(user) {
        super(user);

        document.getElementById("company-name").value = user.employer.companyName;
        document.getElementById("address").value = user.employer.address;
        document.getElementById("contact-number").value = user.employer.contactNumber;
        document.getElementById("contact-email").value = user.employer.contactEmail;
        document.getElementById("website").value = user.employer.website;
    }

    getUserDetailInp() {
        return {
            "company-name": document.getElementById("company-name").value,
            "address": document.getElementById("address").value,
            "contact-number": document.getElementById("contact-number").value,
            "contact-email": document.getElementById("contact-email").value,
            "website": document.getElementById("website").value,
        };
    }
}

window.addEventListener("mainReady", async () => {
    const user = await window.main.getUser();
    let userManager;
    let timeout;

    if (user.role == "employer") {
        userManager = new EmployerManager(user);
    }
    else {
        userManager = new StudentManager(user);
    }

    document.getElementById("form-container").addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            main.editUserData(userManager.getUserDetailInp());
        }, 3000);
    });

});