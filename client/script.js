const baseRecipeCall = async () => {
  console.log("Base recipes");
  const response = await fetch('http://localhost:3000/baseRecipes.json');
  const data = await response.json();
  console.log(data); 
}

const alternateRecipeCall = async () => {
  console.log("Alternate recipes");
  const response = await fetch('http://localhost:3000/alternateRecipes.json');
  const data = await response.json();
  console.log(data); 
}