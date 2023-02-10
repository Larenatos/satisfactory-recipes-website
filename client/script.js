const baseUrl = "http://localhost:3000/satisfactory-recipes";
// const baseUrl = "https://lare.alwaysdata.net/satisfactory-recipes";
const [contentBox] = document.getElementsByClassName("content");
const [errorText] = document.getElementsByClassName("error");

const constructList = (data) => {
  contentBox.innerHTML = "";
  for (const [item, recipes] of Object.entries(data)) {
    const groupName = document.createElement("h1");
    groupName.innerText = item;
    contentBox.append(groupName);

    for (const recipe of recipes) {
      displayRecipe(recipe);
    }
  }
};

const displayRecipe = (data) => {
  const list = document.createElement("ul");
  list.classList.add("list");

  const name = document.createElement("li");
  name.innerText = `name: ${data["name"]}`;

  const time = document.createElement("li");
  time.innerText = `time to process: ${data["time"]}s`;

  const producedIn = document.createElement("li");
  producedIn.innerText = "produced in:";

  const producedInUl = document.createElement("ul");
  for (const building of data["producedIn"]) {
    const build = document.createElement("li");
    build.innerText = building;

    producedInUl.append(build);
  }
  producedIn.append(producedInUl);

  const productsLi = document.createElement("li");
  productsLi.innerText = "products:";

  const productsUl = document.createElement("ul");
  for (const product of data["products"]) {
    const item = document.createElement("li");
    item.innerText = `${product["item"]} (${product["amount"]})`;

    productsUl.append(item);
  }
  productsLi.append(productsUl);

  const ingredientsLi = document.createElement("li");
  ingredientsLi.innerText = "ingredients:";
  const ingredientsUl = document.createElement("ul");
  for (const ingredient of data["ingredients"]) {
    const item = document.createElement("li");
    item.innerText = `${ingredient["item"]} (${ingredient["amount"]})`;

    ingredientsUl.append(item);
  }
  ingredientsLi.append(ingredientsUl);

  list.append(name, time, producedIn, productsLi, ingredientsLi);
  contentBox.append(list);
};

const displayRecipes = async (type) => {
  const response = await fetch(`${baseUrl}/${type}Recipes.json`);
  const data = await response.json();
  constructList(data);
};

const displayItem = (data, list) => {
  const sinkPoints = document.createElement("li");
  sinkPoints.innerText = `sink points: ${data["sinkPoints"]}`;

  const description = document.createElement("li");
  description.innerText = `description: \n${data["description"]}`;

  const stackSize = document.createElement("li");
  stackSize.innerText = `stackSize: ${data["stackSize"]}`;

  const liquid = document.createElement("li");
  liquid.innerText = `liquid: ${data["liquid"]}`;

  const recipeIn = document.createElement("li");
  recipeIn.innerText = "recipes in:";

  const recipeInUl = document.createElement("ul");
  for (const place of data["recipeIn"]) {
    const destination = document.createElement("li");
    destination.innerText = place;

    recipeInUl.append(destination);
  }
  recipeIn.append(recipeInUl);

  list.append(sinkPoints, description, stackSize, liquid, recipeIn);
  contentBox.append(list);
};

const displayGenerator = (data, list) => {
  const power = document.createElement("li");
  power.innerText = `power production: ${data["powerProduction"]} MW`;

  const waterRatio = document.createElement("li");
  waterRatio.innerText = `water to power ratio: ${data["waterToPowerRatio"]}`;

  const fuel = document.createElement("li");
  fuel.innerText = "fuels:";

  const fuelUl = document.createElement("ul");
  for (const fuel of data["fuel"]) {
    const fuelText = document.createElement("li");
    fuelText.innerText = fuel;

    fuelUl.append(fuelText);
  }
  fuel.append(fuelUl);

  list.append(power, waterRatio, fuel);
  contentBox.append(list);
};

const displayMachine = (data, list) => {
  const description = document.createElement("li");
  description.innerText = `description: \n${data["description"]}`;

  list.append(description);

  if (data["powerConsumption"]) {
    const power = document.createElement("li");
    power.innerText = `power consumption: ${data["powerConsumption"]} MW`;
    list.append(power);
  }

  contentBox.append(list);
};

