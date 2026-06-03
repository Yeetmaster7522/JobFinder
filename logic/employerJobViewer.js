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

    showPosts(posts) {
        for (const post of posts) {
            this.attachPost(post);
        }
    }

    attachPost(post) {
        const postId = `post-${post.ID}`;

        const li = document.createElement("li");
        li.classList.add("list-group-item");
        
        const container = document.createElement("div");
        container.classList.add("container-fluid");

        // front
        const front = document.createElement("div");
        front.setAttribute("data-bs-toggle", "collapse");
        front.setAttribute("data-bs-target", `#${postId}`);

        // row 1
        const f_row1 = document.createElement("div");
        f_row1.classList.add("row")

        const f_r1_col1 = document.createElement("div");
        f_r1_col1.classList.add("col");

        const title = document.createElement("p");
        title.textContent = post.jobTitle;

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
        deadline.textContent = `Deadline: ${post.deadline}`

        const f_r3_col2 = document.createElement("div");
        f_r3_col2.classList.add("col");

        const status = document.createElement("p");
        const date = new Date();
        const postDate = new Date(post.deadline);

        if (date.getTime() <= postDate.getTime()) {
            status.textContent = "OPEN";
        }
        else {
            status.textContent = "CLOSED";
        }

        // pop-up
        const back = document.createElement("div");
        back.classList.add("collapse");
        back.id = postId;

        // row 1
        const b_row1 = document.createElement("div");
        b_row1.classList.add("row");

        const b_r1_col1 = document.createElement("div");
        b_r1_col1.classList.add("col");

        const edit = document.createElement("a");
        edit.textContent = "Edit Post";
        edit.href = `/webpages/employer/editPost.html?id=${post.ID}`;

        // row 2
        const b_row2 = document.createElement("div");
        b_row2.classList.add("row");

        const b_r2_col1 = document.createElement("div");
        b_r2_col1.classList.add("col");
        
        const view = document.createElement("a");
        view.textContent = "View applicants";
        view.href = `/webpages/employer/applicantView.html?id=${post.ID}`;

        // put it all together
        f_r1_col1.appendChild(title);
        f_row1.appendChild(f_r1_col1);

        f_r2_col1.appendChild(applicants);
        f_row2.appendChild(f_r2_col1);

        f_r3_col1.appendChild(deadline);
        f_r3_col2.appendChild(status);
        f_row3.appendChild(f_r3_col1);
        f_row3.appendChild(f_r3_col2);

        front.appendChild(f_row1);
        front.appendChild(f_row2);
        front.appendChild(f_row3);

        b_r1_col1.appendChild(edit);
        b_row1.append(b_r1_col1);

        b_r2_col1.appendChild(view);
        b_row2.appendChild(b_r2_col1);

        back.appendChild(b_row1);
        back.appendChild(b_row2);

        container.appendChild(front);
        container.appendChild(back);
        li.appendChild(container);

        this.#listHTML.appendChild(li);
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