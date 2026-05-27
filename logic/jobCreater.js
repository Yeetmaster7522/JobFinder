class JobCreater {
    constructor() {
        this.submitBtn = document.getElementById("submit-btn");

        this.submitBtn.addEventListener("click", () => {
            this.submit();
        });
    }

    submit() {
        alert("submitted");
    }
}

window.addEventListener("mainReady", () => {
    const jobCreater = new JobCreater();
});