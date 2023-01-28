const baseRecipeCall = async () => {
  console.log("Base recipes");
  const response = await fetch('http://localhost:3000/base');
  const data = await response.json();
  console.log(data); 
}