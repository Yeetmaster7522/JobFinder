class JobCreater {
    constructor() {
        this.submitBtn = document.getElementById("submit-btn");

        this.submitBtn.addEventListener("click", () => {
            console.log(this.submit());
        });
    }

    submit() {
        const user = window.main.getUser();
        
        const date = new Date();
        const msAfterEpoch = date.getTime() + (document.getElementById("recruitment-period-entry").value*24*60*60*1000);
        const newDate = new Date(msAfterEpoch);

        const skills = document.getElementById("skills-entry").value;
        
        let hours = document.getElementById("hours-entry").value;
        hours = hours.split("\n");
        hours = hours.map(x => x.split(" - "));

        return {
            "companyName": user.employer.companyName, 
            "datePosted": `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`,
            "deadline": `${newDate.getDate()}.${newDate.getMonth()+1}.${newDate.getFullYear()}`,
            "address": document.getElementById("address-entry").value, 
            "summary": document.getElementById("description-entry").value, 
            "jobTitle": document.getElementById("job-title-entry").value, 
            "workType": document.getElementById("work-type-entry").value, 
            "employmentType": document.getElementById("employment-type-entry").value, 
            "ageRequirement": document.getElementById("age-entry").value, 
            "salaryMin": document.getElementById("salary-min-entry").value, 
            "salaryMax": document.getElementById("salary-max-entry").value, 
            "source": 2, 
            "externalLink": user.employer.website, 
            "skills": skills.split("\n"),
            "industry": document.getElementById("industry-entry").value, 
            "hours": hours
        };
    }
}

window.addEventListener("mainReady", () => {
    const jobCreater = new JobCreater();
    const user = window.main.getUser();

    document.getElementById("use-address").addEventListener("click", () => {
        const addressEntry = document.getElementById("address-entry");
        addressEntry.value = user.employer.address;
    });
});