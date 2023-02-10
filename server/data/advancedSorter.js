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
newData["generators"] = {};
newData["miners"] = {};
newData["machines"] = {};
newData["research"] = {};

const machineRecipesFor = [];
const handRecipesFor = [];
const workshopRecipesFor = [];

// recipes
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
      if (!newData[target][name]) {
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
        alternate: v["alternate"],
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

// items
for (const [k, v] of Object.entries(data["items"])) {
  const recipeIn = [];

  if (machineRecipesFor.includes(v["name"])) {
    recipeIn.push("inMachineRecipes");
  }
  if (handRecipesFor.includes(v["name"])) {
    recipeIn.push("inHandRecipes");
  }
  if (workshopRecipesFor.includes(v["name"])) {
    recipeIn.push("inWorkshopRecipes");
  }

  newData["items"][v["name"].toLowerCase()] = {
    name: v["name"],
    sinkPoints: v["sinkPoints"],
    description: v["description"],
    stackSize: v["stackSize"],
    liquid: v["liquid"],
    recipeIn: recipeIn,
  };
}

// generators
for (const [k, v] of Object.entries(data["generators"])) {
  let name;
  switch (true) {
    case k.includes("Biomass"):
      name = "Biomass Burner";
      break;
    case k.includes("Coal"):
      name = "Coal Generator";
      break;
    case k.includes("Fuel"):
      name = "Fuel Generator";
      break;
    case k.includes("GeoThermal"):
      name = "Geothermal Generator";
      break;
    case k.includes("Nuclear"):
      name = "Nuclear Power Plant";
      break;
  }

  const fuels = [];
  for (const fuel of v["fuel"]) {
    fuels.push(data["items"][fuel]["name"]);
  }

  newData["generators"][name.toLowerCase()] = {
    name: name,
    powerProduction: v["powerProduction"],
    waterToPowerRatio: v["waterToPowerRatio"],
    fuel: fuels,
  };
}

// miners
for (const [k, v] of Object.entries(data["miners"])) {
  let name;
  if (k.includes("Miner")) {
    name = `Miner ${k.substring(11, 14)}`;
  } else {
    name = "Oil Pump";
  }

  const resources = [];
  for (const resource of v["allowedResources"]) {
    resources.push(data["items"][resource]["name"]);
  }

  newData["miners"][name.toLowerCase()] = {
    name: name,
    itemsPerCycle: v["itemsPerCycle"],
    extractCycleTime: v["extractCycleTime"],
    allowedResources: resources,
  };
}

// machines
for (const [k, v] of Object.entries(data["buildings"])) {
  if (
    v["categories"].includes("SC_Manufacturers_C") ||
    v["categories"].includes("SC_Smelters_C") ||
    v["categories"].includes("SC_Special_C") ||
    v["categories"].includes("SC_Workstations_C")
  ) {
    const name = v["name"].toLowerCase();
    newData["machines"][name] = {
      name: v["name"],
      description: v["description"],
    };

    if (v["metadata"] && !v["metadata"]["powerConsumption"] == 0) {
      newData["machines"][name]["powerConsumption"] =
        v["metadata"]["powerConsumption"];
    }
  }
}

// research stuff
for (const [k, v] of Object.entries(data["schematics"])) {
  if (k.includes("Research")) {
    let recipes = [];
    if (v["unlock"]["recipes"]) {
      for (const recipe of v["unlock"]["recipes"]) {
        if (Object.keys(data["recipes"]).includes(recipe)) {
          recipes.push(data["recipes"][recipe]["name"]);
        }
      }
    }

    let handSlot = 0;
    if (v["name"] == "Expanded Toolbelt") {
      handSlot = 1;
    }
    const items = [];
    for (const item of v["unlock"]["giveItems"]) {
      if (Object.keys(data["items"]).includes(item["item"])) {
        items.push({
          item: data["items"][item["item"]]["name"],
          amount: item["amount"],
        });
      }
    }

    const unlock = {
      inventorySlots: v["unlock"]["inventorySlots"],
      handSlots: handSlot,
      recipes: recipes,
    };

    newData["research"][v["name"].toLowerCase()] = {
      name: v["name"],
      time: v["time"],
      unlock: unlock,
      cost: v["cost"],
    };
  }
}

let finalData = JSON.stringify(newData, null, 2);
fs.writeFileSync("newData.json", finalData);
