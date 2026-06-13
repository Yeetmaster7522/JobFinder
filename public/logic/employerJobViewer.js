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
        for (const post of posts) {
            const postApplicants = applications.filter(app => app.JPID === post.ID);
            this.attachPost(post, postApplicants);
        }
    }

    attachPost(post, postApplicants) {
        const postId = `post-${post.ID}`;
        let status;
        if (new Date() <= new Date(post.deadline)) {
            status = "OPEN";
        }
        else {
            status = "CLOSED";
        }

        const li = document.createElement("li");
        li.classList.add("list-group-item", "bg-transparent", "text-light");
        
        li.innerHTML = `
            <div class="container-fluid text-center">
                <!-- front -->
                <div data-bs-toggle="collapse" data-bs-target="#${postId}">
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
                            <span class="small fw-lighter badge text-bg-primary">
                                Deadline: ${post.deadline}
                            </span>
                        </div>
                        <div class="col d-flex justify-content-end align-items-end">
                            <span class="small fw-lighter badge text-bg-primary">
                                ${status}
                            </span>
                        </div>
                    </div>
                </div>
                <!-- back -->
                <div class="collapse bg-dark rounded-2 py-1 mt-2" id="${postId}">
                    <div class="row">
                        <div class="col">
                            <a class="text-decoration-none text-primary"
                            href="/webpages/employer/editPost.html?id=${post.ID}">
                            Edit Post
                            </a>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <a class="text-decoration-none text-primary"
                            href="/webpages/employer/applicantView.html?id=${post.ID}">
                            View applicants
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.#listHTML.appendChild(li);
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