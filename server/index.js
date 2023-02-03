import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const server = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.get("/header", (req, res) => {
  switch (req.query.type) {
    case "recipe":
      const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/newData.json"))
      );
      console.log("Sending recipe keys");
      res.send(Object.keys(data.recipes));
  }
});

server.use(express.static(path.join(__dirname, "../client")));
server.use(express.static(path.join(__dirname, "/data")));

server.listen(PORT, () => {
  console.log("Listening to port", PORT);
});
