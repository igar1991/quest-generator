const {
  getRedisClient,
  connectToRedis,
  closeRedisConnection,
} = require("./redis");
const { questsData } = require("../../src/app/data/questsData");
const readline = require("readline");

/**
 * Import quest data from questsData.ts to Redis
 * @returns Promise that resolves when import is complete
 */
async function importQuestsToRedis() {
  try {
    // Connect to Redis
    await connectToRedis();
    const client = getRedisClient();

    console.log("Starting import of quest data to Redis...");

    // Clear existing data in Redis
    const keys = await client.keys("quests:*");
    if (keys.length > 0) {
      const pipeline = client.pipeline();
      keys.forEach((key) => {
        pipeline.del(key);
      });
      await pipeline.exec();
      console.log(`Cleared ${keys.length} existing quest keys`);
    }

    // Reset the quests:all set
    await client.del("quests:all");

    // Import each quest
    const pipeline = client.pipeline();
    for (const quest of questsData) {
      // Format the quest data to match the Quest interface
      const formattedQuest = {
        id: quest.id,
        title: quest.title,
        description: quest.description,
        reward: quest.reward.toString(),
        totalUsers: "0", // Default value
        category: "Aptos", // Default value
        difficulty: quest.difficulty,
        tasks: quest.tasks.map((task) => ({
          id: task.id,
          type: task.type === "connect-wallet" ? "action" : task.type,
          title: task.title,
          description: task.description,
          question: "question" in task ? task.question : undefined,
          options: "options" in task ? task.options : undefined,
          correctAnswer:
            "correctAnswer" in task ? task.correctAnswer : undefined,
          actionUrl:
            task.type === "connect-wallet" ? "/api/connect-wallet" : undefined,
          successCondition:
            task.type === "check-balance"
              ? `amount>=${task.requiredAmount}`
              : undefined,
        })),
        createdAt: new Date().toISOString(),
      };

      // Store the quest in Redis
      pipeline.hset(
        `quests:${quest.id}`,
        "data",
        JSON.stringify(formattedQuest),
      );

      // Add to the set of all quests
      pipeline.sadd("quests:all", quest.id);
    }

    await pipeline.exec();
    console.log(`Successfully imported ${questsData.length} quests to Redis`);
  } catch (error) {
    console.error("Error importing quests to Redis:", error);
    throw error;
  } finally {
    await closeRedisConnection();
  }
}

/**
 * Confirm an action with the user via the command line
 * @param question - Question to ask the user
 * @returns Promise that resolves to boolean based on user's response
 */
function confirmAction(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}

/**
 * Clear all quest data from Redis with confirmation
 * @returns Promise that resolves when clear is complete
 */
async function clearQuestsFromRedis() {
  try {
    const confirmed = await confirmAction(
      "Are you sure you want to delete ALL quest data from Redis?",
    );

    if (!confirmed) {
      console.log("Operation cancelled");
      return;
    }

    // Connect to Redis
    await connectToRedis();
    const client = getRedisClient();

    console.log("Clearing all quest data from Redis...");

    // Find all quest-related keys
    const keys = await client.keys("quests:*");

    if (keys.length === 0) {
      console.log("No quest data found in Redis");
      return;
    }

    // Delete all keys in a pipeline
    const pipeline = client.pipeline();
    keys.forEach((key) => {
      pipeline.del(key);
    });

    await pipeline.exec();
    console.log(`Successfully cleared ${keys.length} quest keys from Redis`);
  } catch (error) {
    console.error("Error clearing quests from Redis:", error);
    throw error;
  } finally {
    await closeRedisConnection();
  }
}

module.exports = {
  importQuestsToRedis,
  clearQuestsFromRedis,
};
