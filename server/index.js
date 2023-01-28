import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const server = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.get("/base", (req, res) => {
  console.log("Sending base recipes");
  const baseRecipePath = path.join(__dirname, "data/baseRecipes.json");
  const data = JSON.parse(fs.readFileSync(baseRecipePath));
  res.json(data);
});

server.get("/alternate", (req, res) => {
  console.log("Sending alternate recipes");
  const alternateRecipePath = path.join(__dirname, "data/alternateRecipes.json");
  const data = JSON.parse(fs.readFileSync(alternateRecipePath));
  res.json(data);
});

server.use(express.static(path.join(__dirname, "../client")));
server.use(express.static(path.join(__dirname, "/data")));

server.listen(PORT, () => {
  console.log("Listening to port", PORT);
});
