import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const server = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(express.static(path.join(__dirname, "../client")));
server.use(express.static(path.join(__dirname, "/data")));

server.listen(PORT, () => {
  console.log("Listening to port", PORT);
});
