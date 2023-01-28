import fs from "fs";

const baseRecipeCall = () => {
  console.log("Base recipes");
  const data = JSON.parse(fs.readFileSync("http://localhost:3000/baseRecipes.json"));
  console.log(data); 
}