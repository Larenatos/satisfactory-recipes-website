import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getDisplayName = (item) => {
  return data.items[item]?.name ?? data.buildings[item]?.name;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "data.json");
const data = JSON.parse(fs.readFileSync(dataPath));

const recipes = {};
const references = {};
const recipesFromHardDrives = [];
const items = [];

for (const [, recipe] of Object.entries(data.recipes)) {
  const producedIn = [];

  if (recipe.inMachine) {
    producedIn.push(getDisplayName(recipe.producedIn));
  }
  if (recipe.inHand) {
    producedIn.push("Craft Bench");
  }
  if (recipe.inWorkshop) {
    producedIn.push("Equipment Workshop");
  }

  if (!producedIn.length) {
    producedIn.push("Build Gun");
  }

  const recipeName = recipe.name;
  const ingredients = [];
  for (const ingredient of recipe.ingredients) {
    const ingredientName = getDisplayName(ingredient.item);

    if (!items.includes(ingredientName)) {
      items.push(ingredientName);
    }

    if (!references[ingredientName]) {
      references[ingredientName] = {
        usedIn: [],
      };
    } else if (!references[ingredientName].usedIn) {
      references[ingredientName].usedIn = [];
    }

    if (!references[ingredientName].usedIn.includes(recipeName)) {
      if (!recipe.alternate) {
        references[ingredientName].usedIn.unshift(recipeName);
      } else {
        references[ingredientName].usedIn.push(recipeName);
      }
    }

    ingredients.push({
      item: ingredientName,
      amount: ingredient.amount,
    });
  }

  const products = [];

  for (const product of recipe.products) {
    const productName = getDisplayName(product.item);

    if (!productName || ["Coal", "Water"].includes(productName)) {
      continue;
    }

    if (!items.includes(productName)) {
      items.push(productName);
    }

    if (!references[productName]) {
      references[productName] = {
        recipes: [],
      };
    } else if (!references[productName].recipes) {
      references[productName].recipes = [];
    }

    if (!references[productName].recipes.includes(recipeName)) {
      if (!recipe.alternate) {
        references[productName].recipes.unshift(recipeName);
      } else {
        references[productName].recipes.push(recipeName);
      }
    }

    products.push({
      item: productName,
      amount: product.amount,
    });
  }

  const newRecipe = {
    name: recipeName,
    time: recipe.time,
    producedIn,
    ingredients,
    products,
  };

  recipes[recipeName] = newRecipe;

  if (recipe.alternate) {
    recipesFromHardDrives.push(newRecipe);
  }
}

const recipeStore = {
  recipes,
  references,
};

const recipeStoreString = JSON.stringify(recipeStore);
fs.writeFileSync("json-files/recipe-store.json", recipeStoreString);

let hardDriveRecipesString = JSON.stringify(recipesFromHardDrives);
fs.writeFileSync("json-files/hard-drive-recipes.json", hardDriveRecipesString);

items.sort();
let itemsString = JSON.stringify(items);
fs.writeFileSync("json-files/items.json", itemsString);
