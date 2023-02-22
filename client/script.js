const baseUrl = "/satisfactory-recipes";

const [resultBox] = document.getElementsByClassName("search-results");
const [errorText] = document.getElementsByClassName("error");

const displayRecipeList = (data) => {
  resultBox.innerHTML = "";

  for (const [item, recipes] of Object.entries(data)) {
    const productName = document.createElement("h2");
    productName.innerText = item;
    resultBox.append(productName);

    const recipeDivs = document.createElement("div");

    for (const recipe of recipes) {
      const recipeName = document.createElement("h3");
      recipeName.innerText = recipe.name;

      const list = document.createElement("ul");
      list.classList.add("top-level-list");

      const name = document.createElement("li");
      name.innerText = `name: ${recipe.name}`;

      const time = document.createElement("li");
      time.innerText = `time to process: ${recipe.time}s`;

      const alternate = document.createElement("li");
      alternate.innerText = `alternate: ${recipe.alternate}`;

      const producedIn = document.createElement("li");
      producedIn.innerText = "produced in:";

      const producedInUl = document.createElement("ul");
      for (const machine of recipe.producedIn) {
        const machineElement = document.createElement("li");
        machineElement.innerText = machine;

        producedInUl.append(machineElement);
      }
      producedIn.append(producedInUl);

      const productsLi = document.createElement("li");
      productsLi.innerText = "products:";

      const productsUl = document.createElement("ul");
      for (const product of recipe.products) {
        const productElement = document.createElement("li");
        productElement.innerText = `${product.item} (${product.amount})`;

        productsUl.append(productElement);
      }
      productsLi.append(productsUl);

      const ingredientsLi = document.createElement("li");
      ingredientsLi.innerText = "ingredients:";

      const ingredientsUl = document.createElement("ul");
      for (const ingredient of recipe.ingredients) {
        const ingredientElement = document.createElement("li");
        ingredientElement.innerText = `${ingredient.item} (${ingredient.amount})`;

        ingredientsUl.append(ingredientElement);
      }
      ingredientsLi.append(ingredientsUl);

      list.append(name, time, alternate, producedIn, productsLi, ingredientsLi);
      recipeDivs.append(recipeName, list);
    }
    resultBox.append(recipeDivs);
  }
};

const displayRecipes = async (type) => {
  const response = await fetch(`${baseUrl}/${type}Recipes.json`);
  const data = await response.json();
  displayRecipeList(data);
};

const displaySearchResults = async () => {
  errorText.innerText = "";
  const input = document.getElementById("product-input").value;

  const response = await fetch(`${baseUrl}/search?key=${input}`);

  if (response.status == 400) {
    const { message } = await response.json();
    errorText.innerText = message;
    return;
  }

  const data = await response.json();
  displayRecipeList(data);
};

const displayAllKeys = async () => {
  const response = await fetch(`${baseUrl}/products`);
  const data = await response.json();
  resultBox.innerHTML = "";

  for (const item of data) {
    const key = document.createElement("h4");
    key.innerText = item;

    key.addEventListener("click", () => {
      document.getElementById("product-input").value = item;
      displaySearchResults();
    });

    resultBox.append(key);
  }
};
