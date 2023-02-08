import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const server = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.get("/header", (req, res) => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data/newData.json"))
  );
  res.send(Object.keys(data[req.query.type]));
});

server.get("/advanced", (req, res) => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data/newData.json"))
  );
  res.send(data[req.query.type][req.query.key]);
});

server.use(express.static(path.join(__dirname, "../client")));
server.use(express.static(path.join(__dirname, "/data")));

server.listen(PORT, () => {
  console.log("Listening to port", PORT);
});
