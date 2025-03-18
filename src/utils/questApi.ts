import { ValidationResult, QuestData, validateQuest } from "./validateQuest";

/**
 * API URL for backend services
 */
const API_URL = "/api";

/**
 * Validates a quest using the API validation service
 * @param questData - The quest data to validate
 * @returns A promise that resolves to the validation result
 */
export async function validateQuestWithApi(
  questData: QuestData,
): Promise<ValidationResult> {
  try {
    const response = await fetch(`${API_URL}/validate-quest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questData),
    });

    const result = await response.json();

    if (!response.ok) {
      return result as ValidationResult;
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error:
        error instanceof Error
          ? error.message
          : "Network or server error occurred",
    };
  }
}

/**
 * Validates a quest locally and with the API for comprehensive validation
 * @param questData - The quest data to validate
 * @returns A promise that resolves to the validation result
 */
export async function validateQuestComprehensive(
  questData: QuestData,
): Promise<ValidationResult> {
  // First validate locally to save network requests for obviously invalid quests
  const localValidation = validateQuestLocal(questData);

  if (!localValidation.isValid) {
    return localValidation;
  }

  // If locally valid, validate with the API
  return validateQuestWithApi(questData);
}

/**
 * Validates a quest locally using the imported validation function
 * @param questData - The quest data to validate
 * @returns The validation result
 */
export function validateQuestLocal(questData: QuestData): ValidationResult {
  return validateQuest(questData);
}

/**
 * Creates a new quest using the API
 * @param questData - The quest data to create
 * @returns A promise that resolves to the created quest or rejects with an error
 */
export async function createQuest(questData: QuestData): Promise<{
  id: string;
  createdAt: string;
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
}> {
  try {
    const response = await fetch(`${API_URL}/quests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create quest");
    }

    return result;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Network or server error occurred");
  }
}
