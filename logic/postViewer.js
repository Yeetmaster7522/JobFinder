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
}

window.addEventListener("mainReady", () => {
    const viewer = new PostViwer(window.main.jobPosts);
})