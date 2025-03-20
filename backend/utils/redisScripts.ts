import { getRedisClient, connectToRedis, closeRedisConnection } from "./redis";
import readline from "readline";
import fs from "fs";
import path from "path";

/**
 * Read all quest files from the quests directory
 * @returns {Array} Array of quest objects
 */
function readQuestFiles() {
  const questsDir = path.join(__dirname, "../../scripts/quests");
  const questFiles = fs
    .readdirSync(questsDir)
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => {
      // Sort numerically by filename (1.json, 2.json, etc.)
      const numA = parseInt(a.split(".")[0]!, 10);
      const numB = parseInt(b.split(".")[0]!, 10);
      return numA - numB;
    });

  const questsData: any[] = [];

  for (const file of questFiles) {
    const filePath = path.join(questsDir, file);
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      try {
        const questData = JSON.parse(fileContent);
        questsData.push(questData);
      } catch (parseError) {
        console.error(`Error parsing JSON in file ${file}:`);
        console.error((parseError as Error).message);
        // Log a snippet of the file content to help identify the issue
        const contentPreview = fileContent.slice(0, 100) + "...";
        console.error(`File content preview: ${contentPreview}`);
        throw new Error(`Invalid JSON in file: ${file}`);
      }
    } catch (readError) {
      if ((readError as Error).message.startsWith("Invalid JSON")) {
        throw readError; // Rethrow our custom error
      }
      console.error(`Error reading file ${file}:`);
      console.error((readError as Error).message);
      throw new Error(`Error reading file: ${file}`);
    }
  }

  return questsData;
}

/**
 * Import quest data from questsData.ts to Redis
 * @returns Promise that resolves when import is complete
 */
async function importQuestsToRedis() {
  try {
    // Connect to Redis
    await connectToRedis();
    const client = await getRedisClient();

    console.log("Starting import of quest data to Redis...");

    // Read all quest files
    const questsData = readQuestFiles();

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
        category: quest.projectName || "Aptos", // Default value
        difficulty: quest.difficulty,
        tasks: quest.tasks.map((task: any) => ({
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
function confirmAction(question: string): Promise<boolean> {
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
    const client = await getRedisClient();

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

export { importQuestsToRedis, clearQuestsFromRedis };
