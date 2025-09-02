import { setMaxListeners } from "events";
import { graph } from "./main.js";

setMaxListeners(50);

const inputData = {
  rawItems: [{ adgroupName: "air frier" }, { adgroupName: "vacuum cleaner" }, { adgroupName: "hair dryer" }],
  blacklist:[],
};

const startTime = Date.now();

const result = await graph.invoke(inputData);

console.log(`Execution completed in ${Date.now() - startTime} seconds`); 
console.log(result);
  