#!/usr/bin/env node
const Redis = require("ioredis");
const readline = require("readline");

// Create Redis client
const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

/**
 * Confirm an action with the user via the command line
 * @param {string} question - Question to ask the user
 * @returns {Promise<boolean>} Promise that resolves to boolean based on user's response
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
 */
async function clearQuestsFromRedis() {
  try {
    const confirmed = await confirmAction(
      "Are you sure you want to delete ALL quest data from Redis?",
    );

    if (!confirmed) {
      console.log("Operation cancelled");
      redisClient.quit();
      return;
    }

    console.log("Clearing all quest data from Redis...");

    // Find all quest-related keys
    const keys = await redisClient.keys("quests:*");

    if (keys.length === 0) {
      console.log("No quest data found in Redis");
      redisClient.quit();
      return;
    }

    // Delete all keys in a pipeline
    const pipeline = redisClient.pipeline();
    keys.forEach((key) => {
      pipeline.del(key);
    });

    await pipeline.exec();
    console.log(`Successfully cleared ${keys.length} quest keys from Redis`);
    redisClient.quit();
  } catch (error) {
    console.error("Error clearing quests from Redis:", error);
    redisClient.quit();
    process.exit(1);
  }
}

// Run the clear function
clearQuestsFromRedis();
