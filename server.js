// https://www.w3schools.com/nodejs/nodejs_websockets.asp
// node --watch server.js
// node --watch client.js

const WebSocket = require("ws");
const fs = require("fs");
const { writeFile } = require("fs/promises");
const { json } = require("stream/consumers");
const PORT = 8080

class DataFetcher {
    #encoding

    constructor() {
        this.#encoding = "utf-8";
    }

    readData(file) {
        let fileData;
        try {
            fileData = fs.readFileSync(`public/database/${file}`, this.#encoding);
        }
        catch (err) {
            console.log(err);
        }

        return fileData;
    }

    async writeToFile(file, content) {
        try {
            const jsonStr = JSON.stringify(content, null, 2);
            await writeFile(`public/database/${file}`, jsonStr, this.#encoding);
            console.log("JSON file successfully edited!")
        }
        catch (err) {
            console.log(err);
        }
    }
}

const df = new DataFetcher();
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        let newUsers;
        let newJobPosts;
        let newApplications;
        let index;

        msg = msg.toString();
        console.log(`Received req: ${msg}`);
        msg = JSON.parse(msg);

        switch (msg.request) {
            case "applications":
                ws.send(JSON.stringify({"id": msg.id, "data": df.readData("applications.json")}));
                break;
            case "articles":
                ws.send(JSON.stringify({"id": msg.id, "data": df.readData("articles.json")}));
                break;
            case "jobPosts":
                ws.send(JSON.stringify({"id": msg.id, "data": df.readData("jobPosts.json")}));
                break;
            case "userAccounts":
                ws.send(JSON.stringify({"id": msg.id, "data": df.readData("userAccounts.json")}));
                break;
            case "createuser":
                newUsers = JSON.parse(df.readData("userAccounts.json"));
                newUsers[msg.uid] = {
                    "email": msg.email,
                    "password": msg.password,
                    "role": msg.role,
                    "profilePic": "",
                    "student": {
                    "name": "NAME",
                    "age": "AGE",
                    "phoneNumber": "PHONE NUMBER",
                    "suburb": "SUBURB",
                    "workEligibility": "WORK ELIGIBILITY",
                    "experienceLevel": "EXPERIENCE LEVEL",
                    "resume": {},
                    "preferences": {
                        "workType": "WORK TYPE",
                        "employmentType": "EMPLOYMENT TYPE",
                        "minSalary": "10",
                        "locationRadius": "10",
                        "industries": []
                    },
                    "skills": [],
                    "certifications": [],
                    "timeIntervals": [],
                    "applications": []
                    },
                    "employer": {
                    "companyName": "",
                    "address": "",
                    "contactNumber": "",
                    "contactEmail": "",
                    "website": "",
                    "jobPosts": []
                    }
                }
                df.writeToFile("userAccounts.json", newUsers);
                break;
            case "edituser":
                newUsers = JSON.parse(df.readData("userAccounts.json"));
                newUsers[msg.uid] = msg.details;
                df.writeToFile('userAccounts.json', newUsers);
                break;
            case "createpost":
                newJobPosts = JSON.parse(df.readData("jobPosts.json"));
                newJobPosts.push(msg.post);
                df.writeToFile("jobPosts.json", newJobPosts);
                break;
            case "editpost":
                newJobPosts = JSON.parse(df.readData("jobPosts.json"));
                index = newJobPosts.findIndex(post => post.ID === msg.post.ID);
                if (index != -1) {
                    newJobPosts[index] = msg.post;
                }
                df.writeToFile("jobPosts.json", newJobPosts);
                break;
            case "applytopost":
                newApplications = JSON.parse(df.readData("applications.json"));
                newApplications.push(msg.application);
                df.writeToFile("applications.json", newApplications);
                break;
            case "updateapplication":
                newApplications = JSON.parse(df.readData("applications.json"));
                index = newApplications.findIndex(application => application.UID == msg.uid);
                if (index != -1) {
                    newApplications[index].status = msg.status;
                }
                df.writeToFile("applications.json", newApplications);
                break;
            default:
                console.log("Unkown msg request:", msg.request);
        }
    });
});