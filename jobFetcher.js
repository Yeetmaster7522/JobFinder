class JobPostFetcher {
    constructor() {
        this.index = 0;
        // get job posts
        fetch("/data/data-mR36NBv3VwjMRsFCY26z5.json")
            .then(response => response.json())
            .then(data => {
                this.data = data
                console.log(this.data);

                this.displayPostAtI(this.index);
            })
            .catch(err => console.error("Error loading JSON:", err));
    }

    displayPostAtI(index) {
        const postCounter = document.getElementById("postCounter");
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

        postCounter.innerText = `${index+1}/${this.data.length} Job Posts`;

        jobTitle.innerText = post.jobTitle;
        companyName.innerText = post.companyName;
        address.innerText = post.address;
        workType.innerText = post.workType;
        employType.innerText = post.employmentType;
        salaryRange.innerText = `$${post.salaryMin} - $${post.salaryMax}`;
        ageRequire.innerText = post.ageRequirement;
        datePosted.innerText = post.datePosted;
        deadline.innerText = post.deadline;

        skills.innerText = "SKILLS";
        
        hours.innerText = "";
        for (let i=0; i<post.hours.length; i++) {
            hours.innerText += post.hours[i] + "\n";
        }

        for (let text of summary) {
            text.innerText = post.summary; // need to limit to first 20 words if id=shortsummary
        }
    }

    scrollPost(forward = true) {
        if (forward == true) {
            this.index += 1;
        }
        else if (forward == false) {
            this.index -= 1
        }

        this.displayPostAtI(this.index);
    }
}

// load class
const jobFetcher = new JobPostFetcher();

let upBtn = document.getElementById("scroll-up-btn");
let downBtn = document.getElementById("scroll-down-btn");
upBtn.addEventListener("click", () => jobFetcher.scrollPost(false));
downBtn.addEventListener("click", () => jobFetcher.scrollPost());