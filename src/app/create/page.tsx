"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createQuest } from "@/utils/questApi";
import SuccessModal from "../components/ui/SuccessModal";
import QuestCard from "../components/QuestCard";
import QuestMap from "../components/QuestMap";
import {
  Task as ValidateTask,
  QuestData as ValidateQuestData,
} from "@/utils/validateQuest";
import { QuestStepUI } from "../types/quest";
import {
  QUEST_TITLE_MIN_LENGTH,
  QUEST_TITLE_MAX_LENGTH,
  QUEST_DESCRIPTION_MIN_LENGTH,
  QUEST_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MIN_LENGTH,
  TASK_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MIN_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
  QUIZ_QUESTION_MIN_LENGTH,
  QUIZ_QUESTION_MAX_LENGTH,
  QUIZ_OPTION_MIN_LENGTH,
  QUIZ_OPTION_MAX_LENGTH,
  QUIZ_MIN_OPTIONS,
  REWARD_MIN,
  REWARD_MAX,
  TOTAL_USERS_MIN,
  TOTAL_USERS_MAX,
} from "@/utils/validationConstants";

// Define the task types used in the create page
type TaskType = "quiz" | "check-balance-increment";

// Map our UI task types to the validated task types
const mapTaskTypeToValidateType = (type: TaskType): ValidateTask["type"] => {
  switch (type) {
    case "quiz":
      return "quiz";
    case "check-balance-increment":
      return "check-balance"; // Map check-balance-increment to check-balance
    default:
      return "connect-wallet";
  }
};

interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;

  // For quiz type
  question?: string;
  options?: string[];
  correctAnswer?: string;

  // For check-balance-increment type
  requiredAmount?: string;
}

interface QuestData {
  title: string;
  description: string;
  reward: string;
  totalUsers: string;
  category: string;
  difficulty: string;
  tasks: Task[];
}

/**
 * Creates a new quest with dynamic task management
 * @returns React component for creating quests
 */
