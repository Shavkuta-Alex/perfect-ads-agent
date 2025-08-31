import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const llm = new ChatOpenAI({
    model: "gpt-4o-2024-05-13",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY!,
});

export default llm;