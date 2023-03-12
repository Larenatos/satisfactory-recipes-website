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

const displayAllProducts = async () => {
  const response = await fetch(`${basePath}/items.json`);
  const productNames = await response.json();

  const [mainEl] = document.getElementsByTagName("main");
  const productNamesDiv = document.createElement("div");
  productNamesDiv.classList.add("product-names");

  for (const productName of productNames) {
    const key = document.createElement("h3");
    key.innerText = productName;

    key.addEventListener("click", () => {
      productInput.value = productName;
      getSearchResults();
    });

    productNamesDiv.append(key);
  }
  mainEl.append(productNamesDiv);
};

window.onload = displayAllProducts();

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (productInput.value) {
      getSearchResults();
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

const getRecipesDiv = (recipesByProduct) => {
  const recipes = recipesByProduct;
  const recipesDiv = document.createElement("div");

  for (const recipe of recipes) {
    const recipeNameH4 = document.createElement("h4");
    recipeNameH4.innerText = recipe.name;

    const recipeNameSvg = svg.cloneNode(true);
    recipeNameSvg.setAttribute("width", "15");
    recipeNameSvg.setAttribute("height", "15");
    recipeNameH4.prepend(recipeNameSvg);

    const recipeUl = document.createElement("ul");
    recipeUl.classList.add("top-level-list", "result-transition");

    recipeNameH4.addEventListener("click", async () => {
      requestAnimationFrame(() => {
        toggleMaxHeight(recipeUl, recipesDiv);
        recipeNameSvg.classList.toggle("rotated");
      });
    });

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
  }
  return recipesDiv;
};

const displayRecipeList = (recipes) => {
  const [oldResultDiv] = document.getElementsByClassName("result");
  const newResultDiv = document.createElement("div");
  newResultDiv.classList.add("result");

  if (Array.isArray(recipes)) {
    newResultDiv.append(getRecipesDiv(recipes));
    oldResultDiv.replaceWith(newResultDiv);
    return;
  }

  if (recipes.productName) {
    const productText = document.createElement("h2");
    productText.innerText = recipes.productName;
    newResultDiv.append(productText);
  }

  if (recipes.asProduct) {
    const asProduct = document.createElement("h3");
    asProduct.innerText = "As product:";

    const productSvg = svg.cloneNode(true);
    asProduct.prepend(productSvg);

    const asProductRecipesDiv = getRecipesDiv(recipes.asProduct);
    asProductRecipesDiv.classList.add("recipes-div", "result-transition");

    asProduct.addEventListener("click", () => {
      toggleMaxHeight(asProductRecipesDiv);
      productSvg.classList.toggle("rotated");
    });

    newResultDiv.append(asProduct, asProductRecipesDiv);
  }

  if (recipes.asIngredient) {
    const asIngredient = document.createElement("h3");
    asIngredient.innerText = "As ingredient:";

    const ingredientSvg = svg.cloneNode(true);
    asIngredient.prepend(ingredientSvg);

    const asIngredientRecipesDiv = getRecipesDiv(recipes.asIngredient);
    asIngredientRecipesDiv.classList.add("recipes-div", "result-transition");

    asIngredient.addEventListener("click", () => {
      toggleMaxHeight(asIngredientRecipesDiv);
      ingredientSvg.classList.toggle("rotated");
    });

    newResultDiv.append(asIngredient, asIngredientRecipesDiv);
  }

  oldResultDiv.replaceWith(newResultDiv);
};

const getBulkRecipes = async (type) => {
  const response = await fetch(`${basePath}/${type}-recipes.json`);
  const recipesArray = await response.json();
  displayRecipeList(recipesArray);
};

const getSearchResults = async () => {
  if (!errorP.innerText == "") {
    errorP.innerText = "";
  }
  const input = productInput.value;

  const response = await fetch(`${basePath}/item-search?input=${input}`);

  if (response.status == 400) {
    const { message } = await response.json();
    errorP.innerText = message;
    return;
  }

  const recipesByType = await response.json();
  displayRecipeList(recipesByType);
};
