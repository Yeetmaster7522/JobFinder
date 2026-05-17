class JobTrendFinder {
    constructor() {
        // get job posts
        fetch("data/data-mR36NBv3VwjMRsFCY26z5.json")
            .then(response => response.json())
            .then(data => {
                this.data = data;
                this.displayResults();
            })
            .catch(err => console.error("Error loading JSON:", err));
    }

    getNearEmployers() {
        let companies = new Set();
        for (let i=0; i<this.data.length; i++) {
            companies.add(this.data[i].companyName);
        }

        return Array.from(companies).slice(0,10);
    }

    // getTrendingIndustries() {
    //     let industries = new Set()
    //     for (let i=0; i<this.data.length; i++) {

    //     }
    // }

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

    displayResults() {
        const nearEmployers = document.getElementById("near-employers");
        const trendRoles = document.getElementById("trend-roles");

        const employers = this.getNearEmployers();
        const roles = this.getTrendRoles();

        for (let i=0; i<employers.length; i++) {
            let li = document.createElement("li");
            li.textContent = employers[i];
            nearEmployers.appendChild(li);
        }
        for (let i=0; i<roles.length; i++) {
            let li = document.createElement("li");
            li.textContent = roles[i];
            trendRoles.appendChild(li);
        }
    }
}

const trendFinder = new JobTrendFinder();