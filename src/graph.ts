import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { cliNode } from "./agents/cliAgent.js";

const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (prev: BaseMessage[], next: BaseMessage[]) => [...prev, ...next],
        default: () => [],
    }),
    currentDirectory: Annotation<string>({
        reducer: (prev: string, next: string) => prev + "/" + next,
        default: () => "",
    }),
    files: Annotation<string[]>({
        reducer: (prev: string[], next: string[]) => [...prev, ...next],
        default: () => [],
    })
});

export type AgentStateType = typeof AgentState.State;

export const workflowGraph = new StateGraph(AgentState)
    .addNode("cli", cliNode)
    .addEdge(START, "cli")
    .addEdge("cli", END);

export const graph = workflowGraph.compile();