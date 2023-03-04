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
  const products = Object.keys(references.asProduct);
  for (const [ingredient, recipes] of Object.entries(references.asIngredient)) {
    if (!products.includes(ingredient)) {
      products.push(ingredient);
    }
  }
  products.sort();
  res.json(products);
});

router.get("/products/search", async (req, res) => {
  const input = req.query.input;

  const references = JSON.parse(await fs.readFile(referencesPath));
  const recipes = JSON.parse(await fs.readFile(recipePath));

  let response;

  for (const [productName, recipeNames] of Object.entries(
    references.asProduct
  )) {
    if (productName.toLowerCase() === input.toLowerCase()) {
      response = {
        productName,
        asProduct: recipeNames.map((recipeName) => {
          return recipes[recipeName];
        }),
      };
    }
  }

  for (const [productName, recipeNames] of Object.entries(
    references.asIngredient
  )) {
    if (productName.toLowerCase() === input.toLowerCase()) {
      if (!response) {
        response = {
          productName,
          asIngredient: [],
        };
      }

      response.asIngredient = recipeNames.map((recipeName) => {
        return recipes[recipeName];
      });
    }
  }

  if (response) {
    res.json(response);
    return;
  }

  res.status(400).json({ message: `${input} is not a valid product` });
});

router.use(express.static(path.join(__dirname, "../client")));
router.use(express.static(path.join(__dirname, "/data/jsonFiles")));
server.use(basePath, router);

server.listen(PORT, IP, () => {
  console.log("Listening to port", PORT);
});
