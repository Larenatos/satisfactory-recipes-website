import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

let baseRecipes = {};
let alternateRecipes = {};

for (const [k, v] of Object.entries(data["recipes"])) {
  if (v["inMachine"] || v["inHand"] || v["inWorkshop"]) {
  }
  for (const recipe of value) {
    if (recipe["name"].includes("Alternate")) {
      if (!(key in alternateRecipes)) {
        alternateRecipes[key] = [];
      }
      alternateRecipes[key].push(recipe);
    } else {
      baseRecipes[key] = [];
      baseRecipes[key].push(recipe);
    }
  }
}

let baseRecipesData = JSON.stringify(baseRecipes, null, 2);
fs.writeFileSync("baseRecipes.json", baseRecipesData);

let alternateRecipesData = JSON.stringify(alternateRecipes, null, 2);
fs.writeFileSync("alternateRecipes.json", alternateRecipesData);
