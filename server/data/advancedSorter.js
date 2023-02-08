import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

const newData = {};

newData["inMachineRecipes"] = {};
newData["inHandRecipes"] = {};
newData["inWorkshopRecipes"] = {};
newData["items"] = {};

const machineRecipesFor = [];
const handRecipesFor = [];
const workshopRecipesFor = [];

for (const [k, v] of Object.entries(data["recipes"])) {
  let targets = [];

  if (v["inMachine"]) {
    targets.push("inMachineRecipes");
  }
  if (v["inHand"]) {
    targets.push("inHandRecipes");
  }
  if (v["inWorkshop"]) {
    targets.push("inWorkshopRecipes");
  }

  if (!targets) {
    break;
  }

  for (const product of v["products"]) {
    for (const target of targets) {
      let name = data["items"][product["item"]]["name"];
      name = name.toLowerCase();
      if (!target[name]) {
        newData[target][name] = [];
      }
      const producedIn = [];
      const ingredients = [];
      const products = [];

      if (v["inMachine"]) {
        producedIn.push(data["buildings"][v["producedIn"]]["name"]);
      }
      if (v["inHand"]) {
        producedIn.push("Craft Bench");
      }
      if (v["inWorkshop"]) {
        producedIn.push("Equipment Workshop");
      }

      for (const ingredient of v["ingredients"]) {
        ingredients.push({
          item: data["items"][ingredient["item"]]["name"],
          amount: ingredient["amount"],
        });
      }

      for (const product of v["products"]) {
        const itemName = data["items"][product["item"]]["name"];
        products.push({
          item: itemName,
          amount: product["amount"],
        });

        switch (target) {
          case "inMachineRecipes":
            if (!machineRecipesFor.includes(itemName)) {
              machineRecipesFor.push(itemName);
            }
            break;
          case "inHandRecipes":
            if (!handRecipesFor.includes(itemName)) {
              handRecipesFor.push(itemName);
            }
            break;
          case "inWorkshopRecipes":
            if (!workshopRecipesFor.includes(itemName)) {
              workshopRecipesFor.push(itemName);
            }
            break;
        }
      }

      newData[target][name].push({
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
  delete newData["inMachineRecipes"][item];
  delete newData["inHandRecipes"][item];
  delete newData["inWorkshopRecipes"][item];
}

for (const [k, v] of Object.entries(data["items"])) {
  const name = v["name"].toLowerCase();
  newData["items"][name] = {
    name: v["name"],
    sinkPoints: v["sinkPoints"],
    description: v["description"],
    stackSize: v["stackSize"],
    liquid: v["liquid"],
    recipeIn: [],
  };

  if (machineRecipesFor.includes(v["name"])) {
    newData["items"][name]["recipeIn"].push("inMachineRecipes");
  }
  if (handRecipesFor.includes(v["name"])) {
    newData["items"][name]["recipeIn"].push("inHandRecipes");
  }
  if (workshopRecipesFor.includes(v["name"])) {
    newData["items"][name]["recipeIn"].push("inWorkshopRecipes");
  }
}

let finalData = JSON.stringify(newData, null, 2);
fs.writeFileSync("newData.json", finalData);
