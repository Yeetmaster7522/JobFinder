class ApplicantViewer {
    constructor(applicants) {
        console.log(applicants);
    }
}

window.addEventListener("mainReady", () => {
    const applicantViewer = new ApplicantViewer(window.main.applications);
});