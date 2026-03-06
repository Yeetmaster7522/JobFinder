class JobPostFetcher {
    constructor() {
        let response = "";
        fetch("/data/data-mR36NBv3VwjMRsFCY26z5.json")
            .then(response = response.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => console.error("Error loading JSON:", err));
    }
}