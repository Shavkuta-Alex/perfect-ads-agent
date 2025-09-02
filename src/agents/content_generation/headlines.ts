import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import llm from "../../llm.js";
import type { Item } from "../../types/state.js";
import { systemPrompt } from "./prompts.js";

const HeadlineCandidates = z.object({
    headlines: z.array(z.string()),
});

const headlinePromptMessages = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["user", "Generate 20 headline variants for: {title}. Return them as a JSON object with a 'headlines' array containing strings."],
]);

export const genHeadlines: Runnable = RunnableSequence.from([
  async ({ item }: { item: Item }) => {
    console.log("[GenHeadlines] Generating headlines for:", item.adgroupName);
    return { title: item.adgroupName || "product" };
  },
  headlinePromptMessages,
  llm,
  async (response) => {
    try {
      const content = response.content;
      const parsed = JSON.parse(content);
      
      const validated = HeadlineCandidates.parse(parsed);
      const onlyWithValue = validated.headlines.filter((headline) => Boolean(headline));
      console.log("[GenHeadlines] Only with value:", onlyWithValue);
      return { candidates: { headlines: onlyWithValue } };
    } catch (error) {
      console.error("[GenHeadlines] JSON parsing error:", error);
      console.error("[GenHeadlines] Raw content:", response.content);

      return { candidates: { headlines: [] } };
    }
  },
]);
