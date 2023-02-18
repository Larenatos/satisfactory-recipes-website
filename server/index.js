import express from "express";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

const PORT = process.env.PORT ?? 3000;
const IP = process.env.IP;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = "/satisfactory-recipes";

const server = express();
const router = express.Router();

router.get("/products", async (req, res) => {
  const data = JSON.parse(
    await fs.readFile(path.join(__dirname, "data/newData.json"))
  );
  res.json(Object.keys(data[req.query.type]));
});

router.get("/search", async (req, res) => {
  const key = req.query.key.toLowerCase();
  const type = req.query.type;

  const data = JSON.parse(
    await fs.readFile(path.join(__dirname, "data/newData.json"))
  );

  if (key == "all") {
    res.json(data[type]);
  } else {
    for (const product of Object.keys(data[type])) {
      if (product.toLowerCase() == key) {
        res.json(data[type][product]);
        return;
      }
    }
    res.status(400).json({ message: "You entered an invalid key!" });
  }
});

router.use(express.static(path.join(__dirname, "../client")));
router.use(express.static(path.join(__dirname, "/data")));
server.use(basePath, router);

server.listen(PORT, IP, () => {
  console.log("Listening to port", PORT);
});
