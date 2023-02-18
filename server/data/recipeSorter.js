import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getDisplayName = (source) => {
  return items[source.item].name;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { recipes, items, buildings } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data.json"))
);

const baseRecipes = {};
const alternateRecipes = {};

for (const [, recipe] of Object.entries(recipes)) {
  if (!(recipe.inMachine || recipe.inHand || recipe.inWorkshop)) {
    continue;
  }

  const target = recipe.alternate ? alternateRecipes : baseRecipes;

  for (const product of recipe.products) {
    const name = getDisplayName(product);

    if (["Coal", "Water", "Biomass"].includes(name)) {
      continue;
    }
    if (!target[name]) {
      target[name] = [];
    }

    const ingredients = [];
    const products = [];
    const producedIn = [];

    for (const ingredient of recipe.ingredients) {
      ingredients.push({
        item: getDisplayName(ingredient),
        amount: ingredient.amount,
      });
    }

    for (const product of recipe.products) {
      products.push({
        item: getDisplayName(product),
        amount: product.amount,
      });
    }

    if (recipe.inMachine) {
      producedIn.push(buildings[recipe.producedIn].name);
    }
    if (recipe.inHand) {
      producedIn.push("Craft Bench");
    }
    if (recipe.inWorkshop) {
      producedIn.push("Equipment Workshop");
    }

    target[name].push({
      name: recipe.name,
      time: recipe.time,
      alternate: recipe.alternate,
      producedIn,
      ingredients,
      products,
    });
  }
}

// TODO: remove indentation to reduce file size
let baseRecipesString = JSON.stringify(baseRecipes);
fs.writeFileSync("jsonFiles/baseRecipes.json", baseRecipesString);

let alternateRecipesString = JSON.stringify(alternateRecipes);
fs.writeFileSync("jsonFiles/alternateRecipes.json", alternateRecipesString);
