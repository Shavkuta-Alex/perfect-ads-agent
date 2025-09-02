// Simple rankers: score by rules / another LLM call
import type { ItemState } from "../types/state.js";

const scoreWithHeuristicsOrLLM = async (
  candidates: string[]
): Promise<Array<{ text: string; score: number }>> => {
  return candidates.map((candidate) => ({
    text: candidate,
    score: Math.random(),
  }));
};

const rankContent = async (candidates: string[]): Promise<Array<string>> => {
  const scored = await scoreWithHeuristicsOrLLM(candidates);
  const sorted = scored.sort((a, b) => b.score - a.score);
  const content = sorted.map((a) => a.text).filter((a) => Boolean(a));

  return content;
};

export const rankHeadlines = async (state: typeof ItemState.State) => {
  console.log("[RankHeadlines] Scoring headlines...");
  const headlines = await rankContent(state.candidates.headlines);

  return {
    candidates: {
      headlines,
    },
  };
};

export const rankDescriptions = async (state: typeof ItemState.State) => {
  console.log("[RankDescriptions] Scoring descriptions...");
  const descriptions = await rankContent(state.candidates.descriptions);

  return {
    candidates: {
      descriptions,
    },
  };
};

export const rankCallouts = async (state: typeof ItemState.State) => {
  console.log("[RankCallouts] Scoring callouts...");
  const callouts = await rankContent(state.candidates.callouts);

  return {
    candidates: {
      callouts,
    },
  };
};
