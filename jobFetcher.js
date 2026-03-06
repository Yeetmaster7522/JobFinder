class JobPostFetcher {
    constructor() {
        fetch("/data/data-mR36NBv3VwjMRsFCY26z5.json")
            .then(response => response.json())
            .then(data => {
                this.data = data
                console.log(this.data);
            })
            .catch(err => console.error("Error loading JSON:", err));
        
        let postCounter = document.getElementById("postCounter");
        postCounter.innerText = `1/${this.data.length} Job Posts`;
    }
}

// load class
const jobFetcher = new JobPostFetcher();