const displayMiner = (data, list) => {
  const cycle = document.createElement("li");
  cycle.innerText = `items per cycle: ${data["itemsPerCycle"]}`;

  const cycleTime = document.createElement("li");
  cycleTime.innerText = `cycle time: ${data["extractCycleTime"]}s`;

  const resources = document.createElement("li");
  resources.innerText = "allowed resources:";

  const resourcesUl = document.createElement("ul");
  for (const resource of data["allowedResources"]) {
    const resourceText = document.createElement("li");
    resourceText.innerText = resource;

    resourcesUl.append(resourceText);
  }
  resources.append(resourcesUl);

  list.append(cycle, cycleTime, resources);
  contentBox.append(list);
};

const displayResearch = (data, list) => {
  const time = document.createElement("li");
  time.innerText = `time: ${data["time"]}`;

  const unlocks = document.createElement("li");
  unlocks.innerText = "unlocks:";

  const unlocksUl = document.createElement("ul");

  const inventory = document.createElement("li");
  inventory.innerText = `inventory slots: ${data["unlock"]["inventorySlots"]}`;

  const hand = document.createElement("li");
  hand.innerText = `hand slots: ${data["unlock"]["handSlots"]}`;

  const recipes = document.createElement("li");
  recipes.innerText = "recipes:";

  const recipesUl = document.createElement("ul");
  for (const recipeName of data["unlock"]["recipes"]) {
    const recipe = document.createElement("li");
    recipe.innerText = recipeName;

    recipesUl.append(recipe);
  }
  recipes.append(recipesUl);

  unlocksUl.append(inventory, hand, recipes);
  unlocks.append(unlocksUl);

  const cost = document.createElement("li");
  cost.innerText = "cost:";

  const costUl = document.createElement("ul");
  for (const costItem of data["cost"]) {
    const cost = document.createElement("li");
    cost.innerText = `${costItem["item"]} (${costItem["amount"]})`;

    costUl.append(cost);
  }
  cost.append(costUl);

  list.append(time, unlocks, cost);
  contentBox.append(list);
};

const displayKeys = async () => {
  const dataType = document.getElementById("dataType").value;
  const response = await fetch(`${baseUrl}/header?type=${dataType}`);
  const data = await response.json();
  contentBox.innerHTML = "";

  for (const item of data) {
    const text = document.createElement("h3");
    text.innerText = item;
    contentBox.append(text);
  }
};

const displayAll = (type, data) => {
  if (
    type == "inMachineRecipes" ||
    type == "inHandRecipes" ||
    type == "inWorkshopRecipes"
  ) {
    constructList(data);
    return;
  }

  let callBack;
  switch (type) {
    case "items":
      callBack = displayItem;
      break;
    case "generators":
      callBack = displayGenerator;
      break;
    case "miners":
      callBack = displayMiner;
      break;
    case "machine":
      callBack = displayMachine;
      break;
    case "research":
      callBack = displayResearch;
      break;
  }

  for (const [k, value] of Object.entries(data)) {
    const header = document.createElement("h2");
    header.innerText = value["name"];
    contentBox.append(header);

    const list = document.createElement("ul");
    list.classList.add("list");

    const name = document.createElement("li");
    name.innerText = `name: ${value["name"]}`;
    list.append(name);

    callBack(value, list);
  }
};

const dataRequest = async () => {
  errorText.innerText = "";
  const dataType = document.getElementById("dataType").value;
  const dataKey = document.getElementById("dataKey").value;

  const response = await fetch(
    `${baseUrl}/advanced?type=${dataType}&key=${dataKey.toLowerCase()}`
  );

  if (response.status == 503) {
    errorText.innerText = await response.text();
    return;
  }

  const data = await response.json();

  contentBox.innerHTML = "";

  if (dataKey == "all") {
    displayAll(dataType, data);
    return;
  }

  const header = document.createElement("h1");
  header.innerText = dataKey.charAt(0).toUpperCase() + dataKey.slice(1);
  contentBox.append(header);

  const list = document.createElement("ul");
  list.classList.add("list");

  const name = document.createElement("li");
  name.innerText = `name: ${data["name"]}`;
  list.append(name);

  if (
    dataType == "inMachineRecipes" ||
    dataType == "inHandRecipes" ||
    dataType == "inWorkshopRecipes"
  ) {
    for (const recipe of data) {
      displayRecipe(recipe, list);
    }
  } else if (dataType == "items") {
    displayItem(data, list);
  } else if (dataType == "generators") {
    displayGenerator(data, list);
  } else if (dataType == "miners") {
    displayMiner(data, list);
  } else if (dataType == "machines") {
    displayMachine(data, list);
  } else if (dataType == "research") {
    displayResearch(data, list);
  }
};
