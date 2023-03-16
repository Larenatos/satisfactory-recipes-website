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

const recipeStorePath = path.join(
  __dirname,
  "data/json-files/recipe-store.json"
);

router.get("/item/search", async (req, res) => {
  const { input } = req.query;

  const { recipes, references } = JSON.parse(
    await fs.readFile(recipeStorePath)
  );

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

      return res.json(searchResult);
    }
  }

  res.status(400).json({ message: `${input} is not a valid product` });
});

router.get("/item/:itemName", async (req, res) => {
  const { itemName } = req.params;

  const { recipes, references } = JSON.parse(
    await fs.readFile(recipeStorePath)
  );

  let searchResult = {
    itemName,
  };

  if (references[itemName].recipes) {
    searchResult.recipes = references[itemName].recipes.map((recipeName) => {
      return recipes[recipeName];
    });
  }

  if (references[itemName].usedIn) {
    searchResult.usedIn = references[itemName].usedIn.map((recipeName) => {
      return recipes[recipeName];
    });
  }

  res.json(searchResult);
});

router.use(express.static(path.join(__dirname, "../client")));
router.use(express.static(path.join(__dirname, "/data/json-files")));
server.use(basePath, router);

server.listen(PORT, IP, () => {
  console.log("Listening to port", PORT);
});
