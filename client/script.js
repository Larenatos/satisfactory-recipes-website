const baseUrl = "/satisfactory-recipes";

const [resultDiv] = document.getElementsByClassName("result");
const [errorP] = document.getElementsByClassName("error");
const productInput = document.getElementById("product-input");

const displayRecipeList = (data) => {
  resultDiv.innerHTML = "";

  for (const [item, recipes] of Object.entries(data)) {
    const productH2 = document.createElement("h2");
    productH2.innerText = item;

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
  const response = await fetch(`${baseUrl}/${type}Recipes.json`);
  const data = await response.json();
  displayRecipeList(data);
};

const displaySearchResults = async () => {
  errorP.innerText = "";
  const input = productInput.value;

  const response = await fetch(`${baseUrl}/search?key=${input}`);

  if (response.status == 400) {
    const { message } = await response.json();
    errorP.innerText = message;
    return;
  }

  const data = await response.json();
  displayRecipeList(data);
};

const displayAllProducts = async () => {
  const response = await fetch(`${baseUrl}/products`);
  const data = await response.json();
  resultDiv.innerHTML = "";

  for (const item of data) {
    const key = document.createElement("h4");
    key.innerText = item;

    key.addEventListener("click", () => {
      productInput.value = item;
      displaySearchResults();
    });

    resultDiv.append(key);
  }
};
