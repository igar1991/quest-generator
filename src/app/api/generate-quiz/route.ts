import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import { AgentRuntime, LocalSigner } from 'move-agent-kit'
import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network
} from '@aptos-labs/ts-sdk'

/**
 * Interface for the response from the OpenAI API
 */
interface OpenAIResponse {
  questions: Array<{
    title: string;
    description: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

/**
 * Interface for the request body
 */
interface RequestBody {
  topic: string;
  count: number;
}

/**
 * Handler for POST requests to generate quiz questions
 * @param request - The incoming request
 * @returns Response with generated quiz questions or error
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: RequestBody = await request.json();

    // Validate request body
    if (!body.topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Ensure count is within limits
    const count = Math.min(Math.max(1, body.count || 3), 20);

    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 },
      );
    }

    const aptosConfig = new AptosConfig({
      network: Network.MAINNET,
    });

    const aptos = new Aptos(aptosConfig);
    const account = Account.fromPrivateKey({ privateKey: Ed25519PrivateKey.generate(), legacy: false });
    const signer = new LocalSigner(account, Network.MAINNET);
    /**
     * MoveAgent will be the primary source of transactions and AI requests after the missing functions are implemented.
     * For now, an instance is created to specify the instance's location.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const agent = new AgentRuntime(signer, aptos, {
      OPENAI_API_KEY: apiKey
    });

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey,
    });

    // Call OpenAI API to generate quiz questions
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that generates quiz questions about specific topics. 
Generate ${count} multiple-choice quiz questions about "${body.topic}". 
Each question should have:
1. A short title (max 50 characters)
2. A brief description providing context (max 100 characters)
3. The question text (max 200 characters)
4. Four possible answer options
5. The correct answer (which must match exactly one of the options)

Format your response as a valid JSON object with a "questions" array containing each question object.
Each question object should have the fields: title, description, question, options (array of strings), and correctAnswer.
Keep your response concise and ensure the correctAnswer exactly matches one of the options.

IMPORTANT: Your entire response must be a valid JSON object. Start with { and end with }. Do not include any explanations, markdown formatting, or text outside the JSON.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 9500,
    });

    // Parse the response
    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json(
        { error: "Failed to generate quiz questions" },
        { status: 500 },
      );
    }

    try {
      // Parse the JSON response
      const parsedResponse: OpenAIResponse = JSON.parse(responseContent);

      // Add unique IDs and set type to 'quiz' for each question
      const formattedQuestions = parsedResponse.questions.map((question) => ({
        id: uuidv4(),
        type: "quiz" as const,
        ...question,
      }));

      // Return the formatted questions
      return NextResponse.json(
        {
          questions: formattedQuestions,
        },
        { status: 200 },
      );
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
