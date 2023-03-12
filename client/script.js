const basePath = "/satisfactory-recipes";

const [errorP] = document.getElementsByClassName("error");
const productInput = document.getElementById("product-input");

const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("viewBox", "0 0 70 80");
svg.setAttribute("width", "25");
svg.setAttribute("height", "25");

const triangle = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "polygon"
);
triangle.setAttribute("points", "0,0 69,40 0,80");
triangle.setAttribute("fill", "white");
svg.append(triangle);

const displayAllItems = async () => {
  const response = await fetch(`${basePath}/items.json`);
  const itemNames = await response.json();

  const [mainEl] = document.getElementsByTagName("main");
  const itemNamesDiv = document.createElement("div");
  itemNamesDiv.classList.add("item-names");

  for (const itemName of itemNames) {
    const item = document.createElement("h3");
    item.innerText = itemName;

    item.addEventListener("click", () => {
      displaySearchResults(itemName);
    });

    itemNamesDiv.append(item);
  }
  mainEl.append(itemNamesDiv);
};

window.onload = displayAllItems();

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (productInput.value) {
      displaySearchResults();
    }
  }
});

const toggleMaxHeight = (element, parent = null) => {
  if (!element.style.maxHeight || element.style.maxHeight === "0px") {
    const elementScrollHeight = element.scrollHeight;
    element.style.maxHeight = elementScrollHeight + "px";

    if (parent) {
      const updatedParentScrollHeight =
        Number(elementScrollHeight) + Number(parent.scrollHeight);
      parent.style.maxHeight = String(updatedParentScrollHeight) + "px";
    }
  } else {
    element.style.maxHeight = "0px";
  }
};

const toggleRecipeHeight = (recipeUl, recipesDiv, recipeNameSvg) => {
  requestAnimationFrame(() => {
    toggleMaxHeight(recipeUl, recipesDiv);
    recipeNameSvg.classList.toggle("rotated");
  });
};

const makeRecipesDiv = (recipeInfos) => {
  const recipesDiv = document.createElement("div");
  let baseRecipes = [];

  for (const recipe of recipeInfos) {
    const recipeNameH4 = document.createElement("h4");
    recipeNameH4.innerText = recipe.name;

    const recipeNameSvg = svg.cloneNode(true);
    recipeNameSvg.setAttribute("width", "15");
    recipeNameSvg.setAttribute("height", "15");
    recipeNameH4.prepend(recipeNameSvg);

    const recipeUl = document.createElement("ul");
    recipeUl.classList.add("top-level-list", "result-transition");

    const timeLi = document.createElement("li");
    timeLi.innerText = `Crafting time: ${recipe.time}s`;

    const producedInLi = document.createElement("li");
    producedInLi.innerText = "Produced in:";

    const producedInUl = document.createElement("ul");
    for (const machine of recipe.producedIn) {
      const machineLi = document.createElement("li");
      machineLi.innerText = machine;

      producedInUl.append(machineLi);
    }
    producedInLi.append(producedInUl);

    const productsLi = document.createElement("li");
    productsLi.innerText = "Products:";

    const productsUl = document.createElement("ul");
    for (const product of recipe.products) {
      const productLi = document.createElement("li");
      productLi.innerText = `${product.item} (${product.amount})`;

      productsUl.append(productLi);
    }
    productsLi.append(productsUl);

    const ingredientsLi = document.createElement("li");
    ingredientsLi.innerText = "Ingredients:";

    const ingredientsUl = document.createElement("ul");
    for (const ingredient of recipe.ingredients) {
      const ingredientLi = document.createElement("li");
      ingredientLi.innerText = `${ingredient.item} (${ingredient.amount})`;

      ingredientsUl.append(ingredientLi);
    }
    ingredientsLi.append(ingredientsUl);

    recipeUl.append(timeLi, producedInLi, productsLi, ingredientsLi);
    recipesDiv.append(recipeNameH4, recipeUl);

    if (!recipe.name.includes("Alternate")) {
      baseRecipes.push([recipeUl, recipesDiv, recipeNameSvg]);
    }

    recipeNameH4.addEventListener("click", () => {
      toggleRecipeHeight(recipeUl, recipesDiv, recipeNameSvg);
    });
  }
  return [recipesDiv, baseRecipes];
};

const getRecipesElements = (recipeInfos) => {
  const recipesH3 = document.createElement("h3");
  recipesH3.innerText = "Recipes:";

  const recipeSvg = svg.cloneNode(true);
  recipesH3.prepend(recipeSvg);

  const [RecipesDiv, baseRecipes] = makeRecipesDiv(recipeInfos);
  RecipesDiv.classList.add("recipes-div", "result-transition");

  toggleMaxHeight(RecipesDiv);

  recipesH3.addEventListener("click", () => {
    toggleMaxHeight(RecipesDiv);
    recipeSvg.classList.toggle("rotated");
  });

  return [recipesH3, RecipesDiv, baseRecipes, recipeSvg];
};

const getUsedInElements = (recipeInfos) => {
  const usedIn = document.createElement("h3");
  usedIn.innerText = "Used in:";

  const ingredientSvg = svg.cloneNode(true);
  usedIn.prepend(ingredientSvg);

  const [usedInRecipesDiv] = makeRecipesDiv(recipeInfos);
  usedInRecipesDiv.classList.add("recipes-div", "result-transition");

  usedIn.addEventListener("click", () => {
    toggleMaxHeight(usedInRecipesDiv);
    ingredientSvg.classList.toggle("rotated");
  });

  return [usedIn, usedInRecipesDiv];
};

const getBulkRecipes = async () => {
  const response = await fetch(`${basePath}/recipes-from-hard-drives.json`);
  const recipesArray = await response.json();
  displayRecipeList(recipesArray);
};

const displaySearchResults = async () => {
  if (!errorP.innerText == "") {
    errorP.innerText = "";
  }
  const input = productInput.value;

  const url = `${basePath}/comparison-item-search?input=${input}`;
  const response = await fetch(url);

  if (response.status == 400) {
    const { message } = await response.json();
    errorP.innerText = message;
    return;
  }

  const recipesByType = await response.json();

  const newResultDiv = document.createElement("div");
  newResultDiv.classList.add("result");

  const productText = document.createElement("h2");
  productText.innerText = recipesByType.itemName;
  newResultDiv.append(productText);

  let baseRecipes;
  let recipeSvg;

  if (recipesByType.recipes) {
    const recipesElements = getRecipesElements(recipesByType.recipes);
    console.log(recipesElements);

    newResultDiv.append(recipesElements[0], recipesElements[1]);

    recipeSvg = recipesElements[3];
    baseRecipes = recipesElements[2];
  }
  if (recipesByType.usedIn) {
    const usedInElements = getUsedInElements(recipesByType.usedIn);
    newResultDiv.append(...usedInElements);
  }

  const [oldResultDiv] = document.getElementsByClassName("result");
  requestAnimationFrame(() => {
    oldResultDiv.replaceWith(newResultDiv);
  });

  if (baseRecipes) {
    recipeSvg.classList.add("rotated");
    for (const baseRecipe of baseRecipes) {
      toggleRecipeHeight(...baseRecipe);
    }
  }
};
