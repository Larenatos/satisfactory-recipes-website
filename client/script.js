const [contentBox] = document.getElementsByClassName("content");

const constructList = (recipes) => {
  contentBox.innerHTML = "";
  for (const [key, value] of Object.entries(recipes)){
    const list = document.createElement("ul");
    list.classList.add("list");

    const name = document.createElement("li");
    name.innerText = `name: ${value[0]["name"]}`;
    const time = document.createElement("li");
    time.innerText = `time to process: ${value[0]["time"]}`;

    const productsLi = document.createElement("li");
    productsLi.innerText = "products:";
    const productsUl = document.createElement("ul");
    for (const product of value[0]["products"]){
      const item = document.createElement("li");
      item.innerText = `${product["item"]} (${product["amount"]})`;

      productsUl.append(item);
    }
    productsLi.append(productsUl);

    const ingredientsLi = document.createElement("li");
    ingredientsLi.innerText = "ingredients:";
    const ingredientsUl = document.createElement("ul");
    for (const ingredient of value[0]["ingredients"]){
      const item = document.createElement("li");
      item.innerText = `${ingredient["item"]} (${ingredient["amount"]})`;

      ingredientsUl.append(item);
    }
    ingredientsLi.append(ingredientsUl);

    list.append(name, time, productsLi, ingredientsLi);
    contentBox.append(list);
  }
}

const displayRecipes = async (type) => {
  const response = await fetch(`http://localhost:3000/${type}Recipes.json`);
  const data = await response.json();
  constructList(data); 
}