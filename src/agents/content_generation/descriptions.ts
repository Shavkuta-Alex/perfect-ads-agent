import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import llm from "../../llm.js";
import type { Item } from "../../types/state.js";
import { systemPrompt } from "./prompts.js";

const DescriptionCandidates = z.object({
    descriptions: z.array(z.string()),
});

const descriptionPromptMessages = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["user", "Generate 20 description variants for: {title}. Return them as a JSON object with a 'descriptions' array containing strings."],
]);

export const genDescriptions: Runnable = RunnableSequence.from([
  async ({ item }: { item: Item }) => {
    console.log("[GenDescriptions] Generating descriptions for:", item.adgroupName);
    return { title: item.adgroupName || "product" };
  },
  descriptionPromptMessages,
  llm,
  async (response) => {
    try {
      const content = response.content;
      const parsed = JSON.parse(content);
      
      const validated = DescriptionCandidates.parse(parsed);
      const onlyWithValue = validated.descriptions.filter((description) => Boolean(description));
      return { candidates: { descriptions: onlyWithValue } };
    } catch (error) {
      console.error("[GenDescriptions] JSON parsing error:", error);
      console.error("[GenDescriptions] Raw content:", response.content);

      return { candidates: { descriptions: [] } };
    }
  },
]);
