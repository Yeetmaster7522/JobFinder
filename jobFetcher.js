class JobPostFetcher {
    constructor() {
        this.index = 0;
        // get job posts
        fetch("/data/data-mR36NBv3VwjMRsFCY26z5.json")
            .then(response => response.json())
            .then(data => {
                this.data = data
                console.log(this.data);

                // update post counter
                let postCounter = document.getElementById("postCounter");
                postCounter.innerText = `1/${this.data.length} Job Posts`;

                this.displayPostAtI(this.index);
            })
            .catch(err => console.error("Error loading JSON:", err));
    }

    displayPostAtI(index) {
        const post = this.data[index];
        const jobTitle = document.getElementById("job-title");
        const companyName = document.getElementById("company-name");
        const address = document.getElementById("address");
        const workType = document.getElementById("work-type");
        const employType = document.getElementById("employ-type");
        const salaryRange = document.getElementById("salary-range");
        const ageRequire = document.getElementById("age-require");
        const hours = document.getElementById("hours");
        const skills = document.getElementById("skills");
        const datePosted = document.getElementById("date-posted");
        const deadline = document.getElementById("date-deadline");
        const summary = document.getElementsByClassName("summary-text");

        jobTitle.innerText = post.jobTitle;
        companyName.innerText = post.companyName;
        address.innerText = post.address;
        workType.innerText = post.workType;
        employType.innerText = post.employmentType;
        salaryRange.innerText = `$${post.salaryMin} - $${post.salaryMax}`;
        ageRequire.innerText = post.ageRequirement;
        hours.innerText = post.hours;
        skills.innerText = "COMING SOON";
        datePosted.innerText = post.datePosted;
        deadline.innerText = post.deadline;

        for (let text of summary) {
            text.innerText = post.summary;
        }
    }
}

// load class
const jobFetcher = new JobPostFetcher();