import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getDisplayName = (item) => {
  return data.items[item].name;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

const newData = {
  inMachineRecipes: {},
  inHandRecipes: {},
  inWorkshopRecipes: {},
  items: {},
  generators: {},
  miners: {},
  machines: {},
  research: {},
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
      if (!newData[recipeType][productName]) {
        newData[recipeType][productName] = [];
      }

      newData[recipeType][productName].push({
        name: recipe.name,
        time: recipe.time,
        alternate: recipe.alternate,
        producedIn,
        ingredients,
        products,
      });
    }

    if (!newData.items[productName]) {
      const item = data.items[product.item];
      newData.items[productName] = {
        name: productName,
        sinkPoints: item.sinkPoints,
        description: item.description,
        stackSize: item.stackSize,
        liquid: item.liquid,
        recipeTypes,
      };
    }
  }
}

// generators
for (const [k, v] of Object.entries(data.generators)) {
  let name;

  // TODO: change "build" in k to "desc" and find building name from buildings
  if (k.includes("Biomass")) {
    name = "Biomass Burner";
  } else if (k.includes("Coal")) {
    name = "Coal Generator";
  } else if (k.includes("Fuel")) {
    name = "Fuel Generator";
  } else if (k.includes("GeoThermal")) {
    name = "Geothermal Generator";
  } else if (k.includes("Nuclear")) {
    name = "Nuclear Power Plant";
  }

  const fuel = v.fuel.map(getDisplayName);

  newData.generators[name] = {
    name,
    powerProduction: v.powerProduction,
    waterToPowerRatio: v.waterToPowerRatio,
    fuel,
  };
}

// miners
for (const [k, v] of Object.entries(data.miners)) {
  // TODO: do the same build to desc conversion
  let name;
  if (k.includes("Miner")) {
    name = `Miner ${k.substring(11, 14)}`;
  } else {
    name = "Oil Pump";
  }

  const allowedResources = v.allowedResources.map(getDisplayName);

  newData.miners[name] = {
    name,
    itemsPerCycle: v.itemsPerCycle,
    extractCycleTime: v.extractCycleTime,
    allowedResources,
  };
}

// machines
for (const [, building] of Object.entries(data.buildings)) {
  if (
    building.categories.includes("SC_Manufacturers_C") ||
    building.categories.includes("SC_Smelters_C") ||
    building.categories.includes("SC_Special_C") ||
    building.categories.includes("SC_Workstations_C")
  ) {
    const name = building.name;
    newData.machines[name] = {
      name,
      description: building.description,
    };

    if (building.metadata.powerConsumption) {
      newData.machines[name].powerConsumption =
        building.metadata.powerConsumption;
    }
  }
}

// research stuff
for (const [k, v] of Object.entries(data.schematics)) {
  if (!k.includes("Research")) {
    continue;
  }

  const recipes = [];
  for (const recipe of v.unlock.recipes) {
    if (data.recipes[recipe]) {
      recipes.push(data.recipes[recipe].name);
    }
  }

  const handSlots = v.name == "Expanded Toolbelt" ? 1 : 0;

  const items = v.unlock.giveItems.map((item) => {
    return {
      item: getDisplayName(item.item),
      amount: item.amount,
    };
  });

  const unlock = {
    inventorySlots: v.unlock.inventorySlots,
    handSlots,
    recipes,
    items,
  };

  newData.research[v.name] = {
    name: v.name,
    time: v.time,
    unlock: unlock,
    cost: v.cost,
  };
}

let finalData = JSON.stringify(newData, null, 2);
fs.writeFileSync("newData.json", finalData);
