import {
  getItemSearch,
  getItem,
  getHardDriveRecipes,
  getItems,
} from "./api.js";
import {
  getRecipesElements,
  getUsedInElements,
  makeRecipesDiv,
} from "./make-recipe-elements.js";
import {
  toggleMaxHeight,
  toggleRecipeHeight,
} from "./modify-recipe-heights.js";

const [errorP] = document.getElementsByClassName("error");
const productInput = document.getElementById("product-input");

const displayItemList = async () => {
  const itemNames = await getItems();

  const [mainEl] = document.getElementsByTagName("main");
  const itemNamesDiv = document.createElement("div");
  itemNamesDiv.classList.add("item-names");

  const itemNameUl = document.createElement("ul");
  for (const itemName of itemNames) {
    const item = document.createElement("li");
    item.innerText = itemName;

    item.addEventListener("click", async () => {
      const recipesByType = await getItem(itemName);
      displayRecipes(recipesByType);
    });

    itemNameUl.append(item);
  }
  itemNamesDiv.append(itemNameUl);

  mainEl.append(itemNamesDiv);
};

window.onload = displayItemList();

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (productInput.value) {
      displaySearchResults();
    }
  }
});

const displayBulkRecipes = async () => {
  const recipesArray = await getHardDriveRecipes();

  const newResultDiv = document.createElement("div");
  newResultDiv.classList.add("result");

  const [recipesDiv] = makeRecipesDiv(recipesArray);
  newResultDiv.append(recipesDiv);

  const [oldResultDiv] = document.getElementsByClassName("result");
  oldResultDiv.replaceWith(newResultDiv);
  toggleMaxHeight(recipesDiv);
};

const displayRecipes = (recipesByType) => {
  const newResultDiv = document.createElement("div");
  newResultDiv.classList.add("result");

  const productText = document.createElement("h2");
  productText.innerText = recipesByType.itemName;
  newResultDiv.append(productText);

  let baseRecipes;

  if (recipesByType.recipes) {
    let rest;
    [baseRecipes, ...rest] = getRecipesElements(recipesByType.recipes);
    newResultDiv.append(...rest);
  }
  if (recipesByType.usedIn) {
    const usedInElements = getUsedInElements(recipesByType.usedIn);
    newResultDiv.append(...usedInElements);
  }

  const [oldResultDiv] = document.getElementsByClassName("result");
  oldResultDiv.replaceWith(newResultDiv);

  if (baseRecipes) {
    for (const baseRecipe of baseRecipes) {
      toggleRecipeHeight(...baseRecipe);
    }
  }
};

const displaySearchResults = async () => {
  if (!errorP.innerText == "") {
    errorP.innerText = "";
  }

  let recipesByType;
  try {
    recipesByType = await getItemSearch(productInput.value);
  } catch (error) {
    errorP.innerText = error.message;
  }

  displayRecipes(recipesByType);
};

document
  .getElementById("bulk-recipe")
  .addEventListener("click", displayBulkRecipes);

document
  .getElementById("item-search")
  .addEventListener("click", displaySearchResults);
