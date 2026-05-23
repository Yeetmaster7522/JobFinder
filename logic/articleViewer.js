class ArticleViewer {
    constructor(articles) {
        this.articles = articles;

        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        const title = document.getElementById("title");
        const thumbnail = document.getElementById("thumbnail");
        const content = document.getElementById("content");

        const article = this.articles[parseInt(id, 10)];
        title.innerText = article.title;
        thumbnail.src = article.image;
        content.innerText = article.content;
    }
}

window.addEventListener("mainReady", () => {
    const av = new ArticleViewer(window.main.articles);
})