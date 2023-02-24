import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getDisplayName = (item) => {
  return data.items[item]?.name ?? data.buildings[item]?.name ?? item;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "data.json");
const data = JSON.parse(fs.readFileSync(dataPath));

const recipes = {};
const references = {};

for (const [, recipe] of Object.entries(data.recipes)) {
  const producedIn = [];

  if (recipe.inMachine) {
    producedIn.push(data.buildings[recipe.producedIn].name);
  }
  if (recipe.inHand) {
    producedIn.push("Craft Bench");
  }
  if (recipe.inWorkshop) {
    producedIn.push("Equipment Workshop");
  }

  const recipeName = recipe.name;

  const ingredients = recipe.ingredients.map((ingredient) => {
    return {
      item: getDisplayName(ingredient.item),
      amount: ingredient.amount,
    };
  });

  const products = [];

  for (const product of recipe.products) {
    const productName = getDisplayName(product.item);

    if (["Coal", "Water"].includes(productName)) {
      continue;
    }

    if (!references[productName]) {
      references[productName] = [];
    }
    if (!references[productName].includes(recipeName)) {
      if (!recipeName.includes("Alternate")) {
        references[productName] = [recipeName, ...references[productName]];
      } else {
        references[productName].push(recipeName);
      }
    }

    products.push({
      item: productName,
      amount: product.amount,
    });
  }

  recipes[recipeName] = {
    time: recipe.time,
    producedIn,
    ingredients,
    products,
  };
}

const recipesString = JSON.stringify(recipes);
fs.writeFileSync("jsonFiles/recipes.json", recipesString);

const referencesString = JSON.stringify(references);
fs.writeFileSync("jsonFiles/references.json", referencesString);
