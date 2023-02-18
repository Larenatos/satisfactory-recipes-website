import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getDisplayName = (item) => {
  if (data.items[item]) {
    return data.items[item].name;
  } else {
    if (!item.includes("Desc_")) {
      item = `Desc_${item}`;
    }
    if (data.buildings[item]) {
      return data.buildings[item].name;
    }
    return item;
  }
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

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

  const name = recipe.name;

  const ingredients = recipe.ingredients.map((ingredient) => {
    return {
      item: getDisplayName(ingredient.item),
      amount: ingredient.amount,
    };
  });

  const products = recipe.products.map((product) => {
    const itemName = getDisplayName(product.item);

    if (!references[itemName]) {
      references[itemName] = [];
    }
    if (!references[itemName].includes(name)) {
      references[itemName].push(name);
    }

    return {
      item: itemName,
      amount: product.amount,
    };
  });

  recipes[name] = {
    name,
    time: recipe.time,
    alternate: recipe.alternate,
    producedIn,
    ingredients,
    products,
  };
}

const recipesString = JSON.stringify(recipes);
fs.writeFileSync("jsonFiles/recipes.json", recipesString);

const referencesString = JSON.stringify(references);
fs.writeFileSync("jsonFiles/references.json", referencesString);
