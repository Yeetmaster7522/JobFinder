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
        for (const application of this.#applications) {
            this.createPreview(application);
        }

        this.showDetails(this.#applications[0].UID);
    }

    createPreview(application) {
        const uid = application.UID
        const user = this.#users[uid];

        const previews = document.getElementById("previews");
        const li = document.createElement("li");
        li.id = uid;
        li.classList.add("list-group-item", "bg-deepblue", "text-light");
        li.addEventListener("click", () => {
            this.showDetails(uid);
        })
        
        li.innerHTML = `
            <div class="row g-1">
                <div class="col-10">
                    <p class="fs-5 mb-1">${user.student.name}</p>
                </div>
                <div class="col-2">
                    <span class="badge float-end" style="font-size: 0.7rem" id="${uid}-badge">
                        Applied: ${application.dateApplied}, ${application.status}
                    </span>
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

        if (application.status == "offered") {
            document.getElementById(`${uid}-badge`).classList.add("text-bg-success");
        }
        else if (application.status == "rejected") {
            document.getElementById(`${uid}-badge`).classList.add("text-bg-danger");
        }
        else {
            document.getElementById(`${uid}-badge`).classList.add("text-bg-info");
        }
    }

    showDetails(uid) {
        const user = this.#users[uid];
        this.#currentAppUid = uid;
        this.updateApplication("in review");
        
        const previews = document.getElementById("previews");
        const li = document.getElementById(uid);
        previews.prepend(li);

        document.getElementById("preview").style.display = "block";
        
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
        setModal("Shortlisted successfully");
    });

    document.getElementById("reject-btn").addEventListener("click", () => {
        av.updateApplication("rejected");
        setModal("Rejected successfully");
    });
});