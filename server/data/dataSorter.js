import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

const newData = {};
let tempValues = [];

let count = 0;
for (const [key, value] of Object.entries(data)) {
  if (count == 2) {
    break;
  }
  newData[key] = {};
  tempValues.push(value);
  count++;
}

for (const [k, v] of Object.entries(tempValues[0])) {
  if (v["inMachine"]) {
    newData["recipes"][v["name"]] = {
      name: v["name"],
      time: v["time"],
      ingredients: [],
      products: [],
      producedIn: v["producedIn"],
    };

    for (const ingredient of v["ingredients"]) {
      newData["recipes"][v["name"]]["ingredients"].push({
        item: tempValues[1][ingredient["item"]]["name"],
        amount: ingredient["amount"],
      });
    }

    for (const product of v["products"]) {
      newData["recipes"][v["name"]]["products"].push({
        item: tempValues[1][product["item"]]["name"],
        amount: product["amount"],
      });
    }
  }
}

let finalData = JSON.stringify(newData, null, 2);
fs.writeFileSync("newData.json", finalData);
