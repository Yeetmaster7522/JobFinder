class JobPostFetcher {
    constructor(display=true) {
        let pastIndex = getCookie("postIndex");
        if (pastIndex == "") {
            this.index = 0;
        }
        else if (document.cookie != "") {
            this.index = parseInt(pastIndex, 10);
        }
        // get job posts
        fetch("/data/data-mR36NBv3VwjMRsFCY26z5.json")
            .then(response => response.json())
            .then(data => {
                this.data = data

                if (display == true) {
                    this.displayPostAtI(this.index);
                }
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
        const fullSummary = document.getElementById("full-summary");
        const shortSummary = document.getElementById("short-summary");

        postCounter.innerText = `${index+1}/${this.data.length} Posts`;

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
            hours.innerText += `${post.hours[i][0]} - ${post.hours[i][1]}\n`;
        }

        fullSummary.innerText = post.summary;

        let words = post.summary.split(" ");
        shortSummary.innerText = `${words.slice(0,20).join(" ")}...`;
    }

    scrollPost(forward = true) {
        const postOverview = document.getElementById("post-overview");
        const actionButtons = document.getElementById("action-buttons");
        const noneLeft = document.getElementById("none-left-header");

        let valid = true;

        if (forward == true && this.index < this.data.length) {
            this.index += 1;
            if (this.index == this.data.length) {
                valid = false;
                postOverview.classList.toggle("d-none");
                actionButtons.classList.toggle("d-none");
                noneLeft.classList.toggle("d-none");
            }
        }
        else if (forward == false && this.index > 0) {
            this.index -= 1
            if (this.index == 99) {
                postOverview.classList.toggle("d-none")
                actionButtons.classList.toggle("d-none");
                noneLeft.classList.toggle("d-none");
            }
        }

        if (valid == true) {
            setCookie("postIndex", this.index, 1);
            this.displayPostAtI(this.index);
        }
    }

    apply() {
        let appliedJobs = []
        try {
            appliedJobs = JSON.parse(getCookie("appliedJobs"));
        }
        catch (error) {
            console.log(error);
        }
        appliedJobs.push(this.data[this.index]);
        setCookie("appliedJobs", JSON.stringify(appliedJobs), 30);
        alert("Application sent");
    }

    save() {
        let savedJobs = [];
        try {
            savedJobs = JSON.parse(getCookie("savedJobs"));
        }
        catch (error) {
            console.log(error);
        }
        savedJobs.push(this.data[this.index]);
        setCookie("savedJobs", JSON.stringify(savedJobs), 30);
        alert("Job saved");
    }

    hide() {
        let hiddenJobs = [];
        try {
            hiddenJobs = JSON.parse(getCookie("hiddenJobs"));
        }
        catch (error) {
            console.log(error);
        }
        hiddenJobs.push(this.data[this.index]);
        setCookie("hiddenJobs", JSON.stringify(hiddenJobs), 30);
        alert("Job hidden");
    }
}

// load class
const jobFetcher = new JobPostFetcher();

let upBtn = document.getElementById("scroll-up-btn");
let downBtn = document.getElementById("scroll-down-btn");
upBtn.addEventListener("click", () => jobFetcher.scrollPost(false));
downBtn.addEventListener("click", () => jobFetcher.scrollPost());

// quick buttons
let applyBtn = document.getElementById("apply-btn");
let saveBtn = document.getElementById("save-btn");
let hideBtn = document.getElementById("hide-btn");
applyBtn.addEventListener("click", () => jobFetcher.apply());
saveBtn.addEventListener("click", () => jobFetcher.save());
hideBtn.addEventListener("click", () => jobFetcher.hide());