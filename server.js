// https://www.w3schools.com/nodejs/nodejs_websockets.asp
// node --watch server.js
// node --watch client.js

const WebSocket = require("ws");
const fs = require("fs");
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
}

const df = new DataFetcher();
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

const applications = df.readData("applications.json");
const articles = df.readData("articles.json");
const jobPosts = df.readData("jobPosts.json");
const userAccounts = df.readData("userAccounts.json");


wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        msg = msg.toString();
        console.log(`Received req: ${msg}`);
        msg = JSON.parse(msg);

        switch (msg.request) {
            case "applications":
                ws.send(JSON.stringify({"id": msg.id, "data": applications}));
                break;
            case "articles":
                ws.send(JSON.stringify({"id": msg.id, "data": articles}));
                break;
            case "jobPosts":
                ws.send(JSON.stringify({"id": msg.id, "data": jobPosts}));
                break;
            case "userAccounts":
                ws.send(JSON.stringify({"id": msg.id, "data": userAccounts}));
                break;
            default:
                console.log("Unkown msg type:", msg.type);
        }
    });
});