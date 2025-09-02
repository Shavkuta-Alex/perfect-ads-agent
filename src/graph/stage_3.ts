import { OverallState } from "../types/state.js";

export const composeFinalAdGroups = async (state: typeof OverallState.State) => {
  console.log("[Stage 3] Completing ad group...");
  
  const finals = Object.values(state.teamResults || {}).map((item) => ({
    adgroupName: item.adgroupName,
    headlines: item.topK.headlines,
    descriptions: item.topK.descriptions,
    callouts: item.topK.callouts,
  }));
  
  return { finalAdGroups: finals, events: [`stage3 completed: ${finals.length}`] };
};