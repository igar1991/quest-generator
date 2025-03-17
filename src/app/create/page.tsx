"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateQuestLocal } from "../../utils/questApi";

type TaskType = "text" | "quiz" | "action";

interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;

  // For quiz type
  question?: string;
  options?: string[];
  correctAnswer?: string;

  // For action type
  actionUrl?: string;
  successCondition?: string;
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
  const [questData, setQuestData] = useState<QuestData>({
    title: "",
    description: "",
    reward: "",
    totalUsers: "",
    category: "learning",
    difficulty: "beginner",
    tasks: [],
  });

  const [currentTaskType, setCurrentTaskType] = useState<TaskType>("text");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [formChanged, setFormChanged] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
   * Handles form submission - validates quest data before proceeding
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert values to string if they're not already
    const formattedQuestData = {
      ...questData,
      reward: questData.reward.toString(),
      totalUsers: questData.totalUsers.toString(),
    };

    // Validate the quest data
    const validationResult = validateQuestLocal(formattedQuestData);

    if (!validationResult.isValid) {
      setErrorMessage(validationResult.error || "Invalid quest data");
      // Highlight the field with error if available
      if (validationResult.field) {
        // You may want to add logic to highlight the field with error
        console.error(`Field with error: ${validationResult.field}`);
      }
      return;
    }

    const jsonData = JSON.stringify(formattedQuestData, null, 2);
    console.log("Valid quest data:", jsonData);
    setSuccessMessage("Quest data is valid and has been logged to the console");
    setErrorMessage("");
  };

  // Calculate total APT
  const calculateTotalAPT = () => {
    if (!questData.reward || !questData.totalUsers) return 0;

    const rewardValue = parseFloat(questData.reward);
    const totalUsersValue = parseInt(questData.totalUsers);

    if (isNaN(rewardValue) || isNaN(totalUsersValue)) return 0;

    return (rewardValue * totalUsersValue).toFixed(2);
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

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Quest Information */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
          <h2 className="text-xl font-semibold">Quest Information</h2>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={questData.title}
              onChange={handleQuestDataChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
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
                min="0"
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
                min="1"
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
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={questData.category}
                onChange={handleQuestDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="learning">Learning</option>
                <option value="development">Development</option>
                <option value="testing">Testing</option>
                <option value="engagement">Engagement</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium mb-1"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={questData.difficulty}
                onChange={handleQuestDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
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
                <option value="text">Text Instruction</option>
                <option value="quiz">Quiz Question</option>
                <option value="action">Action Verification</option>
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
                    {task.type === "text"
                      ? "Text Instruction"
                      : task.type === "quiz"
                        ? "Quiz Question"
                        : "Action Verification"}
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
                    />
                  </div>

                  {task.type === "quiz" && (
                    <div className="space-y-4">
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
                          value={task.question || ""}
                          onChange={(e) => handleTaskChange(task.id, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
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
                    </div>
                  )}

                  {task.type === "action" && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor={`task-${task.id}-action-url`}
                          className="block text-sm font-medium mb-1"
                        >
                          Action URL
                        </label>
                        <input
                          type="url"
                          id={`task-${task.id}-action-url`}
                          name="actionUrl"
                          value={task.actionUrl || ""}
                          onChange={(e) => handleTaskChange(task.id, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="https://example.com"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`task-${task.id}-success-condition`}
                          className="block text-sm font-medium mb-1"
                        >
                          Success Condition
                        </label>
                        <input
                          type="text"
                          id={`task-${task.id}-success-condition`}
                          name="successCondition"
                          value={task.successCondition || ""}
                          onChange={(e) => handleTaskChange(task.id, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="e.g., User completes transaction"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium w-full sm:w-auto"
          >
            Create Quest
          </button>
        </div>
      </form>
    </div>
  );
}
