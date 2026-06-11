class ApplicantViewer {
    #users
    #applications

    constructor(users, applications) {
        this.#users = users;
        this.#applications = [];

        const id = getParam("id");

        for (const application of applications) {
            if (application.JPID == id) {
                this.#applications.push(application);
            }
        }
    }

    showAll() {
        this.createPreview(this.#applications[0]);
        this.showDetails(this.#applications[0].UID);
        for (let i=1; i<this.#applications.length; i++) {
            this.createPreview(this.#applications[i]);
        }
    }

    createPreview(application) {
        const uid = application.UID
        const user = this.#users[uid];

        const previews = document.getElementById("previews");
        const li = document.createElement("li");
        li.classList.add("list-group-item", "bg-secondary", "text-light")
        
        li.innerHTML = `
            <div class="row g-1">
                <div class="col-12">
                    <p class="fs-5 mb-1">${user.student.name} <span class="badge text-bg-info float-end" style="font-size: 0.7rem">Applied: ${application.dateApplied}</span></p>
                    <hr class="border border-white border-1 opacity-50 rounded-1 mt-0">
                </div>
                <div class="col-12">
                    <p>${user.email}</p>
                </div>
                <div class="col-12">
                    <p>${user.student.phoneNumber}</p>
                </div>
            </div>
        `;

        previews.append(li);
    }

    showDetails(uid) {
        const user = this.#users[uid];
        
        document.getElementById("name").textContent = user.student.name;
        document.getElementById("resume").href = user.student.resume.source;
        document.getElementById("education-level").value = user.student.experienceLevel;
        document.getElementById("email").value = user.email;
        document.getElementById("phone-contact").value = user.student.phoneNumber;

        document.getElementById("skills-list").value = user.student.skills.join("\n");  
        document.getElementById("certifications-list").value = user.student.certifications.join("\n");

        const availability = document.getElementById("availability-timestamp");
        for (const timestamp of user.student.timeIntervals) {
            availability.value += `${timestamp.start} - ${timestamp.end}\n`;
        }
    }
}

window.addEventListener("mainReady", async () => {
    const users = await wsRequest("userAccounts");
    const applications = await wsRequest("applications");
    const applicantViewer = new ApplicantViewer(
        JSON.parse(users), 
        JSON.parse(applications)
    );
    applicantViewer.showAll();
});