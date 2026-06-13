const WebSocket = require("ws");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
    console.log("connected to websocket server");
    promptForMessage();
});

ws.on("message", (message) => {
    console.log(`Server: ${message}`);
});

ws.on("error", (error) => {
    console.log(`Websocket error: ${error}`);
});

ws.on("close", () => {
    console.log("disconnected from server");
    process.exit(0);
});

function promptForMessage() {
    rl.question("enter a message (or exit to quit): ", (message) => {
        if (message.toLowerCase() === "exit") {
            ws.close();
            rl.close();
            return;
        }
        ws.send(message);
        promptForMessage();
    })
}