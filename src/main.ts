// graph/main.ts
import { END, Send, START, StateGraph } from "@langchain/langgraph";
import { filterBlacklisted, removeDuplicates } from "./graph/stage_1.js";
import { receiveTeamResult } from "./graph/stage_2.js";
import { completeAdGroup } from "./graph/stage_3.js";
import { buildTeamSubgraph } from "./graph/team_subgraph.js";
import { OverallState } from "./types/state.js";

export function buildMainGraph() {
  const teamSubgraph = buildTeamSubgraph();

  const g = new StateGraph(OverallState)
    .addNode("removeDuplicates", removeDuplicates)
    .addNode("filterBlacklisted", filterBlacklisted)
    .addNode("team", teamSubgraph)
    .addNode("receiveTeam", receiveTeamResult)
    .addNode("complete", completeAdGroup)

    .addEdge(START, "removeDuplicates")
    .addEdge("removeDuplicates", "filterBlacklisted")
    .addConditionalEdges("filterBlacklisted", (state) => {
      return (state.preppedItems || []).map(
        (item) =>
          new Send("team", {
            item,
            candidates: { headlines: [], descriptions: [], callouts: [] },
          })
      );
    })
    .addEdge("team", "receiveTeam")
    .addEdge("receiveTeam", "complete")
    .addEdge("complete", END);
    
  return g.compile();
}
