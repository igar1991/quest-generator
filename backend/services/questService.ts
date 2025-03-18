import { getRedisClient } from "../utils/redis";
import { v4 as uuidv4 } from "uuid";

/**
 * Interface representing quest data for storage
 */
export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  totalUsers: string;
  category: string;
  difficulty: string;
  tasks: {
    id: string;
    type: "text" | "quiz" | "action";
    title: string;
    description: string;
    question?: string;
    options?: string[];
    correctAnswer?: string;
    actionUrl?: string;
    successCondition?: string;
  }[];
  createdAt: string;
}

/**
 * Creates a new quest in Redis
 * @param questData - The quest data to store
 * @returns The created quest with ID and createdAt
 */
export async function createQuest(
  questData: Omit<Quest, "id" | "createdAt">,
): Promise<Quest> {
  const client = getRedisClient();

  // Generate a unique ID for the quest
  const questId = uuidv4();

  // Create the full quest object with ID and timestamp
  const quest: Quest = {
    ...questData,
    id: questId,
    createdAt: new Date().toISOString(),
  };

  // Store the quest in Redis
  // We'll use a hash to store all quests with the key 'quests:{questId}'
  await client.hset(`quests:${questId}`, "data", JSON.stringify(quest));

  // Add to a set of all quest IDs for easier retrieval
  await client.sadd("quests:all", questId);

  return quest;
}

/**
 * Gets a quest by ID
 * @param questId - The ID of the quest to retrieve
 * @returns The quest data or null if not found
 */
export async function getQuestById(questId: string): Promise<Quest | null> {
  const client = getRedisClient();

  const questData = await client.hget(`quests:${questId}`, "data");

  if (!questData) {
    return null;
  }

  return JSON.parse(questData) as Quest;
}

/**
 * Gets all quests
 * @param limit - Maximum number of quests to return
 * @param offset - Number of quests to skip
 * @returns Array of quests
 */
export async function getAllQuests(limit = 100, offset = 0): Promise<Quest[]> {
  const client = getRedisClient();

  // Get all quest IDs
  const questIds = await client.smembers("quests:all");

  // Apply pagination
  const paginatedIds = questIds.slice(offset, offset + limit);

  // If no quests, return empty array
  if (paginatedIds.length === 0) {
    return [];
  }

  // Get all quests in parallel
  const quests = await Promise.all(paginatedIds.map((id) => getQuestById(id)));

  // Filter out any null values (in case a quest was deleted)
  return quests.filter((quest): quest is Quest => quest !== null);
}
