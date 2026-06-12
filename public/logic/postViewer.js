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
                ws.send(JSON.stringify( {"request": "editpost", "post": post} ));
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
            post.datePosted.trim() == "" ||
            post.deadline.trim() == "" ||
            post.address.trim() == "" ||
            post.summary.trim() == "" ||
            post.jobTitle.trim() == "" ||
            post.workType.trim() == "" ||
            post.employmentType.trim() == "" ||
            post.ageRequirement.trim() == "" ||
            post.salaryMin.trim() == "" ||
            post.salaryMax.trim() == "" ||
            post.skills.length == 0 ||
            post.industry.trim() == "" ||
            post.hours.length == 0
        ) {
            valid = false;
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