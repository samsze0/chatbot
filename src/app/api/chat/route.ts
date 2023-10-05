import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Edge friendly OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");

  if (!model) return new Response("Missing model parameter", { status: 400 });

  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model,
    stream: true,
    messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
