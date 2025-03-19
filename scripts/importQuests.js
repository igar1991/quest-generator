#!/usr/bin/env node
const Redis = require("ioredis");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

// Create Redis client
const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

/**
 * Read all quest files from the quests directory
 * @returns {Array} Array of quest objects
 */
function readQuestFiles() {
  const questsDir = path.join(__dirname, "quests");
  const questFiles = fs.readdirSync(questsDir)
    .filter(file => file.endsWith('.json'))
    .sort((a, b) => {
      // Sort numerically by filename (1.json, 2.json, etc.)
      const numA = parseInt(a.split('.')[0], 10);
      const numB = parseInt(b.split('.')[0], 10);
      return numA - numB;
    });

  const questsData = [];
  
  for (const file of questFiles) {
    const filePath = path.join(questsDir, file);
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      try {
        const questData = JSON.parse(fileContent);
        questsData.push(questData);
      } catch (parseError) {
        console.error(`Error parsing JSON in file ${file}:`);
        console.error(parseError.message);
        // Log a snippet of the file content to help identify the issue
        const contentPreview = fileContent.slice(0, 100) + '...';
        console.error(`File content preview: ${contentPreview}`);
        throw new Error(`Invalid JSON in file: ${file}`);
      }
    } catch (readError) {
      if (readError.message.startsWith('Invalid JSON')) {
        throw readError; // Rethrow our custom error
      }
      console.error(`Error reading file ${file}:`);
      console.error(readError.message);
      throw new Error(`Error reading file: ${file}`);
    }
  }
  
  return questsData;
}

/**
 * Import quests to Redis
 */
async function importQuestsToRedis() {
  try {
    console.log("Starting import of quest data to Redis...");
    
    // Read all quest files
    const questsData = readQuestFiles();

    // Clear existing data in Redis
    const keys = await redisClient.keys("quests:*");
    if (keys.length > 0) {
      const pipeline = redisClient.pipeline();
      keys.forEach((key) => {
        pipeline.del(key);
      });
      await pipeline.exec();
      console.log(`Cleared ${keys.length} existing quest keys`);
    }

    // Reset the quests:all set
    await redisClient.del("quests:all");

    // Import each quest
    const pipeline = redisClient.pipeline();
    for (const quest of questsData) {
      // Format the quest data to match the Quest interface
      const formattedQuest = {
        id: quest.id,
        title: quest.title,
        description: quest.description,
        reward: quest.reward.toString(),
        totalUsers: "0", // Default value
        category: quest.projectName || "Aptos", // Default value
        difficulty: quest.difficulty,
        tasks: quest.tasks.map((task) => ({
          id: task.id,
          type: task.type === "connect-wallet" ? "action" : task.type,
          title: task.title,
          description: task.description,
          question: task.question,
          options: task.options,
          correctAnswer: task.correctAnswer,
          requiredAmount: task.requiredAmount,
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
    redisClient.quit();
  } catch (error) {
    console.error("Error importing quests to Redis:", error);
    redisClient.quit();
    process.exit(1);
  }
}

// Run the import function
importQuestsToRedis();
