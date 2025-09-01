import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import llm from "../../llm.js";
import type { Item } from "../../types/state.js";

const HeadlineCandidates = z.object({
    headlines: z.array(z.string()),
});

const headlinePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a PPC copywriter. You must respond with valid JSON only. Generate creative, compelling headlines for Google Ads."],
  ["user", "Generate 20 headline variants for: {title}. Return them as a JSON object with a 'headlines' array containing strings."],
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
  llm,
  async (response) => {
    console.log("[GenHeadlines] Raw LLM response:", response);
    try {
      // Parse the JSON content from the LLM response
      const content = response.content;
      const parsed = JSON.parse(content);
      console.log("[GenHeadlines] Parsed JSON:", parsed);
      
      // Validate against schema
      const validated = HeadlineCandidates.parse(parsed);
      return { candidates: { headlines: validated.headlines } };
    } catch (error) {
      console.error("[GenHeadlines] JSON parsing error:", error);
      console.error("[GenHeadlines] Raw content:", response.content);
      // Fallback with sample data
      return { candidates: { headlines: [] } };
    }
  },
]);