export default function CreateQuestPage() {
  const router = useRouter();
  const errorMessageRef = useRef<HTMLDivElement>(null);
  const [questData, setQuestData] = useState<QuestData>({
    title: "",
    description: "",
    reward: "",
    totalUsers: "",
    category: "learning",
    difficulty: "beginner",
    tasks: [],
  });

  const [currentTaskType, setCurrentTaskType] = useState<TaskType>("quiz");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [createdQuestId, setCreatedQuestId] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [formChanged, setFormChanged] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Check if the form has been modified from its initial state
   */
  useEffect(() => {
    const isFormEmpty =
      questData.title === "" &&
      questData.description === "" &&
      questData.reward === "" &&
      questData.tasks.length === 0;

    setFormChanged(!isFormEmpty);
  }, [questData]);

  /**
   * Scroll to error message when it appears
   */
  useEffect(() => {
    if (errorMessage && errorMessageRef.current) {
      errorMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [errorMessage]);

  /**
   * Handles back button click with confirmation if form has changes
   */
  const handleBackClick = () => {
    if (formChanged) {
      setShowConfirmDialog(true);
    } else {
      router.push("/");
    }
  };

  /**
   * Handles confirmation dialog response
   * @param confirmed - Whether the user confirmed losing changes
   */
  const handleConfirmResponse = (confirmed: boolean) => {
    setShowConfirmDialog(false);
    if (confirmed) {
      router.push("/");
    }
  };

  /**
   * Handles changes to the main quest form fields
   * @param e - Change event from form inputs
   */
  const handleQuestDataChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setQuestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Adds a new task to the quest based on the current selected task type
   */
  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      type: currentTaskType,
      title: "",
      description: "",
    };

    // Set default title and description for check-balance-increment tasks
    if (currentTaskType === "check-balance-increment") {
      newTask.title = "Add APT to your wallet";
      newTask.description =
        "Transfer APT to your wallet to complete this task. The system will verify that your balance has increased by the required amount.";
    }

    setQuestData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  /**
   * Removes a task from the quest
   * @param taskId - ID of the task to remove
   */
  const removeTask = (taskId: string) => {
    setQuestData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== taskId),
    }));
  };

  /**
   * Updates a specific task with new values
   * @param taskId - ID of the task to update
   * @param updates - Partial task object with updated values
   */
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setQuestData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      ),
    }));
  };

  /**
   * Handles changes to task form fields
   * @param taskId - ID of the task being updated
   * @param e - Change event from form inputs
   */
  const handleTaskChange = (
    taskId: string,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    updateTask(taskId, { [name]: value });
  };

  /**
   * Updates a specific option in a quiz task
   * @param taskId - ID of the task being updated
   * @param index - Index of the option to update
   * @param value - New value for the option
   */
  const handleOptionChange = (taskId: string, index: number, value: string) => {
    const task = questData.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const options = [...(task.options || [])];
    options[index] = value;

    updateTask(taskId, { options });
  };

  /**
   * Adds a new empty option to a quiz task
   * @param taskId - ID of the task to add an option to
   */
  const addOption = (taskId: string) => {
    const task = questData.tasks.find((t) => t.id === taskId);
    if (!task) return;

    updateTask(taskId, {
      options: [...(task.options || []), ""],
    });
  };

  /**
   * Removes an option from a quiz task
   * @param taskId - ID of the task
   * @param index - Index of the option to remove
   */
  const removeOption = (taskId: string, index: number) => {
    const task = questData.tasks.find((t) => t.id === taskId);
    if (!task || !task.options) return;

    const options = [...task.options];
    options.splice(index, 1);

    updateTask(taskId, { options });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage(null);

    try {
      // client-side validation
      if (!questData.title) {
        throw new Error("Quest title is required");
      }

      if (questData.title.length < QUEST_TITLE_MIN_LENGTH) {
        throw new Error(
          `Quest title must be between ${QUEST_TITLE_MIN_LENGTH} and ${QUEST_TITLE_MAX_LENGTH} characters long`,
        );
      }

      if (!questData.description) {
        throw new Error("Quest description is required");
      }

      if (questData.description.length < QUEST_DESCRIPTION_MIN_LENGTH) {
        throw new Error(
          `Quest description must be at least ${QUEST_DESCRIPTION_MIN_LENGTH} characters long`,
        );
      }

      if (questData.tasks.length === 0) {
        throw new Error("At least one quest task is required");
      }

      // Validate tasks
      for (const task of questData.tasks) {
        if (task.title.length < TASK_TITLE_MIN_LENGTH) {
          throw new Error(
            `Task title "${task.title}" must be at least ${TASK_TITLE_MIN_LENGTH} characters long`,
          );
        }

        if (task.description.length < TASK_DESCRIPTION_MIN_LENGTH) {
          throw new Error(
            `Task description for "${task.title}" must be at least ${TASK_DESCRIPTION_MIN_LENGTH} characters long`,
          );
        }

        if (task.type === "quiz") {
          if (
            !task.question ||
            task.question.length < QUIZ_QUESTION_MIN_LENGTH
          ) {
            throw new Error(
              `Quiz question for "${task.title}" must be at least ${QUIZ_QUESTION_MIN_LENGTH} characters long`,
            );
          }

          if (!task.options || task.options.length < QUIZ_MIN_OPTIONS) {
            throw new Error(
              `Quiz "${task.title}" must have at least ${QUIZ_MIN_OPTIONS} options`,
            );
          }

          // Check if all options have at least 1 character
          const invalidOptions = task.options.filter(
            (option) => option.length < QUIZ_OPTION_MIN_LENGTH,
          );
          if (invalidOptions.length > 0) {
            throw new Error(
              `All quiz options for "${task.title}" must be at least ${QUIZ_OPTION_MIN_LENGTH} character long`,
            );
          }

          if (!task.correctAnswer) {
            throw new Error(
              `Quiz "${task.title}" must have a correct answer selected`,
            );
          }
        }

        if (task.type === "check-balance-increment") {
          // Only validate the requiredAmount field for check-balance-increment tasks
          if (!task.requiredAmount) {
            throw new Error(`Required amount for "${task.title}" is required`);
          }

          const requiredAmount = Number(task.requiredAmount);
          if (isNaN(requiredAmount) || requiredAmount <= 0) {
            throw new Error(
              `Required amount for "${task.title}" must be greater than 0`,
            );
          }
        }
      }

      // Format task data for validation
      const formattedTasks = questData.tasks.map((task) => {
        const baseTask = {
          id: task.id,
          title: task.title,
          description: task.description,
          type: mapTaskTypeToValidateType(task.type),
        };

        // Add type-specific fields
        if (task.type === "quiz") {
          return {
            ...baseTask,
            question: task.question,
            options: task.options,
            correctAnswer: task.correctAnswer,
          };
        } else if (task.type === "check-balance-increment") {
          return {
            ...baseTask,
            requiredAmount: task.requiredAmount || "0.1", // Use provided amount or default
          };
        } else {
          return {
            ...baseTask,
            requiredAmount: "1", // Default required amount for text tasks
          };
        }
      });

      // Create a properly typed formatted quest data
      const formattedQuestData: ValidateQuestData = {
        title: questData.title,
        description: questData.description,
        reward: questData.reward,
        totalUsers: questData.totalUsers,
        category: questData.category,
        difficulty: questData.difficulty,
        tasks: formattedTasks as ValidateTask[],
      };

      // Create quest via API
      const result = await createQuest(formattedQuestData);

      // Set success message and createdQuestId, then show the success modal
      setSuccessMessage(`Quest "${questData.title}" created successfully!`);
      setCreatedQuestId(result.id);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Form submission error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Non-async wrapper for handleSubmit
   */
  const handleSubmitWrapper = (e: React.FormEvent) => {
    void handleSubmit(e);
  };

  /**
   * Handles closing the success modal
   */
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setCreatedQuestId("");
  };

  // Calculate total APT
  const calculateTotalAPT = () => {
    if (!questData.reward || !questData.totalUsers) return 0;

    const rewardValue = parseFloat(questData.reward);
    const totalUsersValue = parseInt(questData.totalUsers);

    if (isNaN(rewardValue) || isNaN(totalUsersValue)) return 0;

    return (rewardValue * totalUsersValue).toFixed(2);
  };

  /**
   * Converts internal difficulty value to display format
   * @param difficulty - Internal difficulty string
   * @returns Display difficulty string
   */
  const convertDifficultyToDisplay = (
    difficulty: string,
  ): "Easy" | "Medium" | "Hard" | "Beginner" | "Intermediate" | "Advanced" => {
    switch (difficulty) {
      case "beginner":
        return "Beginner";
      case "intermediate":
        return "Intermediate";
      case "advanced":
        return "Advanced";
      default:
        return "Beginner";
    }
  };

  /**
   * Handles form validation
   */
  const validateForm = async () => {
    try {
      setIsValidating(true);

      // Validate the form
      if (questData.tasks.length === 0) {
        throw new Error("At least one task is required");
      }

      // Format task data for validation
      const formattedTasks = questData.tasks.map((task) => {
        const baseTask = {
          id: task.id,
          title: task.title,
          description: task.description,
          type: mapTaskTypeToValidateType(task.type),
        };

        // Add type-specific fields
        if (task.type === "quiz") {
          return {
            ...baseTask,
            question: task.question,
            options: task.options,
            correctAnswer: task.correctAnswer,
          };
        } else if (task.type === "check-balance-increment") {
          return {
            ...baseTask,
            requiredAmount: task.requiredAmount || "0.1", // Use provided amount or default
          };
        } else {
          return {
            ...baseTask,
            requiredAmount: "1", // Default required amount for text tasks
          };
        }
      });

      // Create a properly typed formatted quest data that matches the validation type
      const formattedQuestData: ValidateQuestData = {
        title: questData.title,
        description: questData.description,
        reward: questData.reward,
        totalUsers: questData.totalUsers,
        category: questData.category,
        difficulty: questData.difficulty,
        tasks: formattedTasks as ValidateTask[],
      };

      // Create the quest via API
      await createQuest(formattedQuestData);

      console.log("Quest validation successful");
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Non-async wrapper for validateForm
   */
  const validateFormWrapper = () => {
    void validateForm();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBackClick}
        className="absolute top-8 left-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Success Modal */}
      <SuccessModal
        questId={createdQuestId}
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Discard changes?</h3>
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Are you sure you want to go back? All
              your changes will be lost.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => handleConfirmResponse(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmResponse(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-8">Create New Quest</h1>

      {/* Error Message */}
      {errorMessage && (
        <div
          ref={errorMessageRef}
          className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmitWrapper} className="space-y-8">
        {/* Quest Information */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
          <h2 className="text-xl font-semibold">Quest Information</h2>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Quest Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={questData.title}
              onChange={handleQuestDataChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              minLength={QUEST_TITLE_MIN_LENGTH}
              maxLength={QUEST_TITLE_MAX_LENGTH}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={questData.description}
              onChange={handleQuestDataChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              minLength={QUEST_DESCRIPTION_MIN_LENGTH}
              maxLength={QUEST_DESCRIPTION_MAX_LENGTH}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="reward"
                className="block text-sm font-medium mb-1"
              >
                Reward (in APT)
              </label>
              <input
                type="number"
                id="reward"
                name="reward"
                value={questData.reward}
                onChange={handleQuestDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                step="0.01"
                min={REWARD_MIN}
                max={REWARD_MAX}
                placeholder="0.00"
              />
            </div>

            <div>
              <label
                htmlFor="totalUsers"
                className="block text-sm font-medium mb-1"
              >
                Total users
              </label>
              <input
                type="number"
                id="totalUsers"
                name="totalUsers"
                value={questData.totalUsers}
                onChange={handleQuestDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                step="1"
                min={TOTAL_USERS_MIN}
                max={TOTAL_USERS_MAX}
                placeholder="0"
              />
            </div>
          </div>

          {/* Total APT calculation - always visible */}
          <div className="mt-4 p-3 bg-purple-50 rounded-md border border-purple-200">
            <p className="text-purple-800 font-medium">
              Total APT to fund: {calculateTotalAPT()} APT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={questData.category}
                onChange={(e) =>
                  setQuestData({ ...questData, category: e.target.value })
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="learning">Learning</option>
                <option value="defi">DeFi</option>
                <option value="nft">NFT</option>
                <option value="gaming">Gaming</option>
                <option value="dao">DAO</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={questData.difficulty}
                onChange={(e) =>
                  setQuestData({ ...questData, difficulty: e.target.value })
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Management */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <div className="flex flex-wrap gap-2">
              <select
                value={currentTaskType}
                onChange={(e) => setCurrentTaskType(e.target.value as TaskType)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base w-full sm:w-auto"
              >
                <option value="quiz">Quiz Question</option>
                <option value="check-balance-increment">
                  Check Balance Increment
                </option>
              </select>
              <button
                type="button"
                onClick={addTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto"
              >
                Add Task
              </button>
            </div>
          </div>

          {questData.tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tasks added yet. Use the button above to add tasks.
            </div>
          )}

          <div className="space-y-6">
            {questData.tasks.map((task, index) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 space-y-4"
              >
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h3 className="text-lg font-medium">
                    Step {index + 1}:{" "}
                    {task.type === "quiz"
                      ? "Quiz Question"
                      : "Check Balance Increment"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeTask(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  {/* For check-balance-increment tasks, we don't show title and description fields */}
                  {task.type === "quiz" && (
                    <>
                      <div>
                        <label
                          htmlFor={`task-${task.id}-title`}
                          className="block text-sm font-medium mb-1"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id={`task-${task.id}-title`}
                          name="title"
                          value={task.title}
                          onChange={(e) => handleTaskChange(task.id, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                          minLength={TASK_TITLE_MIN_LENGTH}
                          maxLength={TASK_TITLE_MAX_LENGTH}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`task-${task.id}-description`}
                          className="block text-sm font-medium mb-1"
                        >
                          Description
                        </label>
                        <textarea
                          id={`task-${task.id}-description`}
                          name="description"
                          value={task.description}
                          onChange={(e) => handleTaskChange(task.id, e)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                          minLength={TASK_DESCRIPTION_MIN_LENGTH}
                          maxLength={TASK_DESCRIPTION_MAX_LENGTH}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`task-${task.id}-question`}
                          className="block text-sm font-medium mb-1"
                        >
                          Question
                        </label>
                        <input
                          type="text"
                          id={`task-${task.id}-question`}
                          name="question"
                          value={
                            task.question !== undefined ? task.question : ""
                          }
                          onChange={(e) => handleTaskChange(task.id, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                          minLength={QUIZ_QUESTION_MIN_LENGTH}
                          maxLength={QUIZ_QUESTION_MAX_LENGTH}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Options
                        </label>
                        {(task.options || []).map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex mb-2 flex-wrap sm:flex-nowrap"
                          >
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  task.id,
                                  optionIndex,
                                  e.target.value,
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none w-full sm:w-auto"
                              placeholder={`Option ${optionIndex + 1}`}
                              required
                              minLength={QUIZ_OPTION_MIN_LENGTH}
                              maxLength={QUIZ_OPTION_MAX_LENGTH}
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(task.id, optionIndex)}
                              className="px-3 py-2 bg-red-100 text-red-600 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-red-200 mt-1 sm:mt-0 w-full sm:w-auto"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(task.id)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 w-full sm:w-auto"
                        >
                          Add Option
                        </button>
                      </div>

                      <div>
                        <label
                          htmlFor={`task-${task.id}-correct-answer`}
                          className="block text-sm font-medium mb-1"
                        >
                          Correct Answer
                        </label>
                        <select
                          id={`task-${task.id}-correct-answer`}
                          name="correctAnswer"
                          value={task.correctAnswer || ""}
                          onChange={(e) => handleTaskChange(task.id, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select correct answer</option>
                          {(task.options || []).map((option, optionIndex) => (
                            <option key={optionIndex} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {task.type === "check-balance-increment" && (
                    <>
                      {/* Hidden title and description with default values */}
                      <input
                        type="hidden"
                        id={`task-${task.id}-title`}
                        name="title"
                        value={task.title || "Add APT to your wallet"}
                        onChange={(e) => handleTaskChange(task.id, e)}
                      />
                      <input
                        type="hidden"
                        id={`task-${task.id}-description`}
                        name="description"
                        value={
                          task.description ||
                          "Transfer APT to your wallet to complete this task. The system will verify that your balance has increased by the required amount."
                        }
                        onChange={(e) => handleTaskChange(task.id, e)}
                      />

                      <div className="p-3 bg-blue-50 rounded-md border border-blue-200 mb-4">
                        <h4 className="font-medium text-blue-800">
                          Default Task Information
                        </h4>
                        <p className="text-blue-700 text-sm mt-1">
                          <strong>Title:</strong> {task.title}
                        </p>
                        <p className="text-blue-700 text-sm mt-1">
                          <strong>Description:</strong> {task.description}
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor={`task-${task.id}-required-amount`}
                          className="block text-sm font-medium mb-1"
                        >
                          Required APT Amount
                        </label>
                        <input
                          type="number"
                          id={`task-${task.id}-required-amount`}
                          name="requiredAmount"
                          value={task.requiredAmount || ""}
                          onChange={(e) => handleTaskChange(task.id, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="0.1"
                          required
                          min="0.000001"
                          step="0.000001"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          The amount of APT that user must send to their wallet
                          to complete this task
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!formChanged || isSubmitting}
          >
            {isSubmitting ? "Creating Quest..." : "Create Quest"}
          </button>
        </div>

        {/* Quest Preview Section */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
          <h2 className="text-xl font-semibold">Quest Preview</h2>
          <p className="text-gray-600">
            This is how your quest will appear to users.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            {/* Card Preview */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-medium mb-4 self-start">
                Card Preview
              </h3>
              <div className="max-w-[300px] w-full">
                <div
                  className="pointer-events-none relative"
                  aria-label="Quest preview (not clickable)"
                >
                  <div className="absolute inset-0 z-10 bg-transparent"></div>
                  <QuestCard
                    id="preview"
                    title={questData.title || "Your Quest Title"}
                    description={
                      questData.description ||
                      "Your quest description will appear here. Make it engaging to attract users!"
                    }
                    imageUrl=""
                    projectName={questData.category || "learning"}
                    reward={Number(questData.reward) || 0}
                    difficulty={convertDifficultyToDisplay(
                      questData.difficulty,
                    )}
                    estimatedTime="15 min"
                    tasks={questData.tasks || []}
                  />
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-medium mb-4 self-start">
                Map Preview
              </h3>
              {questData.tasks.length > 0 ? (
                <div className="max-w-full w-full overflow-x-auto pb-4">
                  <div
                    className="pointer-events-none relative"
                    aria-label="Map preview (not clickable)"
                  >
                    <div className="absolute inset-0 z-10 bg-transparent"></div>
                    <QuestMap
                      questId="preview"
                      steps={questData.tasks.map(
                        (task, index) =>
                          ({
                            id: task.id,
                            title: task.title || `Step ${index + 1}`,
                            description:
                              task.description ||
                              "Complete this step to advance",
                            iconUrl: "",
                            type:
                              task.type === "quiz"
                                ? "quiz"
                                : task.type === "check-balance-increment"
                                  ? "check-balance"
                                  : "text",
                            isLocked: index > 0,
                            isCompleted: false,
                          }) as QuestStepUI,
                      )}
                      onStepClick={() => {}}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-500 w-full">
                  <p>Add some tasks to see the quest map preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Validation Button */}
        <div className="mt-4">
          <button
            type="button"
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={validateFormWrapper}
            disabled={isValidating || isSubmitting || !formChanged}
          >
            {isValidating ? "Validating..." : "Validate Quest"}
          </button>
        </div>
      </form>
    </div>
  );
}
