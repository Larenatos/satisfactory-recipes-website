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

const referencesPath = path.join(__dirname, "data/json-files/references.json");
const recipesPath = path.join(__dirname, "data/json-files/recipes.json");

router.get("/comparison-item-search", async (req, res) => {
  const { input } = req.query;

  const references = JSON.parse(await fs.readFile(referencesPath));
  const recipes = JSON.parse(await fs.readFile(recipesPath));

  let searchResult;

  for (const [itemName, recipeNames] of Object.entries(references)) {
    if (itemName.toLowerCase() === input.toLowerCase()) {
      searchResult = {
        itemName,
      };

      if (recipeNames.recipes) {
        searchResult.recipes = recipeNames.recipes.map((recipeName) => {
          return recipes[recipeName];
        });
      }

      if (recipeNames.usedIn) {
        searchResult.usedIn = recipeNames.usedIn.map((recipeName) => {
          return recipes[recipeName];
        });
      }
    }
  }

  if (searchResult) {
    res.json(searchResult);
  } else {
    res.status(400).json({ message: `${input} is not a valid product` });
  }
});

router.get("/exact-item-search", async (req, res) => {
  const { input } = req.query;

  const recipes = JSON.parse(await fs.readFile(recipesPath));

  let searchResult = {
    itemName,
    recipes: recipes[input].recipes,
    usedIn: recipes[input].usedIn,
  };

  res.json(searchResult);
});

router.use(express.static(path.join(__dirname, "../client")));
router.use(express.static(path.join(__dirname, "/data/json-files")));
server.use(basePath, router);

server.listen(PORT, IP, () => {
  console.log("Listening to port", PORT);
});
