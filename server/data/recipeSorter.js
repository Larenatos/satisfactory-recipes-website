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
    const productName = getDisplayName(product);

    if (["Coal", "Water", "Biomass"].includes(productName)) {
      continue;
    }
    if (!target[productName]) {
      target[productName] = [];
    }

    const ingredients = recipe.ingredients.map((ingredient) => {
      return {
        item: getDisplayName(ingredient),
        amount: ingredient.amount,
      };
    });

    const products = recipe.products.map((productProduct) => {
      return {
        item: getDisplayName(productProduct),
        amount: productProduct.amount,
      };
    });

    const producedIn = [];
    if (recipe.inMachine) {
      producedIn.push(buildings[recipe.producedIn].name);
    }
    if (recipe.inHand) {
      producedIn.push("Craft Bench");
    }
    if (recipe.inWorkshop) {
      producedIn.push("Equipment Workshop");
    }

    target[productName].push({
      name: recipe.name,
      time: recipe.time,
      producedIn,
      ingredients,
      products,
    });
  }
}

let baseRecipesString = JSON.stringify(baseRecipes);
fs.writeFileSync("jsonFiles/baseRecipes.json", baseRecipesString);

let alternateRecipesString = JSON.stringify(alternateRecipes);
fs.writeFileSync("jsonFiles/alternateRecipes.json", alternateRecipesString);
