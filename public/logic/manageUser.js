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
        document.getElementById("education").value = user.student.experienceLevel;

        const skillsList = document.getElementById("skills-list");
        for (const s of user.student.skills) {
            appendLI(skillsList, s);
        }

        const certList = document.getElementById("cert-list");
        for (const c of user.student.certifications) {
            appendLI(certList, c)
        }

        document.getElementById("work-eligibility").value = user.student.workEligibility;

        // preferences
        const industryList = document.getElementById("industry-list");
        for (const i of user.student.preferences.industries) {
            appendLI(industryList, i)
        }

        document.getElementById("min-salary").value = parseInt(user.student.preferences.minSalary,10);

        const hours = document.getElementById("hours");
        for (const interval of user.student.timeIntervals) {
            appendLI(hours, `${interval.start} - ${interval.end}`);

        }

        document.getElementById("work-type").value = user.student.preferences.workType;
        document.getElementById("employment-type").value = user.student.preferences.employmentType;
        document.getElementById("loc-radius").value = user.student.preferences.locationRadius;

        // applied jobs
        this.showApplications(user);

        // saved jobs
        try {
            const savedBox = document.getElementById("saved-jobs");
            const savedJobs = JSON.parse(getCookie("savedJobs"));
            console.log(savedJobs)
            for (const job of savedJobs) {
                let li = document.createElement("li");
                li.classList.add("list-group-item", "bg-transparent", "text-light");
                li.addEventListener("click", () => {
                    window.location.href = `search.html?id=${job.ID}`;
                })
                
                li.innerHTML = `
                    <div class="container-fluid text-center">
                    <div class="row">
                        <div class="col-12">
                            <p class="mb-0">${job.jobTitle}</p>
                            <p class="small">${job.companyName}</p>
                        </div>
                    </div>
                </div>
                `

                savedBox.appendChild(li);
            }
        }
        catch (err) {
            console.log(err);
        };

        // hidden jobs
        try {
            const hiddenBox = document.getElementById("hidden-jobs");
            const hiddenJobs = JSON.parse(getCookie("hiddenJobs"));
            for (const job of hiddenJobs) {
                let li = document.createElement("li");
                li.classList.add("list-group-item", "bg-transparent", "text-light");
                
                li.innerHTML = `
                    <div class="container-fluid text-center">
                    <div class="row">
                        <div class="col-12">
                            <p class="mb-0">${job.jobTitle}</p>
                            <p class="small">${job.companyName}</p>
                        </div>
                    </div>
                </div>
                `

                hiddenBox.appendChild(li);
            };
        }
        catch (err) {
            console.log(err);
        };
    }

    async showApplications(user) {
        try {
            const appliedJobsEl = document.getElementById("applied-jobs");
            
            const appliedJobs = user.student.applications;
            const applications = JSON.parse(await wsRequest("applications"));
            const jobs = JSON.parse(await wsRequest("jobPosts"));

            for (const jpid of appliedJobs) {
                const aIndex = applications.findIndex(application => application.JPID == jpid && application.UID == getCookie("UID"));
                const jIndex = jobs.findIndex(job => job.ID == jpid);
                if (aIndex != -1 && jIndex != -1) {
                    const application = applications[aIndex];
                    const job = jobs[jIndex];

                    let li = document.createElement("li");
                    li.classList.add("list-group-item", "bg-mediumblue", "text-light");
                    let p = document.createElement("p");
                    p.textContent = `${application.dateApplied} ${job.jobTitle} / ${application.status}`;
                    li.appendChild(p);
                    appliedJobsEl.appendChild(li);
                }
            }
        }
        catch (err) {
            console.log(err);
        };
    }

    getUserDetailInp(user) {
        // const profilePic = document.getElementById("profile-pic");
        let skills = document.getElementById("skills-list").querySelectorAll("li");
        skills = Array.from(skills).map(li => li.textContent.trim());
        let certs = document.getElementById("cert-list").querySelectorAll("li");
        certs = Array.from(certs).map(li => li.textContent.trim());

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
            "email": document.getElementById("email").textContent,
            "password": user.password,
            "role": user.role,
            "profilePic": user.profilePic,
            "student": {
                "name": document.getElementById("name").textContent,
                "age": user.student.age,
                "phoneNumber": document.getElementById("number").textContent,
                "suburb": document.getElementById("suburb").textContent,
                "workEligibility": document.getElementById("work-eligibility").value,
                "experienceLevel": document.getElementById("education").value,
                "resume": document.querySelector("#resume-file").files[0],
                "preferences": {
                    "workType": document.getElementById("work-type").value,
                    "employmentType": document.getElementById("employment-type").value,
                    "minSalary": document.getElementById("min-salary").value,
                    "locationRadius": document.getElementById("loc-radius").value,
                    "industries": industries
                },
                "skills": skills,
                "certifications": certs,
                "timeIntervals": hours,
                "applications": user.student.applications
            }
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

    getUserDetailInp(user) {
        return {
            "email": document.getElementById("contact-email").value,
            "password": user.password,
            "role": user.role,
            "profilePic": user.profilePic,
            "employer": {
                "companyName": document.getElementById("company-name").value,
                "address": document.getElementById("address").value,
                "contactNumber": document.getElementById("contact-number").value,
                "contactEmail": document.getElementById("contact-email").value,
                "website": document.getElementById("website").value,
                "jobPosts": user.employer.jobPosts
            }
        }
    }
}

window.addEventListener("mainReady", async () => {
    const user = await window.main.getUser();
    let um;
    let timeout;

    if (user.role == "employer") {
        um = new EmployerManager(user);
    }
    else {
        um = new StudentManager(user);
    }

    document.getElementById("form-container").addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            const user = await window.main.getUser();
            ws.send(JSON.stringify({
                "request": "edituser",
                "uid": getCookie("UID"),
                "details": um.getUserDetailInp(user)
            }));
            setModal("User details updated");
        }, 3000);
    });

});