// graph/main.ts
import { END, Send, START, StateGraph } from "@langchain/langgraph";
import { filterBlacklisted, removeDuplicates } from "./graph/stage_1.js";
import { composeFinalAdGroups } from "./graph/stage_3.js";
import { buildTeamSubgraph } from "./graph/team_subgraph.js";
import { OverallState } from "./types/state.js";

const teamSubgraph = buildTeamSubgraph();

const generateContent = (state: typeof OverallState.State) => {
  return state.preppedItems.map(
    (item) => new Send("contentGenerationTeam", { item }))
}

const g = new StateGraph(OverallState)
  .addNode("removeDuplicates", removeDuplicates)
  .addNode("filterBlacklisted", filterBlacklisted)
  .addNode("contentGenerationTeam", teamSubgraph)
  .addNode("composeFinalAdGroups", composeFinalAdGroups)

  .addEdge(START, "removeDuplicates")
  .addEdge("removeDuplicates", "filterBlacklisted")
  .addConditionalEdges("filterBlacklisted", (state) => {
    // This would create a single path instead of parallel paths
    return state.preppedItems.length > 0 ? generateContent(state) : "composeFinalAdGroups";
  })
  .addEdge("contentGenerationTeam", "composeFinalAdGroups")
  .addEdge("composeFinalAdGroups", END);

export const graph = g.compile();
