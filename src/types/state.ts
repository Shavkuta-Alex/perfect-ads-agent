import { Annotation } from "@langchain/langgraph";
import { reducers } from "./reducers.js";

export type Candidates = {
  headlines: string[];
  descriptions: string[];
  callouts: string[];
};

export type TopKCandidates = {
  headlines: string[];
  descriptions: string[];
  callouts: string[];
};

export type TeamOutput = {
  adgroupName: string;
  topK: TopKCandidates;
};

export type FinalAdGroup = {
  adgroupName: string;
  headlines: string[];
  descriptions: string[];
  callouts: string[];
};

export type Item = {
  adgroupName: string;
};

export const OverallState = Annotation.Root({
  rawItems: Annotation<Array<Item>>(),
  blacklist: Annotation<string[]>(),
  preppedItems: Annotation<Array<Item>>(),
  teamResults: Annotation<Record<string, TeamOutput>>(reducers.teamResults),
  finalAdGroups: Annotation<Array<FinalAdGroup>>(reducers.finalAdGroups),
  events: Annotation<string[]>(reducers.events),
});

export const ItemState = Annotation.Root({
  item: Annotation<Item>(),
  candidates: Annotation<Candidates>(reducers.candidates),
  topK: Annotation<TopKCandidates>(),
  teamResults: Annotation<Record<string, TeamOutput>>(reducers.teamResults),
  events: Annotation<string[]>(reducers.events),
});