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
  const referencesPath = path.join(__dirname, "data/jsonFiles/references.json");
  const data = JSON.parse(await fs.readFile(referencesPath));
  res.json(Object.keys(data));
});

router.get("/search", async (req, res) => {
  const key = req.query.key.toLowerCase();

  const recipePath = path.join(__dirname, "data/jsonFiles/recipes.json");
  const data = JSON.parse(await fs.readFile(recipePath));

  const referencesPath = path.join(__dirname, "data/jsonFiles/references.json");
  const references = JSON.parse(await fs.readFile(referencesPath));

  for (const [product, recipes] of Object.entries(references)) {
    if (product.toLowerCase() == key) {
      const responseData = {};
      responseData[product] = recipes.map((recipe) => data[recipe]);
      res.json(responseData);
      return;
    }
  }
  res.status(400).json({ message: "You entered an invalid key!" });
});

router.use(express.static(path.join(__dirname, "../client")));
router.use(express.static(path.join(__dirname, "/data/jsonFiles")));
server.use(basePath, router);

server.listen(PORT, IP, () => {
  console.log("Listening to port", PORT);
});
