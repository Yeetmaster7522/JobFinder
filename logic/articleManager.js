class ArticleManager {
    #articles

    constructor(articles) {
        this.#articles = articles;
    }

    appendArticle(parentID, article, id) {
        const parent = document.getElementById(parentID);
        
        let div = document.createElement("div");
        div.classList.add("col", "col-auto", "text-center", "bg-teal", "rounded-3", "shadow-strong");
        div.style.maxWidth = "12vw";

        let a = document.createElement("a");
        a.href = `article.html?id=${id}`;
        a.classList.add("navLink");

        let img = document.createElement("img");
        img.src = article.image;
        img.classList.add("mt-2", "mb-1", "rounded-2", "border", "border-2", "border-warning-subtle");
        img.style.width = "10vw";
        img.style.height = "20vh";

        let p = document.createElement("p");
        p.classList.add("text-break", "text-light");
        p.innerText = article.title;

        a.appendChild(img);
        a.appendChild(p);

        div.appendChild(a);
        
        parent.appendChild(div);
    }

    resetDisplay() {
        document.getElementById("latest-advice").innerText = "";
        document.getElementById("other-advice").innerText = "";
    }

    displayArticles(ids=null) {
        this.resetDisplay();

        for (let i=0; i<3; i++) {
            this.appendArticle("latest-advice", this.#articles[i], i);
        }
        if (ids == null || ids.length == 0) {
            for (let i=0; i<this.#articles.length; i++) {
                this.appendArticle("other-advice", this.#articles[i], i);
            }
        }
        else {
            for (const id of ids) {
                this.appendArticle("other-advice", this.#articles[id], id);
            }
        }
    }

    searchArticle(event) {
        const searchValue = event.target.value.toLowerCase();
        let articleIds = [];

        for (let i=0; i<this.#articles.length; i++) {
            if (this.#articles[i].title.toLowerCase().includes(searchValue)) {
                articleIds.push(i);
            }
        }

        this.displayArticles(articleIds);
    }

    showArticle() {
        const id = parseInt(getParam("id"), 10);

        const content = document.getElementById("content");

        const article = this.#articles[id];
        document.getElementById("title").innerText = article.title;
        document.getElementById("thumbnail").src = article.img;
        document.getElementById("content").innerText = article.content;
    }
}