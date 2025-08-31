import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { exec } from "child_process";


const listDirectoryTool = tool(async () => {
    const result = await exec("ls");
    return result.stdout;
}, {
    name: "listDirectory",
    description: "List the contents of a directory",
    schema: z.object({
        directory: z.string(),
    }),
});

const getCurrentDirectoryTool = tool(async () => {
    const result = await exec("pwd");
    return result.stdout;
}, {
    name: "getCurrentDirectory",
    description: "Get the current directory",
});

const changeDirectoryTool = tool(async ({ directory }: { directory: string }) => {
    const result = await exec(`cd ${directory}`);
    return result.stdout;
}, {
    name: "changeDirectory",
    description: "Change the current directory",
});

const cliTools = [listDirectoryTool, getCurrentDirectoryTool, changeDirectoryTool];

export default cliTools;