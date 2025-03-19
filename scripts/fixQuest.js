const {
  connectToRedis,
  getRedisClient,
  closeRedisConnection,
} = require("../backend/utils/redis");

async function fixQuest(questId) {
  try {
    // Connect to Redis with a wait to ensure connection is ready
    console.log("Connecting to Redis...");
    await connectToRedis();

    // Wait a moment to ensure connection is fully established
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const client = getRedisClient();
    console.log("Redis client obtained successfully");

    console.log(`Fixing quest with ID: ${questId}`);

    // Check if the quest ID exists in the all quests set
    const inAllQuests = await client.sismember("quests:all", questId);
    console.log(`Is quest ID in quests:all set: ${inAllQuests ? "Yes" : "No"}`);

    if (!inAllQuests) {
      console.log(`Adding quest ID ${questId} to quests:all set`);
      await client.sadd("quests:all", questId);
    }

    // Try to fetch the quest data
    const questData = await client.hget(`quests:${questId}`, "data");

    if (!questData) {
      console.log("Quest not found in Redis!");
      return;
    }

    // Parse the data
    try {
      const quest = JSON.parse(questData);
      console.log("Original quest data parsed successfully");
      console.log(`- Title: ${quest.title}`);

      // Re-save the quest data
      console.log("Re-saving quest data to ensure it's valid");
      await client.hset(`quests:${questId}`, "data", JSON.stringify(quest));
      console.log("Quest data re-saved successfully");

      // Verify the re-saved data
      const verifiedData = await client.hget(`quests:${questId}`, "data");
      const verifiedQuest = JSON.parse(verifiedData);
      console.log("Verified quest data:", verifiedQuest.title);
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

fixQuest(questId);
