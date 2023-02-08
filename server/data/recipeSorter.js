import { fail } from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

let baseRecipes = {};
let alternateRecipes = {};

for (const [k, v] of Object.entries(data["recipes"])) {
  if (!(v["inMachine"] || v["inHand"] || v["inWorkshop"])) {
    let target;
    if (k.includes("Alternate")) {
      target = alternateRecipes;
    } else {
      target = baseRecipes;
    }

    for (const product of v["products"]) {
      const name = data["items"][product["item"]]["name"];
      if (!target[name]) {
        target[name] = [];
      }
      const ingredients = [];
      const products = [];
      const producedIn = [];

      for (const ingredient of v["ingredients"]) {
        ingredients.push({
          item: data["items"][ingredient["item"]]["name"],
          amount: ingredient["amount"],
        });
      }

      for (const product of v["products"]) {
        products.push({
          item: data["items"][product["item"]]["name"],
          amount: product["amount"],
        });
      }

      if (v["inMachine"]) {
        producedIn.push(data["buildings"][v["producedIn"]]["name"]);
      }
      if (v["inHand"]) {
        producedIn.push("Craft Bench");
      }
      if (v["inWorkshop"]) {
        producedIn.push("Equipment Workshop");
      }

      target[name].push({
        name: v["name"],
        time: v["time"],
        producedIn: producedIn,
        ingredients: ingredients,
        products: products,
      });
    }
  }
}

for (const item of ["Coal", "Water", "Biomass"]) {
  delete baseRecipes[item];
  delete alternateRecipes[item];
}

let baseRecipesData = JSON.stringify(baseRecipes, null, 2);
fs.writeFileSync("baseRecipes.json", baseRecipesData);

let alternateRecipesData = JSON.stringify(alternateRecipes, null, 2);
fs.writeFileSync("alternateRecipes.json", alternateRecipesData);
