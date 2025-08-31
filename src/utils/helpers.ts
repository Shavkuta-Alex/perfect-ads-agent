import { HumanMessage } from "@langchain/core/messages";
import type { Runnable, RunnableConfig } from "@langchain/core/runnables";
import type { AgentStateType } from "../graph.js";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import type { ChatOpenAI } from "@langchain/openai";
import type { StructuredTool } from "@langchain/core/tools";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";

export async function runAgentNode(props: {
    state: AgentStateType;
    agent: Runnable;
    name: string;
    config?: RunnableConfig;
  }) {
    const { state, agent, name, config } = props;
    let result = await agent.invoke(state, config);
    // We convert the agent output into a format that is suitable
    // to append to the global state
    if (!result?.tool_calls || result.tool_calls.length === 0) {
      // If the agent is NOT calling a tool, we want it to
      // look like a human message.
      result = new HumanMessage({ ...result, name: name });
    }
    return {
      messages: [result],
      // Since we have a strict workflow, we can
      // track the sender so we know who to pass to next.
      sender: name,
    };
  }

  export async function createAgent({
    llm,
    tools,
    systemMessage,
  }: {
    llm: ChatOpenAI;
    tools: StructuredTool[];
    systemMessage: string;
  }): Promise<Runnable> {
    const toolNames = tools.map((tool) => tool.name).join(", ");
    const formattedTools = tools.map((t) => convertToOpenAITool(t));
  
    let prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful AI assistant, collaborating with other assistants." +
        " Use the provided tools to progress towards answering the question." +
        " If you are unable to fully answer, that's OK, another assistant with different tools " +
        " will help where you left off. Execute what you can to make progress." +
        " If you or any of the other assistants have the final answer or deliverable," +
        " prefix your response with FINAL ANSWER so the team knows to stop." +
        " You have access to the following tools: {tool_names}.\n{system_message}",
      ],
      new MessagesPlaceholder("messages"),
    ]);
    prompt = await prompt.partial({
      system_message: systemMessage,
      tool_names: toolNames,
    });
  
    return prompt.pipe(llm.bind({ tools: formattedTools }));
  }