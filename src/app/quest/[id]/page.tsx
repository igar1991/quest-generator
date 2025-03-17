"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import QuestMap from "../../components/QuestMap";
import QuestStep from "../../components/QuestStep";
import QuestCompletion from "../../components/QuestCompletion";
import { questsData } from "../../data/questsData";
import {
  questStepsData,
  QuestStep as QuestStepType,
} from "../../data/questStepsData";

/**
 * Quest detail page that shows quest information, progress map and step details
 * @returns Quest detail page
 */
export default function QuestDetail() {
  const params = useParams();
  const questId = params.id as string;

  // Get quest data
  const quest = questsData.find((q) => q.id === questId);

  // Get steps for this quest
  const [steps, setSteps] = useState<QuestStepType[]>(
    questStepsData[questId] || [],
  );
  const [activeStep, setActiveStep] = useState<QuestStepType | null>(null);
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);

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
  const handleStepClick = (step: QuestStepType) => {
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

    // Update the current step's completion status
    updatedSteps[currentIndex] = {
      ...updatedSteps[currentIndex],
      isCompleted: isComplete,
    };

    // If current step is completed and there's a next step, unlock it
    if (isComplete && currentIndex < steps.length - 1) {
      updatedSteps[currentIndex + 1] = {
        ...updatedSteps[currentIndex + 1],
        isLocked: false,
      };

      // Update steps immediately (updates the map)
      setSteps(updatedSteps);

      // Always advance to the next step after completion with a delay to match animation
      setTimeout(() => {
        const nextStep = updatedSteps[currentIndex + 1];
        console.log(`Advancing to next step: ${nextStep.id}`);
        setActiveStep(nextStep);
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

  if (!quest) {
    return <div>Quest not found</div>;
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
              {quest.projectName}
            </span>
            <span className="bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
              Reward: {quest.reward} APT
            </span>
            <span className="bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
              {quest.difficulty}
            </span>
            <span className="bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
              ⏱️ {quest.estimatedTime}
            </span>
          </div>
        </div>

        {allStepsCompleted ? (
          // Full width completion screen without the map
          <div className="mt-4">
            <QuestCompletion questTitle={quest.title} reward={quest.reward} />
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
