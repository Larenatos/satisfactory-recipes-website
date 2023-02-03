import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

const newData = {};
let tempValues = [];

for (const [key, value] of Object.entries(data)) {
  newData[key] = {};
  tempValues.push(value);
  break;
}

for (const [k, v] of Object.entries(tempValues[0])) {
  if (v["inMachine"]) {
    newData["recipes"][v["slug"]] = {
      name: v["name"],
      time: v["time"],
      ingredients: v["ingredients"],
      products: v["products"],
      producedIn: v["producedIn"],
    };
  }
}

let finalData = JSON.stringify(newData, null, 2);
fs.writeFileSync("newData.json", finalData);
