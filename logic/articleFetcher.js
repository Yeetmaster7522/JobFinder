class ArticleFetcher {
    constructor() {
        fetch("data/articles.json")
            .then(response => response.json())
            .then(data => {
                this.articles = data

                this.displayArticles();
            })
            .catch(err => console.error("Error loading JSON:", err));
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

    displayArticles() {
        for (let i=0; i<3; i++) {
            this.appendArticle("latest-advice", this.articles[i], i);
        }
        for (let i=0; i<this.articles.length; i++) {
            this.appendArticle("other-advice", this.articles[i], i);
        }
    }
}

const af = new ArticleFetcher();