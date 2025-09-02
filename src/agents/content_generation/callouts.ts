import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import llm from "../../llm.js";
import type { Item } from "../../types/state.js";
import { systemPrompt } from "./prompts.js";

const CalloutCandidates = z.object({
    callouts: z.array(z.string()),
});

const calloutPromptMessages = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["user", "Generate 20 callout variants for: {title}. Return them as a JSON object with a 'callouts' array containing strings."],
]);

export const genCallouts: Runnable = RunnableSequence.from([
  async ({ item }: { item: Item }) => {
    console.log("[GenCallouts] Generating callouts for:", item.adgroupName);
    return { title: item.adgroupName || "product" };
  },
  calloutPromptMessages,
  llm,
  async (response) => {
    try {
      const content = response.content;
      const parsed = JSON.parse(content);
      
      const validated = CalloutCandidates.parse(parsed);
      const onlyWithValue = validated.callouts.filter((callout) => Boolean(callout));
      return { candidates: { callouts: onlyWithValue } };
    } catch (error) {
      console.error("[GenCallouts] JSON parsing error:", error);
      console.error("[GenCallouts] Raw content:", response.content);
      
      return { candidates: { callouts: [] } };
    }
  },
]).withConfig({
  tags: ["generate_callouts"],
});
