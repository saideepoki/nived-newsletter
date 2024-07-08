import { ChatMistralAI, MistralAIEmbeddings } from "@langchain/mistralai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { SerpAPILoader } from "@langchain/community/document_loaders/web/serpapi";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
export async function POST(req: Request) {
  const { input } = await req.json();
  const apiKey = process.env.SERP_API_KEY;
  const query = "blockchain technology, cryptocurrency trends, stock market news 2024";
  const question = input;
  const embeddings = new MistralAIEmbeddings();

  // Use SerpAPILoader to load web search results
const loader = new SerpAPILoader({ q: query, apiKey });
const docs = await loader.load();

// Use MemoryVectorStore to store the loaded documents in memory
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// const prompt = await pull<ChatPromptTemplate>("hwchase17/openai-functions-agent");
const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's questions based on the below context:\n\n{context}",
  ],
  ["human", "{input}"],
]);

  const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    maxTokens: 1000
  });

  // const agent = await createToolCallingAgent({
  //   llm,
  //   tools: tools2,
  //   prompt,
  // });

  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt: questionAnsweringPrompt,
  });

  const chain = await createRetrievalChain({
    retriever: vectorStore.asRetriever(),
    combineDocsChain,
  });

  try {
    console.log("hi");
    const res = await chain.invoke({
      input: question,
    });
    console.log("hi2");
    if (!res) {
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
        message: res.answer,
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
