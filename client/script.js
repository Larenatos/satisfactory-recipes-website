const [contentBox] = document.getElementsByClassName("content");

const constructList = (data) => {
  contentBox.innerHTML = "";
  for (const [item, recipes] of Object.entries(data)) {
    const groupName = document.createElement("h2");
    groupName.innerText = item;
    contentBox.append(groupName);

    for (const recipe of recipes) {
      displayRecipe(recipe);
    }
  }
};

const displayRecipes = async (type) => {
  const response = await fetch(`http://localhost:3000/${type}Recipes.json`);
  const data = await response.json();
  constructList(data);
};

const displayKeys = async () => {
  const dataType = document.getElementById("dataType").value;
  const response = await fetch(`http://localhost:3000/header?type=${dataType}`);
  const data = await response.json();
  contentBox.innerHTML = "";

  for (const item of data) {
    const text = document.createElement("h3");
    text.innerText = item;
    contentBox.append(text);
  }
};

const displayRecipe = (recipe) => {
  const list = document.createElement("ul");
  list.classList.add("list");

  const name = document.createElement("li");
  name.innerText = `name: ${recipe["name"]}`;
  const time = document.createElement("li");
  time.innerText = `time to process: ${recipe["time"]}`;

  const productsLi = document.createElement("li");
  productsLi.innerText = "products:";
  const productsUl = document.createElement("ul");
  for (const product of recipe["products"]) {
    const item = document.createElement("li");
    item.innerText = `${product["item"]} (${product["amount"]})`;

    productsUl.append(item);
  }
  productsLi.append(productsUl);

  const ingredientsLi = document.createElement("li");
  ingredientsLi.innerText = "ingredients:";
  const ingredientsUl = document.createElement("ul");
  for (const ingredient of recipe["ingredients"]) {
    const item = document.createElement("li");
    item.innerText = `${ingredient["item"]} (${ingredient["amount"]})`;

    ingredientsUl.append(item);
  }
  ingredientsLi.append(ingredientsUl);

  list.append(name, time, productsLi, ingredientsLi);
  contentBox.append(list);
};

const dataRequest = async () => {
  const dataType = document.getElementById("dataType").value;
  const dataKey = document.getElementById("dataKey").value;
  const response = await fetch(
    `http://localhost:3000/advanced?type=${dataType}&key=${dataKey}`
  );
  const data = await response.json();

  contentBox.innerHTML = "";
  const header = document.createElement("h2");
  header.innerText = dataKey;
  contentBox.append(header);

  switch (dataType) {
    case "recipe":
      displayRecipe(data);
      break;
  }
};
