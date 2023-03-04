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

const getRecipesDiv = (recipesByProduct) => {
  const recipes = recipesByProduct;
  const recipesDiv = document.createElement("div");

  for (const recipe of recipes) {
    const recipeH4 = document.createElement("h4");
    recipeH4.innerText = recipe.name;

    const recipeNameSvg = svg.cloneNode(true);
    recipeNameSvg.setAttribute("width", "15");
    recipeNameSvg.setAttribute("height", "15");
    recipeH4.prepend(recipeNameSvg);

    const recipeUl = document.createElement("ul");
    recipeUl.classList.add("top-level-list");
    recipeUl.classList.add("hidden");

    recipeH4.addEventListener("click", () => {
      recipeUl.classList.toggle("hidden");
      recipeNameSvg.classList.toggle("rotated");
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
    recipesDiv.append(recipeH4, recipeUl);
  }
  return recipesDiv;
};

const displayRecipeList = (recipes) => {
  const [oldResultDiv] = document.getElementsByClassName("result");
  const newResultDiv = document.createElement("div");
  newResultDiv.classList.add("result");

  if (Array.isArray(recipes)) {
    newResultDiv.append(getRecipesDiv(recipes));
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
    productSvg.classList.add("rotated");

    const asProductRecipes = getRecipesDiv(recipes.asProduct);

    asProduct.addEventListener("click", () => {
      asProductRecipes.classList.toggle("hidden");
      productSvg.classList.toggle("rotated");
    });

    newResultDiv.append(asProduct, asProductRecipes);
  }

  if (recipes.asIngredient) {
    const asIngredient = document.createElement("h3");
    asIngredient.innerText = "As ingredient:";

    const ingredientSvg = svg.cloneNode(true);
    asIngredient.prepend(ingredientSvg);
    ingredientSvg.classList.add("rotated");

    const asIngredientRecipes = getRecipesDiv(recipes.asIngredient);

    asIngredient.addEventListener("click", () => {
      asIngredientRecipes.classList.toggle("hidden");
      ingredientSvg.classList.toggle("rotated");
    });

    newResultDiv.append(asIngredient, asIngredientRecipes);
  }

  oldResultDiv.replaceWith(newResultDiv);
};

const getBulkRecipes = async (type) => {
  const response = await fetch(`${basePath}/${type}Recipes.json`);
  const recipesArray = await response.json();
  displayRecipeList(recipesArray);
};

const getSearchResults = async () => {
  if (!errorP.innerText == "") {
    errorP.innerText = "";
  }
  const input = productInput.value;

  const response = await fetch(`${basePath}/products/search?input=${input}`);

  if (response.status == 400) {
    const { message } = await response.json();
    errorP.innerText = message;
    return;
  }

  const recipesByType = await response.json();
  displayRecipeList(recipesByType);
};

const displayAllProducts = async () => {
  const response = await fetch(`${basePath}/products`);
  const productNames = await response.json();

  const [oldProductNamesDiv] = document.getElementsByClassName("productNames");
  const newProductNamesDiv = document.createElement("div");
  newProductNamesDiv.classList.add("productNames");

  for (const productName of productNames) {
    const key = document.createElement("h3");
    key.innerText = productName;

    key.addEventListener("click", () => {
      productInput.value = productName;
      getSearchResults();
    });

    newProductNamesDiv.append(key);
  }
  oldProductNamesDiv.replaceWith(newProductNamesDiv);
};

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (productInput.value) {
      getSearchResults();
    }
  }
});

window.onload = displayAllProducts();
