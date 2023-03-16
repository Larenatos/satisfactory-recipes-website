import { createBigSvg, createSmallSvg } from "./svg.js";
import {
  toggleMaxHeight,
  toggleRecipeHeight,
} from "./modify-recipe-heights.js";

const getRecipesElements = (recipes) => {
  const recipesH3 = document.createElement("h3");
  recipesH3.innerText = "Recipes:";

  const recipeSvg = createBigSvg();
  recipeSvg.classList.add("rotated");
  recipesH3.prepend(recipeSvg);

  const [recipesDiv, baseRecipes] = makeRecipesDiv(recipes);

  recipesH3.addEventListener("click", () => {
    toggleMaxHeight(recipesDiv);
    recipeSvg.classList.toggle("rotated");
  });

  return [baseRecipes, recipesH3, recipesDiv];
};

const getUsedInElements = (recipes) => {
  const usedInH3 = document.createElement("h3");
  usedInH3.innerText = "Used in:";

  const usedInSvg = createBigSvg();
  usedInH3.prepend(usedInSvg);

  const [recipesDiv] = makeRecipesDiv(recipes);

  usedInH3.addEventListener("click", () => {
    toggleMaxHeight(recipesDiv);
    usedInSvg.classList.toggle("rotated");
  });

  return [usedInH3, recipesDiv];
};

const makeRecipesDiv = (recipes) => {
  const recipesDiv = document.createElement("div");
  recipesDiv.classList.add("recipes-div", "result-transition");
  let baseRecipes = [];

  for (const recipe of recipes) {
    const recipeNameH4 = document.createElement("h4");
    recipeNameH4.innerText = recipe.name;

    const recipeNameSvg = createSmallSvg();
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

export { getRecipesElements, getUsedInElements, makeRecipesDiv };
