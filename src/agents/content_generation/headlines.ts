import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import llm from "../../llm.js";
import type { Item } from "../../types/state.js";

const HeadlineCandidates = z.object({
    headlines: z.array(z.string()),
});

const headlinePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a PPC copywriter..."],
  ["user", "Generate 100 headline variants for: {title}."],
]);

export const genHeadlines: Runnable = RunnableSequence.from([
  ({ item }: { item: Item }) => {
    console.log(
      `[GenHeadlines] Generating headlines for adgroup ${item.adgroupName}...`
    );
    return { item };
  },
  async ({ item }: { item: Item }) => ({
    title: item.adgroupName || "product",
  }),
  headlinePrompt,
  llm.withStructuredOutput(HeadlineCandidates),
  async (out) => {
    console.log("[GenHeadlines] LLM output:", out);
    return { candidates: { headlines: out.headlines } };
  },
]);
