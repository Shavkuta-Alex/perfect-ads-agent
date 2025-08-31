import { HumanMessage } from "@langchain/core/messages";
import { graph } from "./graph.js";

const streamResults = await graph.stream(
  {
    messages: [
      new HumanMessage({
        content: "List the contents of the current directory.",
      }),
    ],
  },
  { recursionLimit: 15 }
);

const prettifyOutput = (output: Record<string, any>) => {
  const keys = Object.keys(output);
  const firstItem = output[keys[0] as keyof typeof output];

  if ("messages" in firstItem && Array.isArray(firstItem.messages)) {
    const lastMessage = firstItem.messages[firstItem.messages.length - 1];
    console.dir(
      {
        type: lastMessage._getType(),
        content: lastMessage.content,
        tool_calls: lastMessage.tool_calls,
      },
      { depth: null }
    );
  }

  if ("sender" in firstItem) {
    console.log({
      sender: firstItem.sender,
    });
  }
};

for await (const output of await streamResults) {
  if (!output?.__end__) {
    prettifyOutput(output);
    console.log("----");
  }
}
