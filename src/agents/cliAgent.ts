import type { RunnableConfig } from "@langchain/core/runnables";
import { createAgent, runAgentNode } from "../utils/helpers.js";
import llm from "../llm.js";
import type { AgentStateType } from "../graph.js";
import cliTools from "../tools/cli.js";

const cliAgent = await createAgent({
  llm,
  tools: cliTools,
  systemMessage: "You are a helpful assistant that can help with CLI commands.",
});

export async function cliNode(state: AgentStateType, config: RunnableConfig) {
  return runAgentNode({
    state: state,
    agent: cliAgent,
    name: "CLI",
    config,
  });
}
