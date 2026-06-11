class JobFetcher {
    #user
    #posts
    #editedPosts
    #currentPostId

    constructor(user, posts) {
        this.#user = user;
        this.#posts = posts;
        this.#editedPosts = posts;
        this.#currentPostId = this.getHistoricalId();
    }

    init() {
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
        this.displayPostAtI(this.#currentPostId);
    }

    getHistoricalId() {
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
        this.displayPostAtI(this.#currentPostId);
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
        this.#currentPostId = 0;

        for (const id of postIds) {
            this.#editedPosts.push(this.#posts[id]);
        }
    }

    displayPostAtI(id) {
        const post = this.#editedPosts[id];

        const postCounter = document.getElementById("postCounter");
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

        postCounter.innerText = `${id+1}/${this.#editedPosts.length} Posts`;

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
        const postOverview = document.getElementById("post-overview");
        const actionButtons = document.getElementById("action-buttons");
        const noneLeft = document.getElementById("none-left-header");

        let valid = true;

        if (this.#editedPosts.length == 0) {
            console.log("none found")
        }
        else if (forward == true && this.#currentPostId < this.#editedPosts.length-1) {
            this.#currentPostId += 1;
            if (this.#currentPostId == this.#editedPosts.length) {
                valid = false;

                postOverview.classList.toggle("d-none");
                actionButtons.classList.toggle("d-none");
                noneLeft.classList.toggle("d-none");
            }
        }
        else if (forward == false && this.#currentPostId > 0) {
            this.#currentPostId -= 1;
            
            if (this.#currentPostId == this.#editedPosts.length-1) {
                postOverview.classList.toggle("d-none");
                actionButtons.classList.toggle("d-none");
                noneLeft.classList.toggle("d-none");
            }
        }

        if (valid == true) {
            setCookie("postIndex", this.#currentPostId, 1);
            this.displayPostAtI(this.#currentPostId);
        }
    }

    storePostToCookie(cookie) {
        let jobs = JSON.parse(getCookie(cookie));
        jobs.push(this.#editedPosts[this.#currentPostId]);
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
                post.salaryMin >= this.#user.minSalary &&
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