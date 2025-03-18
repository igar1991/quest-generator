import { NextResponse } from "next/server";
import { validateQuest } from "../../../utils/validateQuest";
import { createQuest } from "../../../../backend/services/questService";
import { connectToRedis } from "../../../../backend/utils/redis";

// Ensure Redis is connected
let redisConnected = false;

/**
 * Initialize Redis connection
 */
async function initRedis() {
  if (!redisConnected) {
    try {
      await connectToRedis();
      redisConnected = true;
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
    }
  }
}

/**
 * Create a new quest
 * POST /api/quests
 * @param request - The request object containing the quest data
 * @returns Response with created quest or error
 */
export async function POST(request: Request) {
  try {
    // Ensure Redis is connected
    await initRedis();

    // Parse request body
    const questData = await request.json();

    // Validate quest data
    const validationResult = validateQuest(questData);

    if (!validationResult.isValid) {
      return NextResponse.json(validationResult, { status: 400 });
    }

    // Create quest in Redis
    const createdQuest = await createQuest(questData);

    return NextResponse.json(createdQuest, { status: 201 });
  } catch (error) {
    console.error("Error creating quest:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}

/**
 * Get all quests
 * GET /api/quests
 * @returns Response with all quests
 */
export async function GET() {
  try {
    // Ensure Redis is connected
    await initRedis();

    return NextResponse.json(
      { message: "Quest retrieval not implemented" },
      { status: 501 },
    );
  } catch (error) {
    console.error("Error retrieving quests:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
