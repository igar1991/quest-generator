"use client";

import React, { useState, useEffect } from "react";
import { QuestStep as QuestStepType } from "../data/questStepsData";
import ConnectButton from "./ConnectButton";
import { useWallet } from "../context/WalletContext";
import Button from "./ui/Button";
import LinkButton from "./ui/LinkButton";

interface QuestStepProps {
  step: QuestStepType;
  onComplete: (stepId: string, isComplete: boolean) => void;
}

/**
 * Component that displays details for a single quest step
 * and handles validation and completion
 * @param props Contains step data and completion handler
 * @returns QuestStep component
 */
const QuestStep: React.FC<QuestStepProps> = ({ step, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address, isConnected } = useWallet();
  const [autoCompletedFirstStep, setAutoCompletedFirstStep] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Initialize success animation state based on step completion status
  useEffect(() => {
    if (step.isCompleted) {
      setShowSuccessAnimation(true);
    }
  }, [step.isCompleted]);

  // Auto-complete first step when connected - but only once
  useEffect(() => {
    if (
      step.id === "1-1" &&
      isConnected &&
      address &&
      !autoCompletedFirstStep &&
      !step.isCompleted
    ) {
      setAutoCompletedFirstStep(true);
      // Show success animation
      setShowSuccessAnimation(true);

      // Complete the current step and flag that we want to advance to the next step
      setTimeout(() => {
        onComplete(step.id, true);
      }, 1500); // Increased delay to match handleCompleteStep
    }
  }, [
    step.id,
    isConnected,
    address,
    onComplete,
    autoCompletedFirstStep,
    step.isCompleted,
  ]);

  /**
   * Handles validation and completion of the current step
   */
  const handleCompleteStep = () => {
    setIsSubmitting(true);

    // Show success animation
    setShowSuccessAnimation(true);

    // Simulate API call to verify step completion
    setTimeout(() => {
      // Complete the step which will trigger navigation to next step
      onComplete(step.id, true);
      setIsSubmitting(false);
    }, 1500); // Increased delay to give user time to see the success animation
  };

  /**
   * Handle wallet connection success
   */
  const handleWalletConnected = () => {
    // This method now only gets called when the wallet is connected
    // No need to do anything specific as address verification step is removed
  };

  return (
    <div
      className={`bg-white dark:bg-dark-100 rounded-xl shadow-md p-6 w-full max-w-lg mx-auto relative transition-all duration-300 ${showSuccessAnimation ? "ring-4 ring-green-400 scale-[1.02]" : ""}`}
    >
      {showSuccessAnimation && (
        <div className="absolute inset-0 bg-green-400/10 rounded-xl flex items-center justify-center z-10">
          <div className="bg-white dark:bg-dark-200 rounded-full p-4 shadow-lg">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          {step.isCompleted && (
            <div className="absolute bottom-4 text-center">
              <p className="text-green-600 dark:text-green-400 font-medium mb-2">
                Task completed successfully!
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
          <span className="text-2xl">{step.iconUrl ? "🚀" : "📝"}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {step.title}
        </h2>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {step.description}
      </p>

      {/* Wallet Connect for first step */}
      {step.id === "1-1" && !step.isCompleted && (
        <div className="mb-6">
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3 font-medium">
              Connect your wallet to begin this quest
            </p>
            <ConnectButton
              onSuccess={handleWalletConnected}
              className="w-full bg-blue-600 hover:bg-blue-700"
            />
          </div>

          {isConnected && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
              <p className="text-green-700 dark:text-green-400 text-sm">
                {address ? (
                  <>
                    Wallet connected!
                    <span className="block mt-1 font-mono text-xs break-all">
                      {address}
                    </span>
                  </>
                ) : (
                  "Wallet connected successfully!"
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Show completed message for first step if completed */}
      {step.id === "1-1" && step.isCompleted && (
        <div className="mb-6">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
            <p className="text-green-700 dark:text-green-400 text-sm">
              Wallet connected successfully!
              {address && (
                <span className="block mt-1 font-mono text-xs break-all">
                  {address}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Generic step completion */}
      {step.id !== "1-1" && !step.isCompleted && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Complete this task in your wallet or on the specified platform, then
            mark as complete.
          </p>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="complete"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              checked={step.isCompleted}
              onChange={(e) => {
                if (e.target.checked) {
                  // Show animation first
                  setShowSuccessAnimation(true);

                  // Then complete the step after a delay
                  setTimeout(() => {
                    onComplete(step.id, e.target.checked);
                  }, 1500);
                } else {
                  // If unchecking, update immediately without animation
                  // This is now disabled since we don't allow unchecking
                }
              }}
            />
            <label
              htmlFor="complete"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              I have completed this task
            </label>
          </div>
        </div>
      )}

      {/* Completion message for non-first steps */}
      {step.id !== "1-1" && step.isCompleted && (
        <div className="mb-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
            <p className="text-green-700 dark:text-green-400 text-sm font-medium">
              This task has been completed!
            </p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {step.id !== "1-1" && !step.isCompleted && (
          <Button
            onClick={handleCompleteStep}
            isLoading={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Processing..." : "Complete Step"}
          </Button>
        )}

        {/* External link button when relevant */}
        {step.id === "1-2" && !step.isCompleted && (
          <LinkButton
            href="https://coinmarketcap.com/currencies/aptos/markets/"
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            fullWidth
          >
            Get APT
          </LinkButton>
        )}

        {step.id === "1-3" && !step.isCompleted && (
          <LinkButton
            href="https://pontem.network/"
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            fullWidth
          >
            Go to Pontem DEX
          </LinkButton>
        )}

        {/* Next step button for completed tasks */}
        {step.isCompleted && (
          <Button
            onClick={() => {
              // Trigger navigation to next task via parent component
              onComplete(step.id, true);
            }}
            fullWidth
            variant="primary"
          >
            Continue to Next Step
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestStep;
