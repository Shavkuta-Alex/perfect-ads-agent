import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import llm from "../../llm.js";
import type { Item } from "../../types/state.js";

const DescriptionCandidates = z.object({
    descriptions: z.array(z.string()),
});

const descriptionPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a PPC copywriter. You must respond with valid JSON only. Generate compelling ad descriptions for Google Ads."],
  ["user", "Generate 20 description variants for: {title}. Return them as a JSON object with a 'descriptions' array containing strings."],
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
  llm,
  async (response) => {
    console.log("[GenDescriptions] Raw LLM response:", response);
    try {
      // Parse the JSON content from the LLM response
      const content = response.content;
      const parsed = JSON.parse(content);
      console.log("[GenDescriptions] Parsed JSON:", parsed);
      
      // Validate against schema
      const validated = DescriptionCandidates.parse(parsed);
      return { candidates: { descriptions: validated.descriptions } };
    } catch (error) {
      console.error("[GenDescriptions] JSON parsing error:", error);
      console.error("[GenDescriptions] Raw content:", response.content);
      // Fallback with sample data
      return { candidates: { descriptions: [] } };
    }
  },
]);
