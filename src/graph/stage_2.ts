import type { Item, TopKCandidates } from "../types/state.js";

interface TeamSubgraphOutput {
  item: Item;
  topK: TopKCandidates;
}

export const receiveTeamResult = async (
  state: TeamSubgraphOutput
) => {
  console.log("receiveTeamResult received state:", JSON.stringify(state, null, 2));
  const { item, topK } = state;
  
  console.log("Extracted item:", item);
  console.log("Extracted topK:", topK);
  
  if (!item?.adgroupName) {
    console.error("Item is missing or has no adgroupName:", item);
    throw new Error("Missing item or adgroupName in team result");
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