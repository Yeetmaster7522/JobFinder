class JobPostFetcher {
    #user
    #ogPosts
    #posts

    constructor(user, posts) {
        this.#user = user;
        this.#ogPosts = posts;
        this.#posts = posts;

        const pastPostId = getCookie("postIndex");
        
        if (pastPostId == "") {
            this.currentPostId = 0;
        }
        else if (document.cookie != "") {
            this.currentPostId = parseInt(pastPostId, 10);
        }

        this.setEnabledWorkEmploymentType(this.#user.student.preferences.workType, this.#user.student.preferences.employmentType);

        let idLists = [
            this.filterSearch(),
            this.preferenceSearch()
        ];
        let postIds = idLists.reduce(
            (acc, list) => acc.filter(id => list.includes(id))
        );

        this.updatePosts(postIds);
        this.displayPostAtI(this.currentPostId);
    }

    getOgPosts() {
        return this.#ogPosts;
    }

    searchPosts(searchTerm) {
        const search = searchTerm.toLowerCase();
        let postIds = [];
        
        if (search != "") {
            for (let i=0; i<this.#ogPosts.length; i++) {
                let post = this.#ogPosts[i];

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
            postIds = this.#ogPosts.map((_, i) => i);
        }

        return postIds;
    }

    updatePosts(postIds) {
        this.#posts = [];
        this.currentPostId = 0;

        for (const id in postIds) {
            this.#posts.push(this.#ogPosts[id]);
        }

        this.displayPostAtI(this.currentPostId);
    }

    displayPostAtI(ID) {
        const postCounter = document.getElementById("postCounter");
        const post = this.#posts[ID];
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

        postCounter.innerText = `${ID+1}/${this.#posts.length} Posts`;

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

        if (forward == true && this.currentPostId < this.#posts.length) {
            this.currentPostId += 1;
            if (this.currentPostId == this.#posts.length) {
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
        appliedJobs.push(this.#posts[this.currentPostId]);
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
        savedJobs.push(this.#posts[this.currentPostId]);
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
        hiddenJobs.push(this.#posts[this.currentPostId]);
        setCookie("hiddenJobs", JSON.stringify(hiddenJobs), 30);
        alert("Job hidden");
    }

    filterSearch() {
        let postIds = [];
        let filters = [];

        document.querySelectorAll(".active").forEach(item => {
            filters.push(item.value);
        });

        for (let i=0; i<this.#ogPosts.length; i++) {
            let post = this.#ogPosts[i];
            if (filters.includes(post.employmentType.toLowerCase()) && filters.includes(post.workType.toLowerCase())) {
                postIds.push(i);
            }
        };

        if (postIds.length == 0) {
            postIds = this.#ogPosts.map((_, i) => i);
        }

        return postIds;
    }

    preferenceSearch() {
        let postIds = [];

        for (let i=0; i<this.#ogPosts.length; i++) {
            let valid = true;
            let post = this.#ogPosts[i];
            
            if (post.salaryMin < this.#user.minSalary) {
                valid = false;
            }

            let fits = false;
            for (const studentInterval of this.#user.student.timeIntervals) {
                for (const postInterval of post.hours) {
                    let comparison = insideTimestamp(postInterval, studentInterval);
                    if (comparison == true) {
                        fits = true;
                    }
                }

            }
            if (fits == false) {
                valid = false;
            }

            if (!this.#user.student.skills.some(skill => post.skills.includes(skill))) {
                valid = false;
            }

            if (valid == true) {
                postIds.push(i);
            }
        }

        if (postIds.length == 0) {
            postIds = this.#ogPosts.map((_, i) => i);
        }

        return postIds;
    }

    setEnabledWorkEmploymentType(workType, employmentType) {        
        // work type
        if (workType == "onsite") {
            enableBtn(document.getElementById("onsite-btn"));

        }
        else if (workType == "hybrid") {
            enableBtn(document.getElementById("hybrid-btn"));
        }
        else if (workType == "remote") {
            enableBtn(document.getElementById("remote-btn"));
        }

        // employment type
        if (employmentType == "part-time") {
            enableBtn(document.getElementById("part-time-btn"));
        }
        else if (employmentType == "casual") {
            enableBtn(document.getElementById("casual-btn"));
        }
        else if (employmentType == "full-time") {
            enableBtn(document.getElementById("full-time-btn"));
        }
    }
}

window.addEventListener("mainReady", () => {
    const jf = new JobPostFetcher(window.main.getUser(), window.main.jobPosts);

    document.getElementById("scroll-up-btn").addEventListener("click", () => jf.scrollPost(false));
    document.getElementById("scroll-down-btn").addEventListener("click", () => jf.scrollPost());

    // quick buttons
    document.getElementById("apply-btn").addEventListener("click", () => jf.applyToPost());
    document.getElementById("save-btn").addEventListener("click", () => jf.savePost());
    document.getElementById("hide-btn").addEventListener("click", () => jf.hidePost());

    // combine search and dropdown stuff
    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("search", (event) => {
        let postIds = jf.filterSearch().filter(x => jf.searchPosts(event.target.value).includes(x))
        jf.updatePosts(postIds);
    });

    document.querySelectorAll(".dropdown-item:not(.submenu):not(#clear-filters)").forEach(item => {
        item.addEventListener("click", () => {
            let idLists = [
                jf.filterSearch(),
                jf.searchPosts(searchBar.value),
                jf.preferenceSearch()
            ]
            let postIds = idLists.reduce(
                (acc, list) => acc.filter(id => list.includes(id))
            );
            jf.updatePosts(postIds);
        });
    });

    document.getElementById("clear-filters").addEventListener("click", () => {
        document.querySelectorAll(".dropdown-item").forEach(item => {
            item.classList.remove("active");
            item.setAttribute("aria-pressed", "false");
            
            jf.updatePosts(jf.getOgPosts());
        });
    });
});
