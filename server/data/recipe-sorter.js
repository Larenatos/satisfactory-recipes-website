import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getDisplayName = (item) => {
  return data.items[item]?.name ?? data.buildings[item]?.name ?? false;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "data.json");
const data = JSON.parse(fs.readFileSync(dataPath));

const recipes = {};
const references = {
  asProduct: {},
  asIngredient: {},
};
const alternateRecipes = [];

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

  if (!producedIn.length) {
    producedIn.push("Build Gun");
  }

  const recipeName = recipe.name;
  const ingredients = [];
  for (const ingredient of recipe.ingredients) {
    const ingredientName = getDisplayName(ingredient.item);

    if (!references.asIngredient[ingredientName]) {
      references.asIngredient[ingredientName] = [];
    }
    if (!references.asIngredient[ingredientName].includes(recipeName)) {
      if (!recipe.alternate) {
        references.asIngredient[ingredientName].unshift(recipeName);
      } else {
        references.asIngredient[ingredientName].push(recipeName);
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
    if (!productName) {
      continue;
    }

    if (["Coal", "Water"].includes(productName)) {
      continue;
    }

    if (!references.asProduct[productName]) {
      references.asProduct[productName] = [];
    }
    if (!references.asProduct[productName].includes(recipeName)) {
      if (!recipe.alternate) {
        references.asProduct[productName].unshift(recipeName);
      } else {
        references.asProduct[productName].push(recipeName);
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
    alternateRecipes.push(newRecipe);
  }
}

const recipesString = JSON.stringify(recipes);
fs.writeFileSync("json-files/recipes.json", recipesString);

const referencesString = JSON.stringify(references);
fs.writeFileSync("json-files/references.json", referencesString);

let alternateRecipesString = JSON.stringify(alternateRecipes);
fs.writeFileSync("json-files/alternate-recipes.json", alternateRecipesString);
