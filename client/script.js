const basePath = "/satisfactory-recipes";

const [resultDiv] = document.getElementsByClassName("result");
const [oldProductNamesDiv] = document.getElementsByClassName("productNames");
const [errorP] = document.getElementsByClassName("error");
const productInput = document.getElementById("product-input");

const displayRecipeList = (recipesByProduct) => {
  resultDiv.innerHTML = "";

  for (const [productName, recipes] of Object.entries(recipesByProduct)) {
    const productH2 = document.createElement("h2");
    productH2.innerText = productName;

    const recipesDiv = document.createElement("div");

    for (const recipe of recipes) {
      const recipeH3 = document.createElement("h3");
      recipeH3.innerText = recipe.name;

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
      recipesDiv.append(recipeH3, recipeUl);
    }
    resultDiv.append(productH2, recipesDiv);
  }
};

const displayBulkRecipes = async (type) => {
  const response = await fetch(`${basePath}/${type}Recipes.json`);
  const recipesByProduct = await response.json();
  displayRecipeList(recipesByProduct);
};

const displaySearchResults = async () => {
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

  const recipesByProduct = await response.json();
  displayRecipeList(recipesByProduct);
};

const displayAllProducts = async () => {
  const response = await fetch(`${basePath}/products`);
  const productNames = await response.json();
  const newProductNamesDiv = document.createElement("div");
  newProductNamesDiv.classList.add("productNames");

  for (const productName of productNames) {
    const key = document.createElement("h3");
    key.innerText = productName;

    key.addEventListener("click", () => {
      productInput.value = productName;
      displaySearchResults();
    });

    newProductNamesDiv.append(key);
  }
  oldProductNamesDiv.replaceWith(newProductNamesDiv);
};

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (productInput.value) {
      displaySearchResults();
    }
  }
});

window.onload = displayAllProducts();
