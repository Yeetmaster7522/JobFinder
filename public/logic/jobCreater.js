class JobCreater {
    constructor() {
        const submitBtn = document.getElementById("submit-btn");

        submitBtn.addEventListener("click", async () => {
            const post = await this.submit();
            if (this.validatePost(post)) {
                const user = await window.main.getUser();
                const newUserPosts = [...user.employer.jobPosts, post.ID];
                const newUser = setNestedValue(user, "employer.jobPosts", newUserPosts);
                ws.send(JSON.stringify( {"request": "createpost", "post": post} ));
                ws.send(JSON.stringify( {"request": "edituser", "uid": getCookie("UID"), "details": newUser} ));
                setModal("Job posted");
            }
        });
    }

    validatePost(post) {
        let valid = true;

        if (
            post.companyName.trim() == "" ||
            post.address.trim() == "" ||
            post.summary.trim() == "" ||
            post.jobTitle.trim() == "" ||
            post.workType.trim() == "Work Type" ||
            post.employmentType == "Employment Type" ||
            post.ageRequirement.trim() == "" ||
            post.salaryMin.trim() == "" ||
            post.salaryMax.trim() == "" ||
            post.skills.length == 0 ||
            post.industry.trim() == "" ||
            post.hours.length == 0
        ) {
            valid = false;
            setModal("Input field(s) left blank");
        }

        const ageRequirement = parseInt(post.ageRequirement);

        if (
            ageRequirement < 12 ||
            ageRequirement > 30
        ) {
            valid = false;
            setModal("Age requirement out of range", "Range from 13 to 29 accepted");
        }

        if (post.datePosted >= post.deadline) {
            valid = false;
            setModal("Deadline cannot be set to today or before today");
        }

        if (post.hours.length != 0) {
            for (const timestamp of post.hours) {
                if (timestamp.length != 2) {
                    valid = false;
                    setModal("Timestamp not in format hr:min - hr:min");
                }
                else {
                    const time1 = timestamp[0].split(":");
                    const time2 = timestamp[1].split(":");

                    const hr1 = parseInt(time1[0], 10);
                    const min1 = parseInt(time1[1], 10);
                    const hr2 = parseInt(time2[0], 10);
                    const min2 = parseInt(time2[1], 10);

                    if (time1.length != 2 || time2.length != 2) {
                        valid = false;
                        setModal("Timestamp not in format hr:min - hr:min");
                    }

                    if (
                        isNaN(hr1) ||
                        isNaN(min1) ||
                        isNaN(hr2) ||
                        isNaN(min2)
                    ) {
                        valid = false;
                        setModal("Timestamp includes non-numbers");
                    }
                    else if (
                        hr1 < 0 ||
                        hr1 > 24 ||
                        hr2 < 0 ||
                        hr2 > 24 ||
                        min1 < 0 ||
                        min1 > 59 ||
                        min2 < 0 ||
                        min2 > 59
                    ) {
                        valid = false;
                        setModal("Timestamp out of time");
                    }

                    if (
                        hr2 < hr1 ||
                        hr1 == hr2 && min2 < min1
                    ) {
                        valid = false;
                        setModal("Timestamp out of order");
                    }
                }
            }
        }

        return valid
    }

    async submit() {
        const user = await window.main.getUser();
        
        const date = new Date();
        const msAfterEpoch = date.getTime() + (document.getElementById("recruitment-period-entry").value*24*60*60*1000);
        const newDate = new Date(msAfterEpoch);

        const skills = document.getElementById("skills-entry").value;
        
        let hours = document.getElementById("hours-entry").value;
        hours = hours.split("\n");
        hours = hours.map(x => x.split(" - "));

        return {
            "companyName": user.employer.companyName, 
            "datePosted": date,
            "deadline": newDate,
            "address": document.getElementById("address-entry").value, 
            "summary": document.getElementById("description-entry").value, 
            "jobTitle": document.getElementById("job-title-entry").value, 
            "workType": document.getElementById("work-type-entry").value, 
            "employmentType": document.getElementById("employment-type-entry").value, 
            "ageRequirement": document.getElementById("age-entry").value, 
            "salaryMin": document.getElementById("salary-min-entry").value, 
            "salaryMax": document.getElementById("salary-max-entry").value, 
            "source": 2, 
            "externalLink": user.employer.website, 
            "skills": skills.split("\n"),
            "industry": document.getElementById("industry-entry").value, 
            "hours": hours,
            "ID": getRndInteger(100000, 999999)
        };
    }
}

window.addEventListener("mainReady", async () => {
    const jobCreater = new JobCreater();
    const user = await window.main.getUser();

    document.getElementById("use-address").addEventListener("click", () => {
        const addressEntry = document.getElementById("address-entry");
        addressEntry.value = user.employer.address;
    });
});