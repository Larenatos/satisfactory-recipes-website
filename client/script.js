const contentBox = document.getElementById("content");

const constructList = (recipes) => {
  contentBox.innerHTML = "";
  for (const [key, value] of Object.entries(recipes)){
    let list = document.createElement("ul");
    list.style.marginTop = "40px";

    let name = document.createElement("li");
    name.innerText = `name: ${value[0]["name"]}`;
    let time = document.createElement("li");
    time.innerText = `time to process: ${value[0]["time"]}`;

    let productsLi = document.createElement("li");
    productsLi.innerText = "products:";
    
    let productsUl = document.createElement("ul");
    for (const product of value[0]["products"]){
      let item = document.createElement("li");
      item.innerText = `item: ${product["item"]}`;
      
      let amount = document.createElement("li");
      amount.innerText = `amount: ${product["amount"]}`;

      productsUl.appendChild(item);
      productsUl.appendChild(amount);
    }

    let ingredientsLi = document.createElement("li");
    ingredientsLi.innerText = "ingredients:";
    
    let ingredientsUl = document.createElement("ul");
    for (const ingredient of value[0]["ingredients"]){
      let item = document.createElement("li");
      item.innerText = `item: ${ingredient["item"]}`;
      
      let amount = document.createElement("li");
      amount.innerText = `amount: ${ingredient["amount"]}`;

      ingredientsUl.appendChild(item);
      ingredientsUl.appendChild(amount);
    }

    list.appendChild(name);
    list.appendChild(time);
    list.appendChild(productsLi);
    list.appendChild(productsUl);
    list.appendChild(ingredientsLi);
    list.appendChild(ingredientsUl);
    contentBox.appendChild(list);
  }
}

const baseRecipeCall = async () => {
  const response = await fetch('http://localhost:3000/baseRecipes.json');
  const data = await response.json();
  constructList(data); 
}

const alternateRecipeCall = async () => {
  const response = await fetch('http://localhost:3000/alternateRecipes.json');
  const data = await response.json();
  constructList(data); 
}