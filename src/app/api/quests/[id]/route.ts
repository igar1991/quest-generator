import { NextResponse } from "next/server";
import { getQuestById } from "../../../../../backend/services/questService";
import { connectToRedis } from "../../../../../backend/utils/redis";
import { getRedisClient } from "../../../../../backend/utils/redis";

// Ensure Redis is connected
let redisConnected = false;

/**
 * Initialize Redis connection
 */
async function initRedis() {
  if (!redisConnected) {
    try {
      console.log("Connecting to Redis in quest API");
      await connectToRedis();
      redisConnected = true;
      console.log("Redis connection successful");
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }
}

/**
 * Get a quest by ID
 * GET /api/quests/:id
 * @param request - The request object
 * @param context - Object containing route parameters
 * @returns Response with quest data or error
 */
export async function GET(request: Request, context: any) {
  const { params } = context;
  console.log(`API: Fetching quest with ID: ${params.id}`);

  try {
    // Ensure Redis is connected with a timeout
    try {
      console.log("Connecting to Redis in quest API");
      const connectPromise = initRedis();

      // Add a timeout for Redis connection
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Redis connection timeout"));
        }, 5000); // 5 second timeout
      });

      await Promise.race([connectPromise, timeoutPromise]);
      console.log("Redis connection successful");
    } catch (error) {
      console.error("Redis connection failed:", error);
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 503 },
      );
    }

    // Extract quest ID from the URL
    const questId = params.id;

    if (!questId) {
      console.log("Quest ID is required");
      return NextResponse.json(
        { error: "Quest ID is required" },
        { status: 400 },
      );
    }

    console.log(`Fetching quest data for ID: ${questId}`);
    // Get quest from Redis
    let quest = null;

    // Special handling for known problematic quest ID
    if (questId === "4502f970-6e1a-4070-84f3-77dac6f689a2") {
      console.log("Special handling for known problematic quest ID");
      try {
        // Try to get the client first to ensure connection
        const client = await getRedisClient();

        // Try to get from quest:all set
        const exists = await client.sismember("quests:all", questId);
        if (Boolean(exists)) {
          await client.sadd("quests:all", questId);
          console.log(`Added ${questId} to quests:all set`);
        }

        // Try direct Redis commands
        const questData = await client.hget(`quests:${questId}`, "data");
        if (questData && typeof questData === "string") {
          try {
            quest = JSON.parse(questData);
            console.log(
              `Successfully retrieved quest: ${quest?.title || "Unknown"} (from direct Redis call)`,
            );
          } catch (parseError) {
            console.error(
              "Failed to parse quest data from direct Redis call:",
              parseError,
            );
          }
        }
      } catch (error) {
        console.error("Error in special handling for quest:", error);
      }
    }

    // If special handling didn't work, try normal route
    if (quest === null) {
      quest = await getQuestById(questId);
    }

    if (quest === null) {
      console.log(`Quest with ID ${questId} not found`);
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    console.log(`Successfully retrieved quest: ${quest?.title || "Unknown"}`);
    return NextResponse.json(quest, { status: 200 });
  } catch (error) {
    console.error("Error retrieving quest:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
