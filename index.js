// https://www.youtube.com/watch?v=ENrzD9HAZK4
// https://docs.cloud.google.com/sdk/docs/install-sdk#linux

const { readFile } = require("fs").promises;
const express = require("express");

const app = express();

app.use(express.static("public"));
app.use("/database", express.static("database"));
app.use("/webpages", express.static("webpages"))

app.get("/", async (req, res) => {
    res.send( await readFile("./webpages/shared/home.html", "utf-8") );
})

app.listen(process.env.PORT || 3000, () => console.log("App available on http://localhost:3000"));