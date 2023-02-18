const baseUrl = "/satisfactory-recipes";

const [resultBox] = document.getElementsByClassName("search-results");
const [errorText] = document.getElementsByClassName("error");

const displayRecipes = async (type) => {
  const response = await fetch(`${baseUrl}/${type}Recipes.json`);
  const data = await response.json();
  displayRecipeList(data);
};

const displayRecipeList = (data) => {
  resultBox.innerHTML = "";

  for (const [item, recipes] of Object.entries(data)) {
    const productName = document.createElement("h2");
    productName.innerText = item;
    resultBox.append(productName);

    for (const recipe of recipes) {
      displayRecipe(recipe);
    }
  }
};

const displayRecipe = (data) => {
  const list = document.createElement("ul");
  list.classList.add("top-level-list");

  const name = document.createElement("li");
  name.innerText = `name: ${data["name"]}`;

  const time = document.createElement("li");
  time.innerText = `time to process: ${data["time"]}s`;

  const alternate = document.createElement("li");
  alternate.innerText = `alternate: ${data["alternate"]}`;

  const producedIn = document.createElement("li");
  producedIn.innerText = "produced in:";

  const producedInUl = document.createElement("ul");
  for (const machine of data["producedIn"]) {
    const machineElement = document.createElement("li");
    machineElement.innerText = machine;

    producedInUl.append(machineElement);
  }
  producedIn.append(producedInUl);

  const productsLi = document.createElement("li");
  productsLi.innerText = "products:";

  const productsUl = document.createElement("ul");
  for (const product of data["products"]) {
    const productElement = document.createElement("li");
    productElement.innerText = `${product["item"]} (${product["amount"]})`;

    productsUl.append(productElement);
  }
  productsLi.append(productsUl);

  const ingredientsLi = document.createElement("li");
  ingredientsLi.innerText = "ingredients:";
  const ingredientsUl = document.createElement("ul");
  for (const ingredient of data["ingredients"]) {
    const ingredientElement = document.createElement("li");
    ingredientElement.innerText = `${ingredient["item"]} (${ingredient["amount"]})`;

    ingredientsUl.append(ingredientElement);
  }
  ingredientsLi.append(ingredientsUl);

  list.append(name, time, alternate, producedIn, productsLi, ingredientsLi);
  resultBox.append(list);
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
  resultBox.append(list);
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
  resultBox.append(list);
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

  resultBox.append(list);
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
  resultBox.append(list);
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
  resultBox.append(list);
};

const displayPossibleKeys = async () => {
  const dataType = document.getElementById("dataType").value;
  const response = await fetch(`${baseUrl}/products?type=${dataType}`);
  const data = await response.json();
  resultBox.innerHTML = "";

  for (const item of data) {
    const key = document.createElement("h4");
    key.innerText = item;
    resultBox.append(key);
  }
};

const displayAll = (type, data) => {
  if (
    type == "inMachineRecipes" ||
    type == "inHandRecipes" ||
    type == "inWorkshopRecipes"
  ) {
    displayRecipeList(data);
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
    case "machines":
      callBack = displayMachine;
      break;
    case "research":
      callBack = displayResearch;
      break;
  }

  for (const [k, value] of Object.entries(data)) {
    const header = document.createElement("h3");
    header.innerText = value["name"];
    resultBox.append(header);

    const list = document.createElement("ul");
    list.classList.add("top-level-list");

    const name = document.createElement("li");
    name.innerText = `name: ${value["name"]}`;
    list.append(name);

    callBack(value, list);
  }
};

const displaySearchResults = async () => {
  errorText.innerText = "";
  const dataType = document.getElementById("dataType").value;
  const input = document.getElementById("dataKey").value;

  const response = await fetch(
    `${baseUrl}/search?type=${dataType}&key=${input}`
  );

  if (response.status == 400) {
    const { message } = await response.json();
    errorText.innerText = message;
    return;
  }

  const data = await response.json();

  resultBox.innerHTML = "";

  if (input == "all") {
    displayAll(dataType, data);
    return;
  }

  const list = document.createElement("ul");
  list.classList.add("top-level-list");

  const name = document.createElement("li");
  name.innerText = `name: ${data.name}`;
  list.append(name);

  if (
    dataType == "inMachineRecipes" ||
    dataType == "inHandRecipes" ||
    dataType == "inWorkshopRecipes"
  ) {
    for (const recipe of data) {
      const header = document.createElement("h2");
      header.innerText = recipe.name;
      resultBox.append(header);

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
