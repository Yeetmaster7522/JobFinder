class JobEditor {
    #user
    #jobPosts
    #listHTML
    constructor(user, jobPosts, listHTML) {
        this.#user = user;
        this.#jobPosts = jobPosts;
        this.#listHTML = listHTML;
    }

    fetchPosts() {
        const userPosts = this.#user.employer.jobPosts;
        let posts = [];

        for (const post of this.#jobPosts) {
            if (userPosts.includes(post.ID)) {
                posts.push(post);
            }
        }

        return posts;
    }

    showPosts(posts, applications) {
        const sortedPosts = posts.sort((a, b) => b.deadline.localeCompare(a.deadline));
        for (const post of posts) {
            const postApplicants = applications.filter(app => app.JPID === post.ID);
            this.attachPost(post, postApplicants);
        }
    }

    attachPost(post, postApplicants) {
        let status;
        if (new Date() <= new Date(post.deadline)) {
            status = "OPEN";
        }
        else {
            status = "CLOSED";
        }
        const date = new Date(post.deadline)

        const li = document.createElement("li");
        li.classList.add("list-group-item", "bg-transparent", "text-light");
        li.id = `li-${post.ID}`
        
        li.innerHTML = `
            <div class="container-fluid text-center">
                <!-- front -->
                <div data-bs-toggle="collapse" data-bs-target="#collapse-${post.ID}">
                    <div class="row">
                        <div class="col">
                            <p class="fw-bold">${post.jobTitle}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p>${postApplicants.length} Applicants</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col d-flex justify-content-start align-items-end">
                            <span class="small fw-lighter badge bg-mediumblue">
                                Deadline: ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}
                            </span>
                        </div>
                        <div class="col d-flex justify-content-end align-items-end">
                            <span class="small fw-lighter badge bg-mediumblue">
                                ${status}
                            </span>
                        </div>
                    </div>
                </div>
                <!-- back -->
                <div class="collapse bg-mediumblue rounded-2 py-1 mt-2" id="collapse-${post.ID}">
                    <div class="row">
                        <div class="col">
                            <a class="text-light" href="/webpages/employer/editPost.html?id=${post.ID}">
                                Edit Post
                            </a>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <a class="text-light" href="/webpages/employer/applicantView.html?id=${post.ID}">
                                View Applicants
                            </a>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <a class="text-light" href="#" id=delete-${post.ID}>
                                Delete Post
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.#listHTML.appendChild(li);

        document.getElementById(`delete-${post.ID}`).addEventListener("click", () => {
            document.getElementById(`li-${post.ID}`).remove();
            ws.send(JSON.stringify( {"request": "deletepost", "uid":getCookie("UID"), "id": post.ID} ));
        });
    }

    delete() {

    }
}

window.addEventListener("mainReady", async () => {
    const user = await window.main.getUser();
    const jobPosts = await wsRequest("jobPosts");
    const applications = await wsRequest("applications");
    jobEditor = new JobEditor(
        user, 
        JSON.parse(jobPosts),
        document.getElementById("post-list")
    );
    jobEditor.showPosts(jobEditor.fetchPosts(), JSON.parse(applications));
});