/**
 * Types for quest validation
 */

/**
 * Represents a task in a quest
 */
export interface Task {
  id: string;
  type: "connect-wallet" | "check-balance" | "quiz";
  title: string;
  description: string;

  // For quiz type
  question?: string;
  options?: string[];
  correctAnswer?: string;

  // For check-balance type
  requiredAmount?: string;
}

/**
 * Represents a complete quest data structure
 */
export interface QuestData {
  title: string;
  description: string;
  reward: string;
  totalUsers: string;
  category: string;
  difficulty: string;
  tasks: Task[];
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  field?: string;
}

/**
 * Validates a quest data structure
 * @param questJson - JSON string or object representing a quest
 * @returns Validation result with error details if invalid
 */
export function validateQuest(questJson: string | object): ValidationResult {
  let quest: QuestData;

  // Parse JSON if string is provided
  if (typeof questJson === "string") {
    try {
      quest = JSON.parse(questJson);
    } catch (error) {
      return {
        isValid: false,
        error: `Invalid JSON format: ${error instanceof Error ? error.message : "Unknown parsing error"}`,
      };
    }
  } else {
    quest = questJson as QuestData;
  }

  // Validate required fields exist
  if (!quest.title) {
    return { isValid: false, error: "Title is required", field: "title" };
  }

  if (!quest.description) {
    return {
      isValid: false,
      error: "Description is required",
      field: "description",
    };
  }

  if (!quest.reward) {
    return {
      isValid: false,
      error: "Reward (in APT) is required",
      field: "reward",
    };
  }

  if (!quest.totalUsers) {
    return {
      isValid: false,
      error: "Total users is required",
      field: "totalUsers",
    };
  }

  // Validate title length
  if (quest.title.length < 5 || quest.title.length > 100) {
    return {
      isValid: false,
      error: "Title must be between 5 and 100 characters",
      field: "title",
    };
  }

  // Validate description length
  if (quest.description.length < 20 || quest.description.length > 500) {
    return {
      isValid: false,
      error: "Description must be between 20 and 500 characters",
      field: "description",
    };
  }

  // Validate reward format (numeric string)
  if (isNaN(Number(quest.reward))) {
    return {
      isValid: false,
      error: "Reward (in APT) must be a number",
      field: "reward",
    };
  }

  // Validate reward is positive
  if (Number(quest.reward) <= 0) {
    return {
      isValid: false,
      error: "Reward (in APT) must be greater than zero",
      field: "reward",
    };
  }

  // Validate totalUsers format (numeric string)
  if (isNaN(Number(quest.totalUsers))) {
    return {
      isValid: false,
      error: "Total users must be a number",
      field: "totalUsers",
    };
  }

  // Validate totalUsers is a positive integer
  const totalUsersNum = Number(quest.totalUsers);
  if (totalUsersNum <= 0 || Math.floor(totalUsersNum) !== totalUsersNum) {
    return {
      isValid: false,
      error: "Total users must be a positive integer",
      field: "totalUsers",
    };
  }

  // Validate category
  const validCategories = ["learning", "defi", "nft", "gaming", "dao", "other"];
  if (!validCategories.includes(quest.category)) {
    return {
      isValid: false,
      error: `Category must be one of: ${validCategories.join(", ")}`,
      field: "category",
    };
  }

  // Validate difficulty
  const validDifficulties = ["beginner", "intermediate", "advanced"];
  if (!validDifficulties.includes(quest.difficulty)) {
    return {
      isValid: false,
      error: `Difficulty must be one of: ${validDifficulties.join(", ")}`,
      field: "difficulty",
    };
  }

  // Validate tasks
  if (!Array.isArray(quest.tasks) || quest.tasks.length === 0) {
    return {
      isValid: false,
      error: "At least one task is required",
      field: "tasks",
    };
  }

  if (quest.tasks.length > 20) {
    return {
      isValid: false,
      error: "Maximum 20 tasks allowed per quest",
      field: "tasks",
    };
  }

  // Validate each task
  for (let i = 0; i < quest.tasks.length; i++) {
    const task = quest.tasks[i];
    const taskField = `tasks[${i}]`;

    if (!task.id) {
      return {
        isValid: false,
        error: "Task ID is required",
        field: `${taskField}.id`,
      };
    }

    if (!task.title) {
      return {
        isValid: false,
        error: "Task title is required",
        field: `${taskField}.title`,
      };
    }

    if (!task.description) {
      return {
        isValid: false,
        error: "Task description is required",
        field: `${taskField}.description`,
      };
    }

    if (
      !task.type ||
      !["connect-wallet", "check-balance", "quiz"].includes(task.type)
    ) {
      return {
        isValid: false,
        error: "Task type must be one of: connect-wallet, check-balance, quiz",
        field: `${taskField}.type`,
      };
    }

    // Validate specific fields based on task type
    if (task.type === "quiz") {
      if (!task.question) {
        return {
          isValid: false,
          error: "Question is required for quiz tasks",
          field: `${taskField}.question`,
        };
      }

      if (!Array.isArray(task.options) || task.options.length < 2) {
        return {
          isValid: false,
          error: "Quiz tasks must have at least 2 options",
          field: `${taskField}.options`,
        };
      }

      if (!task.correctAnswer) {
        return {
          isValid: false,
          error: "Correct answer is required for quiz tasks",
          field: `${taskField}.correctAnswer`,
        };
      }

      if (!task.options.includes(task.correctAnswer)) {
        return {
          isValid: false,
          error: "Correct answer must be one of the provided options",
          field: `${taskField}.correctAnswer`,
        };
      }
    }

    if (task.type === "check-balance") {
      if (!task.requiredAmount) {
        return {
          isValid: false,
          error: "Required amount is needed for check-balance tasks",
          field: `${taskField}.requiredAmount`,
        };
      }

      if (isNaN(Number(task.requiredAmount))) {
        return {
          isValid: false,
          error: "Required amount must be a number",
          field: `${taskField}.requiredAmount`,
        };
      }

      if (Number(task.requiredAmount) <= 0) {
        return {
          isValid: false,
          error: "Required amount must be greater than zero",
          field: `${taskField}.requiredAmount`,
        };
      }
    }
  }

  // All validations passed
  return { isValid: true };
}
