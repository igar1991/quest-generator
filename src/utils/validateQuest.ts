/**
 * Types for quest validation
 */
import {
  QUEST_TITLE_MIN_LENGTH,
  QUEST_TITLE_MAX_LENGTH,
  QUEST_DESCRIPTION_MIN_LENGTH,
  QUEST_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MIN_LENGTH,
  TASK_DESCRIPTION_MIN_LENGTH,
  QUIZ_QUESTION_MIN_LENGTH,
  QUIZ_OPTION_MIN_LENGTH,
  QUIZ_MIN_OPTIONS,
  REWARD_MIN,
  REWARD_MAX,
  TOTAL_USERS_MIN,
  TOTAL_USERS_MAX,
  ACTION_URL_MIN_LENGTH,
  ACTION_SUCCESS_CONDITION_MIN_LENGTH,
} from "@/utils/validationConstants";

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

  // For connect-wallet type
  actionUrl?: string;
  successCondition?: string;
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
  if (
    quest.title.length < QUEST_TITLE_MIN_LENGTH ||
    quest.title.length > QUEST_TITLE_MAX_LENGTH
  ) {
    return {
      isValid: false,
      error: `Title must be between ${QUEST_TITLE_MIN_LENGTH} and ${QUEST_TITLE_MAX_LENGTH} characters`,
      field: "title",
    };
  }

  // Validate description length
  if (
    quest.description.length < QUEST_DESCRIPTION_MIN_LENGTH ||
    quest.description.length > QUEST_DESCRIPTION_MAX_LENGTH
  ) {
    return {
      isValid: false,
      error: `Description must be between ${QUEST_DESCRIPTION_MIN_LENGTH} and ${QUEST_DESCRIPTION_MAX_LENGTH} characters`,
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

  // Validate reward is positive and within limits
  const rewardNum = Number(quest.reward);
  if (rewardNum < REWARD_MIN || rewardNum > REWARD_MAX) {
    return {
      isValid: false,
      error: `Reward (in APT) must be between ${REWARD_MIN} and ${REWARD_MAX}`,
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

  // Validate totalUsers is a positive integer within limits
  const totalUsersNum = Number(quest.totalUsers);
  if (
    totalUsersNum < TOTAL_USERS_MIN ||
    totalUsersNum > TOTAL_USERS_MAX ||
    Math.floor(totalUsersNum) !== totalUsersNum
  ) {
    return {
      isValid: false,
      error: `Total users must be a whole number between ${TOTAL_USERS_MIN} and ${TOTAL_USERS_MAX}`,
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

    if (!task || !task.id) {
      return {
        isValid: false,
        error: "Task ID is required",
        field: `${taskField}.id`,
      };
    }

    // Check task title
    if (task.title === undefined || task.title === null || task.title === "") {
      return {
        isValid: false,
        error: "Task title is required",
        field: `${taskField}.title`,
      };
    } else if (task.title.length < TASK_TITLE_MIN_LENGTH) {
      return {
        isValid: false,
        error: `Task title must be at least ${TASK_TITLE_MIN_LENGTH} characters`,
        field: `${taskField}.title`,
      };
    }

    // Check task description
    if (
      task.description === undefined ||
      task.description === null ||
      task.description === ""
    ) {
      return {
        isValid: false,
        error: "Task description is required",
        field: `${taskField}.description`,
      };
    } else if (task.description.length < TASK_DESCRIPTION_MIN_LENGTH) {
      return {
        isValid: false,
        error: `Task description must be at least ${TASK_DESCRIPTION_MIN_LENGTH} characters`,
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
          error: "Quiz question is required",
          field: `${taskField}.question`,
        };
      } else if (task.question.length < QUIZ_QUESTION_MIN_LENGTH) {
        return {
          isValid: false,
          error: `Quiz question must be at least ${QUIZ_QUESTION_MIN_LENGTH} characters`,
          field: `${taskField}.question`,
        };
      }

      if (!task.options || !Array.isArray(task.options)) {
        return {
          isValid: false,
          error: "Quiz options must be an array",
          field: `${taskField}.options`,
        };
      } else if (task.options.length < QUIZ_MIN_OPTIONS) {
        return {
          isValid: false,
          error: `Quiz must have at least ${QUIZ_MIN_OPTIONS} options`,
          field: `${taskField}.options`,
        };
      }

      // Validate each option
      for (let j = 0; j < (task.options?.length || 0); j++) {
        if (
          !task.options ||
          !task.options[j] ||
          (task.options[j]?.length || 0) < QUIZ_OPTION_MIN_LENGTH
        ) {
          return {
            isValid: false,
            error: `Quiz option ${j + 1} must be at least ${QUIZ_OPTION_MIN_LENGTH} character`,
            field: `${taskField}.options[${j}]`,
          };
        }
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
          error: "Correct answer must be one of the options",
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

      if (
        isNaN(Number(task.requiredAmount)) ||
        Number(task.requiredAmount) <= 0
      ) {
        return {
          isValid: false,
          error: "Required amount must be a positive number",
          field: `${taskField}.requiredAmount`,
        };
      }
    }

    // Additional validation for connect-wallet tasks that are used as action verification
    if (task.type === "connect-wallet") {
      // Check for URL if it exists (for action type tasks in UI)
      if (task.actionUrl !== undefined) {
        if (task.actionUrl.trim() === "") {
          return {
            isValid: false,
            error: "Action URL is required",
            field: `${taskField}.actionUrl`,
          };
        }

        if (task.actionUrl.length < ACTION_URL_MIN_LENGTH) {
          return {
            isValid: false,
            error: `Action URL must be at least ${ACTION_URL_MIN_LENGTH} characters`,
            field: `${taskField}.actionUrl`,
          };
        }
      }

      // Check for success condition if it exists (for action type tasks in UI)
      if (task.successCondition !== undefined) {
        if (task.successCondition.trim() === "") {
          return {
            isValid: false,
            error: "Success condition is required",
            field: `${taskField}.successCondition`,
          };
        }

        if (
          task.successCondition.length < ACTION_SUCCESS_CONDITION_MIN_LENGTH
        ) {
          return {
            isValid: false,
            error: `Success condition must be at least ${ACTION_SUCCESS_CONDITION_MIN_LENGTH} characters`,
            field: `${taskField}.successCondition`,
          };
        }
      }
    }
  }

  // All validations passed
  return { isValid: true };
}
