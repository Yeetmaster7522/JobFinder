class ApplicantViewer {
    constructor(users, applications) {
        this.users = users;
        this.applications = [];

        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        for (const application of applications) {
            if (application.JPID == id) {
                this.applications.push(application);
            }
        }
    }

    showAll() {
        this.createPreview(this.applications[0]);
        this.showDetails(this.applications[0].UID);
        for (let i=1; i<this.applications.length; i++) {
            this.createPreview(this.applications[i]);
        }
    }

    createPreview(application) {
        const uid = application.UID
        const user = window.main.users[uid];

        const previews = document.getElementById("previews");
        const li = document.createElement("li");
        li.classList.add("list-group-item");

        li.addEventListener("click", () => {
            this.showDetails(uid);
        })
        
        const row1 = document.createElement("div");
        row1.classList.add("row");
        const col1 = document.createElement("div");
        col1.classList.add("col");
        const name = document.createElement("p");
        name.textContent = user.student.name;

        const row2 = document.createElement("div");
        row2.classList.add("row");
        const col2 = document.createElement("div");
        col2.classList.add("col");
        const email = document.createElement("p");
        email.textContent = user.email;

        const row3 = document.createElement("div");
        row3.classList.add("row");
        const col3 = document.createElement("div");
        col3.classList.add("col");
        const number = document.createElement("p");
        number.textContent = user.student.phoneNumber;

        const row4 = document.createElement("div");
        row4.classList.add("row");
        const col4_1 = document.createElement("div");
        col4_1.classList.add("col");
        const applied = document.createElement("p");
        applied.textContent = "Applied:";
        const col4_2 = document.createElement("div");
        col4_2.classList.add("col");
        const date = document.createElement("p");
        date.textContent = application.dateApplied;

        col1.appendChild(name);
        row1.appendChild(col1);

        col2.appendChild(email);
        row2.appendChild(col2);

        col3.appendChild(number);
        row3.appendChild(col3);

        col4_1.appendChild(applied);
        col4_2.appendChild(date);
        row4.appendChild(col4_1);
        row4.appendChild(col4_2);

        li.appendChild(row1);
        li.appendChild(row2);
        li.appendChild(row3);
        li.appendChild(row4);
        
        previews.append(li);
    }

    showDetails(uid) {
        const user = window.main.users[uid];
        
        document.getElementById("name").textContent = user.student.name;
        document.getElementById("resume").textContent = user.student.resume.source;
        document.getElementById("education-level").textContent = user.student.experienceLevel;
        document.getElementById("email").textContent = user.email;
        document.getElementById("phone-contact").textContent = user.student.phoneNumber;

        const skillsList = document.getElementById("skills-list");
        skillsList.innerHTML = "";
        for (const skill of user.student.skills) {
            appendLI(skillsList, skill);
        }

        const certsList = document.getElementById("certifications-list");
        certsList.innerHTML = "";
        for (const cert of user.student.certifications) {
            appendLI(certsList, cert);
        }

        const availability = document.getElementById("availability-timestamp");
        availability.innerHTML = "";
        for (const timestamp of user.student.timeIntervals) {
            appendLI(availability, `${timestamp.start} - ${timestamp.end}`);
        }
    }
}

window.addEventListener("mainReady", () => {
    const applicantViewer = new ApplicantViewer(window.main.users, window.main.applications);
    applicantViewer.showAll();
});