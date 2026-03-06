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

                this.updatePostAtI(this.index);
            })
            .catch(err => console.error("Error loading JSON:", err));
    }

    updatePostAtI(index) {
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
        const summary = document.getElementsByClassName("summary-text");
        const datePosted = document.getElementById("date-posted");
        const deadline = document.getElementById("date-deadline");

        jobTitle.innerText = post.jobTitle;
        companyName.innerText = post.companyName;
        address.innerText = post.address;
        workType.innerText = post.workType;
        employType.innerText = post.employmentType;
        salaryRange.innerText = `$${post.salaryMin} - $${post.salaryMax}`;
        ageRequire.innerText = post.ageRequirement;
        hours.innerText = post.
    }
}

// load class
const jobFetcher = new JobPostFetcher();