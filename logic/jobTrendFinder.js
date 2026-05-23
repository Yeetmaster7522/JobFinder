class JobTrendFinder {
    constructor(data) {
        this.data = data;
        this.displayResults();
    }

    getNearEmployers() {
        let companies = new Set();
        for (let i=0; i<this.data.length; i++) {
            companies.add(this.data[i].companyName);
        }

        return Array.from(companies).slice(0,10);
    }

    getTrendingIndustries() {
        let industries = new Map()
        for (let i=0; i<this.data.length; i++) {
            let ind = this.data[i].industry;
            if (industries.has(ind)) {
                industries.set(ind, industries.get(ind) + 1);
            }
            else {
                industries.set(ind, 1);
            }
        }

        return [...industries.entries()]
            .sort((a,b) => b[1] - a[1])
            .slice(0,10)
            .map(entry => entry[0]);
    }

    getTrendRoles() {
        let roles = new Map();
        for (let i=0; i<this.data.length; i++) {
            let role = this.data[i].jobTitle;
            if (roles.has(role)) {
                roles.set(role, roles.get(role) + 1);
            }
            else {
                roles.set(role, 1);
            }
        }

        return [...roles.entries()]
            .sort((a,b) => b[1] - a[1])
            .slice(0,10)
            .map(entry => entry[0]);
    }

    getSkillsShortage() {
        let skills = new Map();

        for (let i=0; i<this.data.length; i++) {
            for (const s of this.data[i].skills) {
                if (skills.has(s)) {
                    skills.set(s, skills.get(s) + 1);
                }
                else {
                    skills.set(s, 1);
                }
            }
        }

        return [...skills.entries()]
            .sort((a,b) => b[1] - a[1])
            .slice(0,10)
            .map(entry => entry[0]);

    }

    displayResults() {
        const nearEmployers = document.getElementById("near-employers");
        const trendIndustries = document.getElementById("trend-industries");
        const trendRoles = document.getElementById("trend-roles");
        const skillShortage = document.getElementById("skill-shortages");

        const employers = this.getNearEmployers();
        const industries = this.getTrendingIndustries();
        const roles = this.getTrendRoles();
        const skills = this.getSkillsShortage();

        for (let i=0; i<employers.length; i++) {
            appendLI(nearEmployers, employers[i]);
        }
        for (let i=0; i<industries.length; i++) {
            appendLI(trendIndustries, industries[i]);
        }
        for (let i=0; i<roles.length; i++) {
            appendLI(trendRoles, roles[i]);
        }
        for (let i=0; i<skills.length; i++) {
            appendLI(skillShortage, skills[i]);
        }
    }
}

window.addEventListener("mainReady", () => {
    const trendFinder = new JobTrendFinder(window.main.jobPosts);
});