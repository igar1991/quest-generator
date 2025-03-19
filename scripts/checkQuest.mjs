import {
  connectToRedis,
  getRedisClient,
  closeRedisConnection,
} from "../backend/utils/redis";

async function checkQuest(questId) {
  try {
    // Connect to Redis
    await connectToRedis();
    const client = await getRedisClient();

    console.log(`Checking for quest with ID: ${questId}`);

    // Check if the quest ID exists in the all quests set
    const inAllQuests = await client.sismember("quests:all", questId);
    console.log(`Is quest ID in quests:all set: ${inAllQuests ? "Yes" : "No"}`);

    // Try to fetch the quest data
    const questData = await client.hget(`quests:${questId}`, "data");

    if (!questData) {
      console.log("Quest not found in Redis!");
      return;
    }

    // Parse the data and display some information
    try {
      const quest = JSON.parse(questData);
      console.log("Quest found in Redis:");
      console.log(`- Title: ${quest.title}`);
      console.log(`- Description: ${quest.description}`);
      console.log(`- Tasks: ${quest.tasks ? quest.tasks.length : 0}`);
      console.log(`- Created at: ${quest.createdAt}`);
    } catch (error) {
      console.error("Failed to parse quest data:", error);
      console.log("Raw data:", questData);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the Redis connection
    await closeRedisConnection();
  }
}

// Get the quest ID from command line arguments
const questId = process.argv[2];

if (!questId) {
  console.error("Please provide a quest ID as an argument");
  process.exit(1);
}

checkQuest(questId);
