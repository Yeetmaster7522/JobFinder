class JobFetcher {
    #user
    #posts
    #editedPosts
    #currentPostIdx

    constructor(user, posts) {
        this.#user = user;
        this.#posts = posts;
        this.#editedPosts = posts;
        this.#currentPostIdx = this.getHistoricalIdx();
    }

    init() {
        document.getElementById("min-filter").value = this.#user.student.preferences.minSalary;

        document.getElementById("scroll-up-btn").addEventListener("click", () => this.scrollPost(false));
        window.addEventListener("keyup", (e) => {
            if (e.key == "," || e.key == "w") {
                this.scrollPost(false)
            }
        });
        document.getElementById("scroll-down-btn").addEventListener("click", () => this.scrollPost());
        window.addEventListener("keyup", (e) => {
            if (e.key == "." || e.key == "s") {
                this.scrollPost()
            }
        });

        // quick buttons
        document.getElementById("apply-btn").addEventListener("click", () => this.applyToPost());
        document.getElementById("save-btn").addEventListener("click", () => this.savePost());
        document.getElementById("hide-btn").addEventListener("click", () => this.hidePost());

        // combine search and dropdown stuff
        const searchBar = document.getElementById("search-bar");
        searchBar.addEventListener("search", (event) => {
            let postIds = this.filterSearch().filter(x => this.searchPosts(event.target.value).includes(x))
            this.updatePosts(postIds);
            this.displayPostAtI(0);
        });

        document.querySelectorAll(".dropdown-item:not(.submenu):not(#clear-filters)").forEach(item => {
            item.addEventListener("click", () => {
                item.classList.toggle("active");
                item.setAttribute("aria-pressed", item.classList.contains("active"));

                let idLists = [
                    this.filterSearch(),
                    this.searchPosts(searchBar.value),
                    this.preferenceSearch()
                ]
                let postIds = idLists.reduce(
                    (acc, list) => acc.filter(id => list.includes(id))
                );
                this.updatePosts(postIds);
                this.displayPostAtI(0);
            });
        });

        [
            document.getElementById("min-filter"),
            document.getElementById("max-filter"),
            document.getElementById("loc-rad-filter")
        ].forEach(input => {
            input.addEventListener("input", () => {
                let idLists = [
                    this.filterSearch(),
                    this.searchPosts(searchBar.value),
                    this.preferenceSearch()
                ]
                let postIds = idLists.reduce(
                    (acc, list) => acc.filter(id => list.includes(id))
                );
                this.updatePosts(postIds);
                this.displayPostAtI(0);
            });
        });

        document.getElementById("clear-filters").addEventListener("click", () => {
            document.querySelectorAll(".dropdown-item").forEach(item => {
                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");
                
                this.updatePosts(this.getAllPosts());
                this.displayPostAtI(0);
            });
        });

        document.getElementById("more-btn").addEventListener("click", (e) => {
            const innerText = e.target.innerText;
            if (innerText == "More Info") {
                e.target.innerText = "Less Info";
            }
            else {
                e.target.innerText = "More Info";
            }
        });

        this.enableSubmenuFilters(
            this.#user.student.preferences.workType, 
            this.#user.student.preferences.employmentType
        );

        let idLists = [
            this.filterSearch(),
            this.preferenceSearch()
        ];

        let postIds = idLists.reduce(
            (acc, list) => acc.filter(id => list.includes(id))
        );

        if (postIds.length == 0) {
            postIds = this.#posts.map((_, i) => i);
        }

        this.updatePosts(postIds);
        this.displayPostAtI(this.#currentPostIdx);
    }

    getHistoricalIdx() {
        let pastPostId = getCookie("postIndex") || "0";
        
        return parseInt(pastPostId, 10);
    }

    filterAll() {
        const idLists = [
            this.filterSearch(),
            this.preferenceSearch()
        ];
        const postIds = idLists.reduce(
            (acc, list) => acc.filter(id => list.includes(id))
        );

        this.updatePosts(postIds);
        this.displayPostAtI(this.#currentPostIdx);
    }

    getAllPosts() {
        return this.#posts;
    }

    searchPosts(searchTerm) {
        const search = searchTerm.toLowerCase();
        let postIds = [];

        if (search != "") {
            for (let i=0; i<this.#posts.length; i++) {
                let post = this.#posts[i];

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

        if (search == "") {
            postIds = this.#posts.map((_, i) => i);
        }

        return postIds;
    }

    updatePosts(postIds) {
        this.#editedPosts = [];
        this.#currentPostIdx = 0;

        for (const id of postIds) {
            this.#editedPosts.push(this.#posts[id]);
        }
    }

    displayPostAtI(idx) {
        const post = this.#editedPosts[idx];
        const postCounter = document.getElementById("postCounter");

        postCounter.innerText = `${idx+1}/${this.#editedPosts.length} Posts`;
        this.displayPost(post);
    }

    displayPost(post) {
        const jobTitle = document.getElementById("job-title");
        const companyName = document.getElementById("company-name");
        const address = document.getElementById("address");
        const workType = document.getElementById("work-type");
        const employType = document.getElementById("employ-type");
        const salaryRange = document.getElementById("salary-range");
        const ageRequire = document.getElementById("age-require");
        const hours = document.getElementById("hours");
        const skills = document.getElementById("skills");
        const deadline = document.getElementById("date-deadline");
        const fullSummary = document.getElementById("full-summary");
        const shortSummary = document.getElementById("short-summary");

        jobTitle.innerText = post.jobTitle;
        companyName.innerText = post.companyName;
        address.innerText = post.address;
        workType.innerText = post.workType;
        employType.innerText = post.employmentType;
        salaryRange.innerText = `$${post.salaryMin} - $${post.salaryMax} / hr`;
        ageRequire.innerText = `${post.ageRequirement} years old min`;
        deadline.innerText = `Deadline: ${post.deadline}`;

        skills.innerText = "";
        for (const skill of post.skills.slice(0,5)) {
            appendLI(skills, skill);
        }
        
        hours.innerText = "";
        for (const hour of post.hours) {
            appendLI(hours, `${hour[0]} - ${hour[1]}`);
        }

        fullSummary.innerText = post.summary;

        let words = post.summary.split(" ");
        shortSummary.innerText = `${words.slice(0,20).join(" ")}...`;
    }

    scrollPost(forward=true) {
        const actionButtons = document.getElementById("action-buttons");
        const noneLeft = document.getElementById("none-left-header");

        let valid = true;

        if (this.#editedPosts.length == 0) {
            console.log("none found")
        }
        else if (forward == true && this.#currentPostIdx < this.#editedPosts.length-1) {
            this.#currentPostIdx += 1;
            if (this.#currentPostIdx == this.#editedPosts.length) {
                valid = false;

                postOverview.classList.toggle("d-none");
                actionButtons.classList.toggle("d-none");
                noneLeft.classList.toggle("d-none");
            }
        }
        else if (forward == false && this.#currentPostIdx > 0) {
            this.#currentPostIdx -= 1;
            
            if (this.#currentPostIdx == this.#editedPosts.length-1) {
                postOverview.classList.toggle("d-none");
                actionButtons.classList.toggle("d-none");
                noneLeft.classList.toggle("d-none");
            }
        }

        if (valid == true) {
            setCookie("postIndex", this.#currentPostIdx, 1);
            this.displayPostAtI(this.#currentPostIdx);
        }
    }

    storePostToCookie(cookie) {
        let jobs = JSON.parse(getCookie(cookie));
        jobs.push(this.#editedPosts[this.#currentPostIdx]);
        setCookie(cookie, JSON.stringify(jobs), 30);
    }

    filterSearch() {
        let postIds = [];
        let filters = [];

        document.querySelectorAll(".active").forEach(selected => {
            filters.push(selected.value);
        });

        for (let i=0; i<this.#posts.length; i++) {
            let post = this.#posts[i];

            if (
                filters.includes(post.employmentType.toLowerCase()) || 
                filters.includes(post.workType.toLowerCase())
            ) {
                postIds.push(i);
            }
        }

        if (postIds.length == 0) {
            postIds = this.#posts.map((_, i) => i);
        }

        return postIds;
    }

    preferenceSearch() {
        let postIds = [];

        for (let i=0; i<this.#posts.length; i++) {
            const post = this.#posts[i];
            let fits = false;
            
            for (const studentInterval of this.#user.student.timeIntervals) {
                for (const postInterval of post.hours) {
                    let comparison = insideTimestamp(postInterval, studentInterval);
                    if (comparison == true) {
                        fits = true;
                    }
                }
            }
            if (
                post.salaryMin >= document.getElementById("min-filter").value &&
                post.salaryMax <= document.getElementById("max-filter").value &&
                fits == true &&
                this.#user.student.skills.some(skill => post.skills.includes(skill))
            ) {
                postIds.push(i);
            }
        }

        if (postIds.length == 0) {
            postIds = this.#posts.map((_, i) => i);
        }

        return postIds;
    }

    enableSubmenuFilters(workType, employmentType) {
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

    async applyToPost() {
        const post = this.#editedPosts[this.#currentPostIdx];
        const date = new Date();
        const user = await window.main.getUser();
        const newApplications = [...user.student.applications, post.ID];
        const newUser = setNestedValue(user, "student.applications", newApplications);

        setModal("Applied to job");

        ws.send(JSON.stringify( {
            "request": "applytopost",
            "application": {
                "UID": getCookie("UID"),
                "JPID": post.ID,
                "status": "submitted",
                "dateApplied": `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
            }
        } ));
        ws.send(JSON.stringify( {"request": "edituser", "uid": getCookie("UID"), "details": newUser} ));
    }

    savePost() {
        let savedJobs = [];
        
        try {
            savedJobs = JSON.parse(getCookie("savedJobs"));
        }
        catch (error) {
            console.log(error);
        }

        const job = this.#editedPosts[this.#currentPostIdx];
        const exists = savedJobs.some(j => j.ID === job.ID);

        if (!exists) {
            savedJobs.push(job);
            setCookie("savedJobs", JSON.stringify(savedJobs), 30);
            setModal("Job saved");
        }
        else {
            setModal("Job already saved");
        }
    }

    hidePost() {
        let hiddenJobs = [];
        
        try {
            hiddenJobs = JSON.parse(getCookie("hiddenJobs"));
        }
        catch (error) {
            console.log(error);
        }
        
        const job = this.#editedPosts[this.#currentPostIdx];
        const exists = hiddenJobs.some(j => j.ID === job.ID);

        if (!exists) {
            hiddenJobs.push(job);
            setCookie("hiddenJobs", JSON.stringify(hiddenJobs), 30);
            setModal("Job hidden");
        }
        else {
            setModal("Job already hidden");
        }
    }
}

class TrendFinder extends JobFetcher {
    constructor(user, posts) {
        super(user, posts);
        this.displayResults();
    }

    getTopNEntries(hashmap, n) {
        return [...hashmap.entries()]
            .sort((a,b) => b[1] - a[1])
            .slice(0,n)
            .map(entry => entry[0]);
    }

    getNearEmployers() {
        const posts = this.getAllPosts();
        let companies = new Set();

        for (const post of posts) {
            companies.add(post.companyName);
        }

        return Array.from(companies).slice(0,10);
    }

    getTrendingIndustries() {
        const posts = this.getAllPosts();
        let industries = new Map();

        for (const post of posts) {
            const ind = post.industry;
            if (industries.has(ind)) {
                industries.set(ind, industries.get(ind) + 1);
            }
            else {
                industries.set(ind, 1);
            }
        }

        return this.getTopNEntries(industries, 10);
    }

    getTrendRoles() {
        const posts = this.getAllPosts();
        let roles = new Map();

        for (const post of posts) {
            const role = post.jobTitle;
            if (roles.has(role)) {
                roles.set(role, roles.get(role) + 1);
            }
            else {
                roles.set(role, 1);
            }
        }

        return this.getTopNEntries(roles, 10);
    }

    getSkillsShortage() {
        const posts = this.getAllPosts()
        let skills = new Map();

        for (const post of posts) {
            for (const skill of post.skills) {
                if (skills.has(skill)) {
                    skills.set(skill, skills.get(skill) + 1);
                }
                else {
                    skills.set(skill, 1);
                }
            }
        }

        return this.getTopNEntries(skills, 10);
    }

    displayResults() {
        const employers = this.getNearEmployers();
        const industries = this.getTrendingIndustries();
        const roles = this.getTrendRoles();
        const skills = this.getSkillsShortage();

        const nearEmployers = document.getElementById("near-employers");
        for (const e of employers) {
            appendLI(nearEmployers, e);
        }

        const trendIndustries = document.getElementById("trend-industries");
        for (const i of industries) {
            appendLI(trendIndustries, i);
        }

        const trendRoles = document.getElementById("trend-roles");
        for (const r of roles) {
            appendLI(trendRoles, r);
        }

        const skillShortage = document.getElementById("skill-shortages");
        for (const s of skills) {
            appendLI(skillShortage, s);
        }
    }
}