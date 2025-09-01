import { buildMainGraph } from "./main.js";
import { setMaxListeners } from "events";

setMaxListeners(50);

const app = buildMainGraph();

const inputData = {
  rawItems: [{ adgroupName: "air frier" }, { adgroupName: "vacuum cleaner" }, { adgroupName: "hair dryer" }],
  blacklist:[],
};

const startTime = Date.now();

const result = await app.invoke(inputData);

console.log(`Execution completed in ${Date.now() - startTime} seconds`); 
console.log(result);
  