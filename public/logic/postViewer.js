class PostViwer {
    constructor(posts) {
        const params = new URLSearchParams(window.location.search);
        const submitBtn = document.getElementById("submit-btn");

        this.post = this.findPostByID(
            params.get("id"),
            posts
        );

        submitBtn.addEventListener("click", async () => {
            console.log("clicked")
            const post = await this.submit();
            if (this.validatePost(post)) {
                setModal("Job post edited");
                ws.send(JSON.stringify( {"request": "editpost", "post": post} ));
                
                await new Promise(resolve => {
                    const handler = event => {
                        const data = JSON.parse(event.data);
                        if (data.type === "editpost_ack") {
                            ws.removeEventListener("message", handler);
                            resolve();
                        }
                    };
                    ws.addEventListener("message", handler);
                });

                window.location.href = "/webpages/employer/managePosts.html";
            }
        });
    }

    findPostByID(id, posts) {
        let foundPost;

        for (const post of posts) {
            if (post.ID == id) {
                foundPost = post;
            }
        }

        return foundPost;
    }

    showPostDetails() {
        document.getElementById("job-title-entry").value = this.post.jobTitle;
        document.getElementById("work-type-entry").value = this.post.workType;
        document.getElementById("employment-type-entry").value = this.post.employmentType;
        document.getElementById("industry-entry").value = this.post.industry;
        document.getElementById("age-entry").value = this.post.ageRequirement;
        document.getElementById("description-entry").value = this.post.summary;
        document.getElementById("salary-min-entry").value = this.post.salaryMin;
        document.getElementById("salary-max-entry").value = this.post.salaryMax;
        document.getElementById("address-entry").value = this.post.address;
        
        document.getElementById("skills-entry").value = this.post.skills.join("\n");

        const hoursEntry = document.getElementById("hours-entry");
        for (const timestamp of this.post.hours) {
            hoursEntry.value += timestamp.join(" - ") + "\n";
        }
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
        }

        const ageRequirement = parseInt(post.ageRequirement);

        if (
            ageRequirement < 12 ||
            ageRequirement > 30
        ) {
            valid = false;
        }

        if (post.datePosted >= post.deadline) {
            valid = false;
        }

        for (const timestamp of post.hours) {
            if (timestamp.length != 2) {
                valid = false;
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
                }

                console.log(hr1, min1, hr2, min2)

                if (
                    isNaN(hr1) ||
                    isNaN(min1) ||
                    isNaN(hr2) ||
                    isNaN(min2)
                ) {
                    valid = false;
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
                }

                if (
                    hr2 < hr1 ||
                    hr1 == hr2 && min2 < min1
                ) {
                    valid = false;
                }
            }
        }

        return valid
    }

    async submit() {
        const user = await window.main.getUser();
        
        const date = new Date();

        const skills = document.getElementById("skills-entry").value;
        
        let hours = document.getElementById("hours-entry").value;
        hours = hours.split("\n");
        hours = hours.map(x => x.split(" - "));

        return {
            "companyName": user.employer.companyName, 
            "datePosted": this.post.datePosted,
            "deadline": this.post.deadline,
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
            "ID": this.post.ID
        };
    }
}

window.addEventListener("mainReady", async () => {
    const jobPosts = await wsRequest("jobPosts");
    const viewer = new PostViwer(JSON.parse(jobPosts));
    viewer.showPostDetails();
})