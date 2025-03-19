/**
 * Interface for a quest task/step in the UI
 */
export interface QuestStepUI {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  isCompleted: boolean;
  isLocked: boolean;
  type: "quiz" | "connect-wallet" | "check-balance" | "text" | "action";
  question?: string;
  options?: string[];
  correctAnswer?: string;
  requiredAmount?: string;
}

/**
 * Interface for a quest with extended UI properties
 */
export interface QuestUI extends Quest {
  projectName?: string;
  estimatedTime?: string;
  imageUrl?: string;
}

/**
 * Interface for a quest from the backend
 */
export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string | number;
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
    requiredAmount?: string;
  }[];
  createdAt: string;
}
