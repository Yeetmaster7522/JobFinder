class ArticleFetcher {
    constructor(articles) {
        this.articles = articles;
        this.displayArticles();
    }

    appendArticle(parentID, article, id) {
        const parent = document.getElementById(parentID);
        
        let div = document.createElement("div");
        div.classList.add("col", "col-auto", "text-center", "mb-3", "ms-3", "me-3", "bg-teal");
        div.style.maxWidth = "12vw";

        let a = document.createElement("a");
        a.href = `article.html?id=${id}`;
        a.classList.add("navLink");

        let img = document.createElement("img");
        img.src = article.image;
        img.classList.add("mt-2", "mb-1");
        img.style.width = "10vw";
        img.style.height = "20vh";

        let p = document.createElement("p");
        p.classList.add("text-break", "text-start", "text-light");
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
            this.appendArticle("latest-advice", this.articles[i], i);
        }
        if (ids == null || ids.length == 0) {
            for (let i=0; i<this.articles.length; i++) {
                this.appendArticle("other-advice", this.articles[i], i);
            }
        }
        else {
            for (const id of ids) {
                this.appendArticle("other-advice", this.articles[id], id);
            }
        }
    }

    searchArticle(event) {
        const searchValue = event.target.value.toLowerCase();
        let articleIds = [];

        for (let i=0; i<this.articles.length; i++) {
            if (this.articles[i].title.toLowerCase().includes(searchValue)) {
                articleIds.push(i);
            }
        }

        this.displayArticles(articleIds);
    }
}

window.addEventListener("mainReady", () => {
    const af = new ArticleFetcher(window.main.articles);

    document.getElementById("search-bar").addEventListener("search", (e) => {
        af.searchArticle(e);
    });
});