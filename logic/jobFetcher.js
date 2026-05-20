class JobPostFetcher {
    constructor() {
        let pastPostId = getCookie("postIndex");
        
        if (pastPostId == "") {
            this.currentPostId = 0;
        }
        else if (document.cookie != "") {
            this.currentPostId = parseInt(pastPostId, 10);
        }

        // get job posts
        fetch("data/data-mR36NBv3VwjMRsFCY26z5.json")
            .then(response => response.json())
            .then(data => {
                this.data = data
                this.posts = this.data

                this.displayPostAtI(this.currentPostId);
            })
            .catch(err => console.error("Error loading JSON:", err));
    }

    search(event) {
        const search = event.target.value.toLowerCase();
        let postIds = [];
        
        if (search != "") {
            for (let i=0; i<this.data.length; i++) {
                let post = this.data[i];

                if (post.companyName.toLowerCase().includes(search)) {
                    postIds.push(i);
                }
                else if (post.industry.toLowerCase().includes(search)) {
                    postIds.push(i);
                }
                else if (post.jobTitle.toLowerCase().includes(search)) {
                    postIds.push(i);
                }
                else if (post.skills.map(str => str.toLowerCase()).includes(search)) {
                    postIds.push(i);
                }
            }
        }
        if (search == "" || postIds.length == 0) {
            postIds = this.data.map((_, i) => i);
        }

        return postIds;
    }

    updatePosts(postIds) {
        this.posts = [];
        this.currentPostId = 0;

        for (const id in postIds) {
            this.posts.push(this.data[id]);
        }

        this.displayPostAtI(this.currentPostId);
    }

    displayPostAtI(ID) {
        const postCounter = document.getElementById("postCounter");
        const post = this.posts[ID];
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

        postCounter.innerText = `${ID+1}/${this.posts.length} Posts`;

        jobTitle.innerText = post.jobTitle;
        companyName.innerText = post.companyName;
        address.innerText = post.address;
        workType.innerText = post.workType;
        employType.innerText = post.employmentType;
        salaryRange.innerText = `$${post.salaryMin} - $${post.salaryMax}`;
        ageRequire.innerText = post.ageRequirement;
        datePosted.innerText = post.datePosted;
        deadline.innerText = post.deadline;

        skills.innerText = "";
        for (const skill of post.skills) {
            appendLI(skills, skill)
        }
        
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

        if (forward == true && this.currentPostId < this.posts.length) {
            this.currentPostId += 1;
            if (this.currentPostId == this.posts.length) {
                valid = false;
                postOverview.classList.toggle("d-none");
                actionButtons.classList.toggle("d-none");
                noneLeft.classList.toggle("d-none");
            }
        }
        else if (forward == false && this.currentPostId > 0) {
            this.currentPostId -= 1
            if (this.currentPostId == 99) {
                postOverview.classList.toggle("d-none")
                actionButtons.classList.toggle("d-none");
                noneLeft.classList.toggle("d-none");
            }
        }

        if (valid == true) {
            setCookie("postIndex", this.currentPostId, 1);
            this.displayPostAtI(this.currentPostId);
        }
    }

    applyToPost() {
        let appliedJobs = []
        try {
            appliedJobs = JSON.parse(getCookie("appliedJobs"));
        }
        catch (error) {
            console.log(error);
        }
        appliedJobs.push(this.posts[this.currentPostId]);
        setCookie("appliedJobs", JSON.stringify(appliedJobs), 30);
        alert("Application sent");
    }

    savePost() {
        let savedJobs = [];
        try {
            savedJobs = JSON.parse(getCookie("savedJobs"));
        }
        catch (error) {
            console.log(error);
        }
        savedJobs.push(this.posts[this.currentPostId]);
        setCookie("savedJobs", JSON.stringify(savedJobs), 30);
        alert("Job saved");
    }

    hidePost() {
        let hiddenJobs = [];
        try {
            hiddenJobs = JSON.parse(getCookie("hiddenJobs"));
        }
        catch (error) {
            console.log(error);
        }
        hiddenJobs.push(this.posts[this.currentPostId]);
        setCookie("hiddenJobs", JSON.stringify(hiddenJobs), 30);
        alert("Job hidden");
    }
}

// load class
const jobFetcher = new JobPostFetcher();

document.getElementById("scroll-up-btn").addEventListener("click", () => jobFetcher.scrollPost(false));
document.getElementById("scroll-down-btn").addEventListener("click", () => jobFetcher.scrollPost());

// quick buttons
document.getElementById("apply-btn").addEventListener("click", () => jobFetcher.applyToPost());
document.getElementById("save-btn").addEventListener("click", () => jobFetcher.savePost());
document.getElementById("hide-btn").addEventListener("click", () => jobFetcher.hidePost());

document.getElementById("search-bar").addEventListener("search", (event) => {
    jobFetcher.updatePosts(jobFetcher.search(event));
});

document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", (event) => {
        const selectedVal = event.target.value;
        console.log(selectedVal);
    });
});