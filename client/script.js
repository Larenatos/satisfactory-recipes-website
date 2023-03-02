const basePath = "/satisfactory-recipes";

const [errorP] = document.getElementsByClassName("error");
const productInput = document.getElementById("product-input");

const getRecipeDom = (recipesByProduct) => {
  const recipes = recipesByProduct;
  const recipesDiv = document.createElement("div");

  for (const recipe of recipes) {
    const recipeH4 = document.createElement("h4");
    recipeH4.innerText = recipe.name;

    const recipeUl = document.createElement("ul");
    recipeUl.classList.add("top-level-list");

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

const displayRecipeList = (recipesByType) => {
  const [oldResultDiv] = document.getElementsByClassName("result");
  const newResultDiv = document.createElement("div");
  newResultDiv.classList.add("result");

  if (recipesByType.asProduct) {
    const asProduct = document.createElement("h2");
    asProduct.innerText = "As product:";
    newResultDiv.append(asProduct, getRecipeDom(recipesByType.asProduct));
  }

  if (recipesByType.asIngredient) {
    const asIngredient = document.createElement("h2");
    asIngredient.innerText = "As ingredient:";
    newResultDiv.append(asIngredient, getRecipeDom(recipesByType.asIngredient));
  }

  oldResultDiv.replaceWith(newResultDiv);
};

const displayBulkRecipeList = (recipesByProduct) => {
  const [oldResultDiv] = document.getElementsByClassName("result");
  const newResultDiv = document.createElement("div");
  newResultDiv.classList.add("result");

  for (const [productName, recipes] of Object.entries(recipesByProduct)) {
    const productH3 = document.createElement("h3");
    productH3.innerText = productName;

    const recipesDiv = document.createElement("div");

    for (const recipe of recipes) {
      const recipeH4 = document.createElement("h4");
      recipeH4.innerText = recipe.name;

      const recipeUl = document.createElement("ul");
      recipeUl.classList.add("top-level-list");

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
    newResultDiv.append(productH3, recipesDiv);
  }
  oldResultDiv.replaceWith(newResultDiv);
};

const getBulkRecipes = async (type) => {
  const response = await fetch(`${basePath}/${type}Recipes.json`);
  const recipesByProduct = await response.json();
  displayBulkRecipeList(recipesByProduct);
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
