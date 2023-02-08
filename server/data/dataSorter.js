import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

const newData = {};
let tempValues = [];

for (const [key, value] of Object.entries(data)) {
  tempValues.push(value);
}

newData["inMachineRecipes"] = {};
newData["inHandRecipes"] = {};
newData["inWorkshopRecipes"] = {};
newData["items"] = {};

const machineRecipesFor = [];
const handRecipesFor = [];
const workshopRecipesFor = [];

for (const [k, v] of Object.entries(tempValues[0])) {
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

  const name = v["name"].toLowerCase();
  for (const target of targets) {
    newData[target][name] = {
      name: v["name"],
      time: v["time"],
      producedIn: [],
      ingredients: [],
      products: [],
    };

    if (v["inMachine"]) {
      newData[target][name]["producedIn"].push(
        tempValues[6][v["producedIn"]]["name"]
      );
    }
    if (v["inHand"]) {
      newData[target][name]["producedIn"].push("Craft Bench");
    }
    if (v["inWorkshop"]) {
      newData[target][name]["producedIn"].push("Equipment Workshop");
    }

    for (const ingredient of v["ingredients"]) {
      newData[target][name]["ingredients"].push({
        item: tempValues[1][ingredient["item"]]["name"],
        amount: ingredient["amount"],
      });
    }

    for (const product of v["products"]) {
      const itemName = tempValues[1][product["item"]]["name"];
      newData[target][name]["products"].push({
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
  }
}

for (const [k, v] of Object.entries(tempValues[1])) {
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
