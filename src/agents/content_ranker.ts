// Simple rankers: score by rules / another LLM call
import { Runnable } from "@langchain/core/runnables";

const scoreWithHeuristicsOrLLM = async (candidates: string[]) => {
    return candidates.map((candidate) => ({ text: candidate, score: Math.random() }));
};

type HeadlineCandidates = {
    headlines: string[];
}

export const rankHeadlines: Runnable<HeadlineCandidates> = async ({ candidates }: { candidates: HeadlineCandidates }) => {
    console.log("[RankHeadlines] Scoring headlines...");
    const scored = await scoreWithHeuristicsOrLLM(candidates.headlines);
    return {
      candidates: { headlines: scored.sort((a, b) => b.score - a.score) },
    };
};

type DescriptionCandidates = {
    descriptions: string[];
}

export const rankDescriptions: Runnable = async ({ candidates }: { candidates: DescriptionCandidates }) => {
    console.log("[RankDescriptions] Scoring descriptions...");
    const scored = await scoreWithHeuristicsOrLLM(candidates.descriptions);
    return {
        candidates: { descriptions: scored.sort((a, b) => b.score - a.score) },
    };
};

type CalloutCandidates = {
    callouts: string[];
}

export const rankCallouts: Runnable = async ({ candidates }: { candidates: CalloutCandidates }) => {
    console.log("[RankCallouts] Scoring callouts...");
    const scored = await scoreWithHeuristicsOrLLM(candidates.callouts);
    return {
        candidates: { callouts: scored.sort((a, b) => b.score - a.score) },
    };
};