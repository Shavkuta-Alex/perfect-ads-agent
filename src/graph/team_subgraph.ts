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
    .addNode("genHeadlines", genHeadlines)
    .addNode("genDescriptions", genDescriptions)
    .addNode("genCallouts", genCallouts)
    .addNode("rankHeadlines", rankHeadlines)
    .addNode("rankDescriptions", rankDescriptions)
    .addNode("rankCallouts", rankCallouts)
    .addNode("teamTopK", async ({ item, candidates }) => {
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
    .addEdge(START, "genHeadlines")
    .addEdge(START, "genDescriptions")
    .addEdge(START, "genCallouts")
    .addEdge("genHeadlines", "rankHeadlines")
    .addEdge("genDescriptions", "rankDescriptions")
    .addEdge("genCallouts", "rankCallouts")
    .addEdge(["rankHeadlines", "rankDescriptions", "rankCallouts"], "teamTopK")
    .addEdge("teamTopK", END);

  return g.compile();
}
