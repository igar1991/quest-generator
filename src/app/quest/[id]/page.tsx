"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import QuestMap from "../../components/QuestMap";
import QuestStep from "../../components/QuestStep";
import QuestCompletion from "../../components/QuestCompletion";
import { questsData } from "../../data/questsData";
import { QuestStepUI, QuestUI } from "../../types/quest";

/**
 * Quest detail page that shows quest information, progress map and step details
 * @returns Quest detail page
 */
export default function QuestDetail() {
  const params = useParams();
  const questId = params.id as string;
  const [quest, setQuest] = useState<QuestUI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuest() {
      setLoading(true);
      setError(null);

      try {
        console.log(`Loading quest with ID: ${questId}`);
        // First check if it's a demo quest
        const mockQuest = questsData.find((q) => q.id === questId);

        if (mockQuest) {
          console.log("Found quest in mock data");
          setQuest(mockQuest as unknown as QuestUI);
          setLoading(false);
          return;
        }

        console.log("Fetching quest from API...");
        // If not a mock quest, try to fetch from API
        const response = await fetch(
          `/api/quests/${encodeURIComponent(questId)}`,
          {
            cache: "no-store", // Prevent caching issues
            headers: {
              "Cache-Control": "no-cache",
            },
          },
        );

        console.log(`API response status: ${response.status}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API error response:", errorData);
          throw new Error(
            typeof errorData.error === "string"
              ? errorData.error
              : "Failed to load quest",
          );
        }

        const responseText = await response.text();
        console.log(`Response text length: ${responseText.length}`);

        let questData;
        try {
          questData = JSON.parse(responseText);
          console.log("Successfully parsed quest data:", questData.id);
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError);
          console.error("Raw response:", responseText);
          throw new Error("Invalid response format from server");
        }

        setQuest(questData as QuestUI);
      } catch (error) {
        console.error("Error loading quest:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Quest not found or failed to load",
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuest();
  }, [questId]);

  // Transform quest tasks into quest steps with UI state
  const initializeSteps = useCallback((): QuestStepUI[] => {
    if (!quest) return [];

    const tasks = "tasks" in quest ? quest.tasks : [];

    if (!Array.isArray(tasks)) return [];

    return tasks.map((task, index) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      iconUrl: getIconForTaskType(task.type),
      isCompleted: false,
      isLocked: index > 0, // Only first step is unlocked initially
      type: mapTaskType(task.type),
      question: task.question,
      options: task.options,
      correctAnswer: task.correctAnswer,
      requiredAmount: task.requiredAmount,
    }));
  }, [quest]);

  // Map backend task types to UI task types
  const mapTaskType = (type: string): QuestStepUI["type"] => {
    switch (type) {
      case "connect-wallet":
        return "connect-wallet";
      case "check-balance":
        return "check-balance";
      case "quiz":
        return "quiz";
      case "text":
        return "text";
      case "action":
        return "action";
      default:
        return "text";
    }
  };

  // Get an icon URL based on task type
  const getIconForTaskType = (type: string): string => {
    switch (type) {
      case "connect-wallet":
        return "/images/quest-icons/wallet.svg";
      case "check-balance":
        return "/images/quest-icons/topup.svg";
      case "quiz":
        return "/images/quest-icons/quiz.svg";
      default:
        return "/images/quest-icons/task.svg";
    }
  };

  // Initialize steps state
  const [steps, setSteps] = useState<QuestStepUI[]>([]);
  const [activeStep, setActiveStep] = useState<QuestStepUI | null>(null);
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);

  // Update steps when quest data is loaded
  useEffect(() => {
    if (quest) {
      const initializedSteps = initializeSteps();
      setSteps(initializedSteps);
    }
  }, [quest, initializeSteps]);

  // Initialize active step to the first unlocked step
  useEffect(() => {
    // Find the first uncompleted unlocked step
    const firstUncompletedStep = steps.find(
      (step) => !step.isLocked && !step.isCompleted,
    );

    // Check if all steps are completed
    const areAllStepsCompleted =
      steps.length > 0 && steps.every((step) => step.isCompleted);
    setAllStepsCompleted(areAllStepsCompleted);

    // Or if all steps are completed, show the last step
    const lastStep = steps[steps.length - 1];

    if (firstUncompletedStep) {
      setActiveStep(firstUncompletedStep);
    } else if (lastStep && lastStep.isCompleted) {
      setActiveStep(lastStep);
    } else {
      const firstUnlockedStep = steps.find((step) => !step.isLocked);
      if (firstUnlockedStep) {
        setActiveStep(firstUnlockedStep);
      }
    }
  }, [steps]);

  /**
   * Handle clicking on a step in the quest map
   * @param step The step that was clicked
   */
  const handleStepClick = (step: QuestStepUI) => {
    // Prevent clicking if step is locked
    if (step.isLocked) return;

    // Prevent navigating back to completed steps unless it's the last completed step
    if (step.isCompleted) {
      const completedSteps = steps.filter((s) => s.isCompleted);
      const isLastCompletedStep =
        completedSteps[completedSteps.length - 1]?.id === step.id;

      if (!isLastCompletedStep) {
        return; // Don't allow navigating to this completed step
      }
    }

    setActiveStep(step);
  };

  /**
   * Handle step completion - updates step state and unlocks next step
   * @param stepId ID of the completed step
   * @param isComplete Whether the step is completed
   */
  const handleStepComplete = (stepId: string, isComplete: boolean) => {
    // Find the current step's index
    const currentIndex = steps.findIndex((step) => step.id === stepId);

    if (currentIndex === -1) return;

    // For debugging
    console.log(
      `Completing step ${stepId} at index ${currentIndex}, isComplete: ${isComplete}`,
    );

    // Create a copy of steps to update
    const updatedSteps = [...steps];

    // Update the current step's completion status - ensure all required properties are preserved
    const existingStep = updatedSteps[currentIndex];
    if (!existingStep) return; // Safety check

    updatedSteps[currentIndex] = {
      id: existingStep.id,
      title: existingStep.title,
      description: existingStep.description,
      iconUrl: existingStep.iconUrl,
      type: existingStep.type,
      isLocked: existingStep.isLocked,
      isCompleted: isComplete,
      question: existingStep.question,
      options: existingStep.options,
      correctAnswer: existingStep.correctAnswer,
      requiredAmount: existingStep.requiredAmount,
    };

    // If current step is completed and there's a next step, unlock it
    if (isComplete && currentIndex < steps.length - 1) {
      const nextStep = updatedSteps[currentIndex + 1];
      if (!nextStep) return; // Safety check

      updatedSteps[currentIndex + 1] = {
        id: nextStep.id,
        title: nextStep.title,
        description: nextStep.description,
        iconUrl: nextStep.iconUrl,
        type: nextStep.type,
        isLocked: false, // Unlock this step
        isCompleted: nextStep.isCompleted,
        question: nextStep.question,
        options: nextStep.options,
        correctAnswer: nextStep.correctAnswer,
        requiredAmount: nextStep.requiredAmount,
      };

      // Update steps immediately (updates the map)
      setSteps(updatedSteps);

      // Always advance to the next step after completion with a delay to match animation
      setTimeout(() => {
        const nextStep = updatedSteps[currentIndex + 1];
        if (nextStep) {
          console.log(`Advancing to next step: ${nextStep.id}`);
          setActiveStep(nextStep);
        }
      }, 1500);
    } else {
      // Update steps immediately (updates the map)
      setSteps(updatedSteps);

      // Check if this was the last step completion
      if (isComplete && currentIndex === steps.length - 1) {
        // All steps are now completed, will trigger showing the completion screen
        setTimeout(() => {
          setAllStepsCompleted(true);
        }, 1500);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-100 dark:bg-dark-300 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-8 text-center w-full max-w-md">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-blue-200 dark:bg-blue-700 rounded-full mb-4"></div>
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading quest...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="min-h-screen bg-light-100 dark:bg-dark-300 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-8 text-center w-full max-w-md">
            <div className="text-red-500 dark:text-red-400 text-5xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Quest Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The quest you&apos;re looking for doesn&apos;t exist or could not
              be loaded.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Home Page
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-100 dark:bg-dark-300 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quest header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {quest.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {quest.description}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {quest.projectName !== undefined &&
              quest.projectName !== null &&
              quest.projectName !== ""
                ? quest.projectName
                : "Community Quest"}
            </span>
            <span className="bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
              Reward: {quest.reward} APT
            </span>
            <span className="bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
              {quest.difficulty || "Beginner"}
            </span>
            <span className="bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
              ⏱️ {quest.estimatedTime ?? "15 min"}
            </span>
          </div>
        </div>

        {allStepsCompleted ? (
          // Full width completion screen without the map
          <div className="mt-4">
            <QuestCompletion
              questTitle={quest.title}
              reward={
                typeof quest.reward === "string"
                  ? Number(quest.reward)
                  : Number(quest.reward || 0)
              }
            />
          </div>
        ) : (
          // Regular grid layout with map and steps
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quest map */}
            <div className="order-2 lg:order-1">
              <QuestMap
                steps={steps}
                questId={questId}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Step details */}
            <div className="order-1 lg:order-2">
              {activeStep ? (
                <QuestStep
                  key={activeStep.id}
                  step={activeStep}
                  onComplete={handleStepComplete}
                  currentStepIndex={steps.findIndex(
                    (step) => step.id === activeStep.id,
                  )}
                  totalSteps={steps.length}
                />
              ) : (
                <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    Select a step from the quest map to begin.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
