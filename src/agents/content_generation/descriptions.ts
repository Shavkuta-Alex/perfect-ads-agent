import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import llm from "../../llm.js";
import type { Item } from "../../types/state.js";

const DescriptionCandidates = z.object({
    descriptions: z.array(z.string()),
});

const descriptionPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a PPC copywriter..."],
  ["user", "Generate 100 description variants for: {title}."],
]);

export const genDescriptions: Runnable = RunnableSequence.from([
  ({ item }: { item: Item }) => {
    console.log(
      `[GenDescriptions] Generating descriptions for adgroup ${item.adgroupName}...`
    );
    return { item };
  },
  async ({ item }: { item: Item }) => ({
    title: item.adgroupName || "product",
  }),
  descriptionPrompt,
  llm.withStructuredOutput(DescriptionCandidates),
  async (out) => {
    console.log("[GenDescriptions] LLM output:", out);
    return { candidates: { descriptions: out.descriptions } };
  },
]);
