class ApplicantViewer {
    #users
    #applications
    #currentAppUid

    constructor(users, applications) {
        this.#users = users;
        this.#applications = [];
        this.#currentAppUid = -1;

        const id = getParam("id");

        for (const application of applications) {
            if (application.JPID == id) {
                this.#applications.push(application);
            }
        }
    }

    getCurrentAppUid() {
        return this.#currentAppUid
    }

    showAll() {
        this.showDetails(this.#applications[0].UID);
        for (const application of this.#applications) {
            this.createPreview(application);
        }
    }

    createPreview(application) {
        const uid = application.UID
        const user = this.#users[uid];

        const previews = document.getElementById("previews");
        const li = document.createElement("li");
        li.classList.add("list-group-item", "bg-secondary", "text-light");
        li.addEventListener("click", () => {
            this.showDetails(uid);
        })
        
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
        this.#currentAppUid = uid;
        this.updateApplication("in review");
        
        document.getElementById("name").textContent = user.student.name;
        document.getElementById("resume").href = user.student.resume.source;
        document.getElementById("education-level").value = user.student.experienceLevel;
        document.getElementById("email").value = user.email;
        document.getElementById("phone-contact").value = user.student.phoneNumber;

        document.getElementById("skills-list").value = user.student.skills.join("\n");  
        document.getElementById("certifications-list").value = user.student.certifications.join("\n");

        const availability = document.getElementById("availability-timestamp");
        availability.value = "";
        for (const timestamp of user.student.timeIntervals) {
            availability.value += `${timestamp.start} - ${timestamp.end}\n`;
        }
    }

    updateApplication(status) {
        ws.send(JSON.stringify({
            "request": "updateapplication",
            "uid": this.#currentAppUid,
            "status": status
        }));
    }
}

window.addEventListener("mainReady", async () => {
    const users = await wsRequest("userAccounts");
    const applications = await wsRequest("applications");
    const av = new ApplicantViewer(
        JSON.parse(users), 
        JSON.parse(applications)
    );
    av.showAll();

    document.getElementById("interested-btn").addEventListener("click", () => {
        av.updateApplication("offered");
    });

    document.getElementById("reject-btn").addEventListener("click", () => {
        av.updateApplication("rejected");
    });
});