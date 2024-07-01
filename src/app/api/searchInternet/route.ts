import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";

export async function POST(req: Request) {
  const { input } = await req.json();
  const tools = [new TavilySearchResults({ maxResults: 1 })];
  const prompt = await pull<ChatPromptTemplate>(
    "hwchase17/openai-functions-agent"
  );
  const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo-1106",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY
  });
  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
  });
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });
  try {
    console.log("hi");
    const result = await agentExecutor.invoke({
      input: "What is Anthropic's estimated revenue for 2024?",
    });
    console.log("hi2");
    if (!result) {
      return Response.json(
        {
          success: false,
          message: "No results available",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: result,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error
      },
      {
        status: 400,
      }
    );
  }
}
