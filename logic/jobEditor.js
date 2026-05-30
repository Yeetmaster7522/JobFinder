class JobEditor {
    constructor(user, jobPosts, listHTML) {
        this.user = user;
        this.jobPosts = jobPosts;
        this.listHTML = listHTML;
    }

    fetchPosts() {
        const userPosts = this.user.employer.jobPosts;
        let posts = [];

        for (const post of this.jobPosts) {
            if (userPosts.includes(post.ID)) {
                posts.push(post);
            }
        }

        return posts;
    }

    showPosts(posts) {
        for (const post of posts) {
            this.attachPost(post);
        }
    }

    attachPost(post) {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        
        const container = document.createElement("div");
        container.classList.add("container-fluid");

        // front
        const front = document.createElement("div");
        front.setAttribute("data-bs-toggle", "collapse");
        front.setAttribute("data-bs-target", "#job1");

        // row 1
        const f_row1 = document.createElement("div");
        f_row1.classList.add("row")

        const f_r1_col1 = document.createElement("div");
        f_r1_col1.classList.add("col");

        const title = document.createElement("p");
        title.textContent = "Job Title";

        // row 2
        const f_row2 = document.createElement("div");
        f_row2.classList.add("row")

        const f_r2_col1 = document.createElement("div");
        f_r2_col1.classList.add("col");

        const applicants = document.createElement("p");
        applicants.textContent = "applicants";

        // row 3
        const f_row3 = document.createElement("div");
        f_row3.classList.add("row")

        const f_r3_col1 = document.createElement("div");
        f_r3_col1.classList.add("col");

        const deadline = document.createElement("p");
        deadline.textContent = "Job Title";

        const f_r3_col2 = document.createElement("div");
        f_r3_col2.classList.add("col");

        const status = document.createElement("p");
        status.textContent = "status";

        f_r1_col1.appendChild(title);
        f_row1.appendChild(f_r1_col1);

        f_r2_col1.appendChild(applicants);
        f_row2.appendChild(f_r2_col1);

        f_r3_col1.appendChild(deadline);
        f_r3_col2.appendChild(status);
        f_row3.appendChild(f_r3_col1);
        f_row3.appendChild(f_r3_col2);

        // pop-up
        const back = document.createElement("div");
        back.classList.add("collapse");
        back.id = "job1";

        const b_row1 = document.createElement("div");
        b_row1.classList.add("row");
        const b_r1_col1 = document.createElement("div");
        b_r1_col1.classList.add("col");

        front.appendChild(f_row1);
        front.appendChild(f_row2);
        front.appendChild(f_row3);
        container.appendChild(front);
        li.appendChild(container);

        this.listHTML.appendChild(li);
    }
}

window.addEventListener("mainReady", () => {
    jobEditor = new JobEditor(
        window.main.getUser(), 
        window.main.jobPosts,
        document.getElementById("post-list")
    );
    jobEditor.showPosts(jobEditor.fetchPosts());
});