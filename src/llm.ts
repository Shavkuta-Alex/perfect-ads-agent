import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const openai = new ChatOpenAI({
    model: "gpt-4o-2024-05-13",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY!,
    maxConcurrency: 5,
    maxRetries: 2,
});

const ollama = new ChatOllama({
    model: "llama3.2",
    temperature: 0,
    maxConcurrency: 5,
    maxRetries: 2,
});

export default ollama;