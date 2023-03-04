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
const references = {
  asProduct: {},
  asIngredient: {},
};
const baseRecipes = [];
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

  let target;
  if (producedIn.length) {
    target = recipe.alternate ? alternateRecipes : baseRecipes;
  } else {
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
      if (!recipeName.includes("Alternate")) {
        references.asIngredient[ingredientName] = [
          recipeName,
          ...references.asIngredient[ingredientName],
        ];
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

    if (["Coal", "Water"].includes(productName)) {
      continue;
    }

    if (!references.asProduct[productName]) {
      references.asProduct[productName] = [];
    }
    if (!references.asProduct[productName].includes(recipeName)) {
      if (!recipeName.includes("Alternate")) {
        references.asProduct[productName] = [
          recipeName,
          ...references.asProduct[productName],
        ];
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

  if (target) {
    target.push(newRecipe);
  }
}

const recipesString = JSON.stringify(recipes);
fs.writeFileSync("jsonFiles/recipes.json", recipesString);

const referencesString = JSON.stringify(references);
fs.writeFileSync("jsonFiles/references.json", referencesString);

let baseRecipesString = JSON.stringify(baseRecipes);
fs.writeFileSync("jsonFiles/baseRecipes.json", baseRecipesString);

let alternateRecipesString = JSON.stringify(alternateRecipes);
fs.writeFileSync("jsonFiles/alternateRecipes.json", alternateRecipesString);
