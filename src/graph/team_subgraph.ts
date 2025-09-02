import { END, START, StateGraph } from "@langchain/langgraph";
import {
  genCallouts,
  genDescriptions,
  genHeadlines,
} from "../agents/content_generation/index.js";
import {
  rankCallouts,
  rankDescriptions,
  rankHeadlines,
} from "../agents/content_ranker.js";
import { ItemState, type TopKCandidates } from "../types/state.js";

export function buildTeamSubgraph() {
  const g = new StateGraph(ItemState)
    .addNode("initialize_candidates", async ({ item }) => {
      return {
        candidates: { headlines: [], descriptions: [], callouts: [] },
        item,
      };
    })
    .addNode("generate_headlines", async (state) => {
      console.log("[Generate Headlines] Starting for:", state.item.adgroupName);
      const result = await genHeadlines.invoke(state);
      return result;
    })
    .addNode("generate_descriptions", async (state) => {
      console.log("[Generate Descriptions] Starting for:", state.item.adgroupName);
      const result = await genDescriptions.invoke(state);
      return result;
    })
    .addNode("generate_callouts", async (state) => {
      console.log("[Generate Callouts] Starting for:", state.item.adgroupName);
      const result = await genCallouts.invoke(state);
      return result;
    })
    .addNode("rank_headlines", rankHeadlines)
    .addNode("rank_descriptions", rankDescriptions)
    .addNode("rank_callouts", rankCallouts)
    .addNode("select_top_k", async ({ item, candidates }) => {
      console.log("[TeamTopK] Generating top K candidates...");
      console.log("[TeamTopK] Candidates:", candidates);
      const topK: TopKCandidates = {
        headlines: candidates.headlines.slice(0, 5),
        descriptions: candidates.descriptions.slice(0, 5),
        callouts: candidates.callouts.slice(0, 5),
      };
      
      // Return data that will be merged into the parent state
      return { 
        topK, 
        item,
        teamResults: {
          [item.adgroupName]: { 
            adgroupName: item.adgroupName,
            topK,
          },
        },
        events: [`team done: ${item.adgroupName}`],
      };
    })
    .addEdge(START, "initialize_candidates")
    .addEdge("initialize_candidates", "generate_headlines")
    .addEdge("initialize_candidates", "generate_descriptions")
    .addEdge("initialize_candidates", "generate_callouts")
    .addEdge("generate_headlines", "rank_headlines")
    .addEdge("generate_descriptions", "rank_descriptions")
    .addEdge("generate_callouts", "rank_callouts")
    .addEdge(["rank_headlines", "rank_descriptions", "rank_callouts"], "select_top_k")
    .addEdge("select_top_k", END);

  return g.compile();
}
