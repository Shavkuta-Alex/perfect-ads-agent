import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import llm from "../../llm.js";
import type { Item } from "../../types/state.js";

const CalloutCandidates = z.object({
    callouts: z.array(z.string()),
});

const calloutPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a PPC copywriter. You must respond with valid JSON only. Generate catchy callouts for Google Ads."],
  ["user", "Generate 20 callout variants for: {title}. Return them as a JSON object with a 'callouts' array containing strings."],
]);

export const genCallouts: Runnable = RunnableSequence.from([
  ({ item }: { item: Item }) => {
    console.log(
      `[GenCallouts] Generating callouts for adgroup ${item.adgroupName}...`
    );
    return { item };
  },
  async ({ item }: { item: Item }) => {
    // Debug: Check what is being sent to the LLM
    console.log("[GenCallouts] Prompt input:", { title: item.adgroupName || "product" });
    return { title: item.adgroupName || "product" };
  },
  calloutPrompt,
  llm,
  async (response) => {
    console.log("[GenCallouts] Raw LLM response:", response);
    try {
      // Parse the JSON content from the LLM response
      const content = response.content;
      const parsed = JSON.parse(content);
      console.log("[GenCallouts] Parsed JSON:", parsed);
      
      // Validate against schema
      const validated = CalloutCandidates.parse(parsed);
      return { candidates: { callouts: validated.callouts } };
    } catch (error) {
      console.error("[GenCallouts] JSON parsing error:", error);
      console.error("[GenCallouts] Raw content:", response.content);
      // Fallback with sample data
      return { candidates: { callouts: [] } };
    }
  },
]);
