import type { ItemState } from "../types/state.js";

export const receiveTeamResult = async (
  state: typeof ItemState.State
) => {
  console.log("receiveTeamResult received state keys:", Object.keys(state));
  console.log("receiveTeamResult item:", state.item);
  console.log("receiveTeamResult topK:", state.topK);
  
  const { item, topK } = state;
  
  if (!item?.adgroupName) {
    console.error("Item is missing or has no adgroupName:", item);
    console.error("Full state keys:", Object.keys(state));
    throw new Error("Missing item or adgroupName in team result");
  }
  
  if (!topK) {
    console.error("TopK is missing:", topK);
    throw new Error("Missing topK in team result");
  }
  
  return {
    teamResults: {
      [item.adgroupName]: { 
        adgroupName: item.adgroupName,
        topK,
      },
    },
    events: [`team done: ${item.adgroupName}`],
  };
};