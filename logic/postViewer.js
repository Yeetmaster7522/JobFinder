class PostViwer {
    constructor(posts) {
        const params = new URLSearchParams(window.location.search);

        this.post = this.findPostByID(
            params.get("id"),
            posts
        );
    }

    findPostByID(id, posts) {
        let foundPost;

        for (const post of posts) {
            if (post.ID == id) {
                foundPost = post;
            }
        }

        return foundPost;
    }

    showPostDetails() {
        document.getElementById("job-title-entry").value = this.post.jobTitle;
        document.getElementById("work-type-entry").value = this.post.workType;
        document.getElementById("employment-type-entry").value = this.post.employmentType;
        document.getElementById("industry-entry").value = this.post.industry;
        document.getElementById("hours-entry").value = "";
        document.getElementById("skills-entry").value = "";
        document.getElementById("description-entry").value = this.post.summary;
        document.getElementById("salary-min-entry").value = this.post.salaryMin;
        document.getElementById("salary-max-entry").value = this.post.salaryMax;
        document.getElementById("address-entry").value = this.post.address;
    }
}

window.addEventListener("mainReady", () => {
    const viewer = new PostViwer(window.main.jobPosts);
    viewer.showPostDetails();
})