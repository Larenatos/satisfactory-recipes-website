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

const referencesPath = path.join(__dirname, "data/jsonFiles/references.json");
const recipePath = path.join(__dirname, "data/jsonFiles/recipes.json");

router.get("/products", async (req, res) => {
  const references = JSON.parse(await fs.readFile(referencesPath));
  res.json(Object.keys(references));
});

router.get("/products/search", async (req, res) => {
  const input = req.query.input.toLowerCase();

  const references = JSON.parse(await fs.readFile(referencesPath));

  for (const [productName, recipeNames] of Object.entries(references)) {
    if (productName.toLowerCase() === input) {
      const recipes = JSON.parse(await fs.readFile(recipePath));
      const response = {
        [productName]: recipeNames.map((recipeName) => {
          return {
            name: recipeName,
            ...recipes[recipeName],
          };
        }),
      };
      res.json(response);
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
