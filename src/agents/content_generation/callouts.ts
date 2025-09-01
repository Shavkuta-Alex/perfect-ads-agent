import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
import llm from "../../llm.js";
import type { Item } from "../../types/state.js";

const CalloutCandidates = z.object({
    callouts: z.array(z.string()),
});

const calloutPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a PPC copywriter..."],
  ["user", "Generate 100 callout variants for: {title}."],
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
  async (out) => ({ candidates: { callouts: out.callouts } }),
]);
