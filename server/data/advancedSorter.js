import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getDisplayName = (item) => {
  return data.items[item].name;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

const filteredData = {
  inMachineRecipes: {},
  inHandRecipes: {},
  inWorkshopRecipes: {},
};

// recipes
for (const [, recipe] of Object.entries(data.recipes)) {
  const recipeTypes = [];
  const producedIn = [];

  if (recipe.inMachine) {
    recipeTypes.push("inMachineRecipes");
    producedIn.push(data.buildings[recipe.producedIn].name);
  }
  if (recipe.inHand) {
    recipeTypes.push("inHandRecipes");
    producedIn.push("Craft Bench");
  }
  if (recipe.inWorkshop) {
    recipeTypes.push("inWorkshopRecipes");
    producedIn.push("Equipment Workshop");
  }

  if (!recipeTypes.length) {
    continue;
  }

  for (const product of recipe.products) {
    const productName = getDisplayName(product.item);

    if (["Coal", "Water"].includes(productName)) {
      continue;
    }

    const ingredients = [];
    const products = [];

    for (const ingredient of recipe.ingredients) {
      ingredients.push({
        item: getDisplayName(ingredient.item),
        amount: ingredient.amount,
      });
    }

    for (const productProduct of recipe.products) {
      const itemName = getDisplayName(productProduct.item);
      products.push({
        item: itemName,
        amount: productProduct.amount,
      });
    }

    for (const recipeType of recipeTypes) {
      if (!filteredData[recipeType][productName]) {
        filteredData[recipeType][productName] = [];
      }

      filteredData[recipeType][productName].push({
        name: recipe.name,
        time: recipe.time,
        alternate: recipe.alternate,
        producedIn,
        ingredients,
        products,
      });
    }
  }
}

let finalData = JSON.stringify(filteredData);
fs.writeFileSync("jsonFiles/filteredData.json", finalData);
