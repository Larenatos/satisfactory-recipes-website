import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const server = express();
const port = process.env.PORT ?? 3000;
const ip = process.env.IP;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = "/satisfactory-recipes";
const router = express.Router();

router.get("/header", (req, res) => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data/newData.json"))
  );
  res.send(Object.keys(data[req.query.type]));
});

router.get("/advanced", (req, res) => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data/newData.json"))
  );
  res.send(data[req.query.type][req.query.key]);
});

router.use(express.static(path.join(__dirname, "../client")));
router.use(express.static(path.join(__dirname, "/data")));
server.use(basePath, router);

server.listen(port, ip, () => {
  console.log("Listening to port", port);
});
