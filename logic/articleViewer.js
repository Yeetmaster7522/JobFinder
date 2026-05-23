class ArticleViewer {
    constructor() {
        fetch("database/articles.json")
            .then(response => response.json())
            .then(data => {
                this.articles = data

                this.updateText()
            })
            .catch(err => console.error("Error loading JSON:", err));
    }

    updateText() {
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

const av = new ArticleViewer();