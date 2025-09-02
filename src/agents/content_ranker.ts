// Simple rankers: score by rules / another LLM call
import type { ItemState } from "../types/state.js";

const scoreWithHeuristicsOrLLM = async (candidates: string[]): Promise<Array<{ text: string; score: number }>> => {
    return candidates.map((candidate) => ({ text: candidate, score: Math.random() })).filter((a) => Boolean(a.text));
};

export const rankHeadlines = async (state: typeof ItemState.State) => {
    console.log("[RankHeadlines] Scoring headlines...");
    const scored = await scoreWithHeuristicsOrLLM(state.candidates.headlines);
    return {
      candidates: { headlines: scored.sort((a, b) => b.score - a.score).map((a) => a.text) },
    };
};

export const rankDescriptions = async (state: typeof ItemState.State) => {
    console.log("[RankDescriptions] Scoring descriptions...");
    const scored = await scoreWithHeuristicsOrLLM(state.candidates.descriptions);
    return {
        candidates: { descriptions: scored.sort((a, b) => b.score - a.score).map((a) => a.text) },
    };
};

export const rankCallouts = async (state: typeof ItemState.State) => {
    console.log("[RankCallouts] Scoring callouts...");
    const scored = await scoreWithHeuristicsOrLLM(state.candidates.callouts);
    return {
        candidates: { callouts: scored.sort((a, b) => b.score - a.score).map((a) => a.text) },
    };
};