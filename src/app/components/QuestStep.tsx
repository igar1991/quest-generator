"use client";

import React, { useState, useEffect } from "react";
import ConnectButton from "./ConnectButton";
import { useWallet } from "../context/WalletContext";
import Button from "./ui/Button";

// Define the interface to match QuestStepUI from the quest page
interface QuestStepUI {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  type?: "connect-wallet" | "check-balance" | "quiz";
  question?: string;
  options?: string[];
  correctAnswer?: string;
  requiredAmount?: string;
}

interface QuestStepProps {
  step: QuestStepUI;
  onComplete: (stepId: string, isComplete: boolean) => void;
  currentStepIndex?: number;
  totalSteps?: number;
}

/**
 * Component that displays details for a single quest step
 * and handles validation and completion
 * @param props Contains step data, completion handler, and progress info
 * @returns QuestStep component
 */
const QuestStep: React.FC<QuestStepProps> = ({
  step,
  onComplete,
  currentStepIndex = 0,
  totalSteps = 0,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address, isConnected, balance } = useWallet();
  const [autoCompletedFirstStep, setAutoCompletedFirstStep] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [initialBalance, setInitialBalance] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);

  // Initialize success animation state based on step completion status
  useEffect(() => {
    if (step.isCompleted) {
      setShowSuccessAnimation(true);
    } else {
      setShowSuccessAnimation(false);
    }
  }, [step]);

  // Store initial balance when connect-wallet task is completed
  useEffect(() => {
    if (
      step.type === "connect-wallet" &&
      isConnected &&
      balance !== undefined &&
      initialBalance === null
    ) {
      setInitialBalance(balance);
    }
  }, [step.type, isConnected, balance, initialBalance]);

  // Auto-complete connect-wallet step when connected - but only once
  useEffect(() => {
    if (
      step.type === "connect-wallet" &&
      isConnected &&
      address &&
      !autoCompletedFirstStep &&
      !step.isCompleted
    ) {
      setAutoCompletedFirstStep(true);
      setIsSubmitting(true);

      // Immediately show success animation
      setShowSuccessAnimation(true);

      // Wait for animation to be visible before proceeding
      setTimeout(() => {
        // Complete the step which will trigger navigation to next step
        onComplete(step.id, true);
        setIsSubmitting(false);
      }, 2000); // Longer delay to enjoy the success animation
    }
  }, [
    step.id,
    step.type,
    isConnected,
    address,
    onComplete,
    autoCompletedFirstStep,
    step.isCompleted,
  ]);

  /**
   * Handles validation and completion of check-balance task
   */
  const handleCheckBalanceComplete = () => {
    if (!isConnected || balance === undefined || initialBalance === null) {
      return;
    }

    const requiredAmount = step.requiredAmount
      ? Number(step.requiredAmount)
      : 0;
    const balanceIncrease = balance - initialBalance;

    if (balanceIncrease >= requiredAmount) {
      handleCompleteStep();
    } else {
      alert(
        `Please add at least ${requiredAmount} APT to your wallet. Current increase: ${balanceIncrease} APT`,
      );
    }
  };

  /**
   * Handles validation and completion of quiz task
   */
  const handleQuizSubmit = () => {
    if (!selectedOption || !step.correctAnswer) return;

    const isCorrect = selectedOption === step.correctAnswer;

    setQuizAnswer({
      isCorrect,
      message: isCorrect
        ? "Correct! Great job!"
        : "Sorry, that's not correct. Try again.",
    });

    if (isCorrect) {
      // Immediately show success animation
      setShowSuccessAnimation(true);
      setIsSubmitting(true);

      // Wait for animation to be visible before proceeding
      setTimeout(() => {
        // Complete the step which will trigger navigation to next step
        onComplete(step.id, true);
        setIsSubmitting(false);
      }, 2000); // Longer delay to enjoy the success animation
    }
  };

  /**
   * Handles validation and completion of the current step
   */
  const handleCompleteStep = () => {
    // Already submitting, don't do anything
    if (isSubmitting) return;

    setIsSubmitting(true);
    console.log(`Starting completion of step ${step.id}`);

    // Immediately show success animation
    setShowSuccessAnimation(true);

    // Simulate API call to verify step completion
    setTimeout(() => {
      console.log(`Calling onComplete for step ${step.id}`);
      // Complete the step which will trigger navigation to next step
      onComplete(step.id, true);
      setIsSubmitting(false);
    }, 1500); // Increased delay to give user time to see the success animation
  };

  /**
   * Renders the appropriate UI for the current task type
   */
  const renderTaskUI = () => {
    if (step.isCompleted) {
      return (
        <div className="mb-4 text-green-600 dark:text-green-400 text-sm">
          Task completed! Moving to next task...
        </div>
      );
    }

    switch (step.type) {
      case "connect-wallet":
        return (
          <div className="mb-6">
            <ConnectButton
              onSuccess={() => {}} // Handled by useEffect
              className="w-full bg-blue-600 hover:bg-blue-700"
            />

            {isConnected && (
              <div className="mt-3 text-green-600 dark:text-green-400 text-sm">
                {address ? (
                  <>
                    Wallet connected:
                    <span className="font-mono text-xs break-all ml-1">
                      {address.substring(0, 10)}...
                      {address.substring(address.length - 8)}
                    </span>
                    {balance !== undefined && (
                      <div className="mt-1">Balance: {balance} APT</div>
                    )}
                  </>
                ) : (
                  "Wallet connected successfully!"
                )}
              </div>
            )}
          </div>
        );

      case "check-balance":
        return (
          <div className="mb-6">
            <div className="mb-4">
              {isConnected ? (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Initial balance:{" "}
                      {initialBalance !== null
                        ? `${initialBalance} APT`
                        : "Not recorded yet"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current balance:{" "}
                      {balance !== undefined ? `${balance} APT` : "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Required increase: {step.requiredAmount} APT
                    </p>
                  </div>

                  <Button
                    onClick={handleCheckBalanceComplete}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Verify Balance Increase
                  </Button>
                </>
              ) : (
                <div className="text-amber-600 dark:text-amber-400 mb-4">
                  Please connect your wallet first to check balance.
                  <div className="mt-2">
                    <ConnectButton
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onSuccess={() => {}}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "quiz":
        return (
          <div className="mb-6">
            {step.question && step.options && (
              <>
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {step.question}
                  </h3>

                  <div className="space-y-2">
                    {step.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`option-${index}`}
                          name="quiz-option"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                          checked={selectedOption === option}
                          onChange={() => {
                            setSelectedOption(option);
                            // Only clear answer feedback when changing option
                            if (selectedOption !== option) {
                              setQuizAnswer(null);
                            }
                          }}
                          disabled={isSubmitting && quizAnswer?.isCorrect}
                        />
                        <label
                          htmlFor={`option-${index}`}
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {quizAnswer && (
                  <div
                    className={`mb-4 p-3 rounded-lg flex items-center ${
                      quizAnswer.isCorrect
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div
                      className={`mr-3 flex-shrink-0 ${
                        quizAnswer.isCorrect ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {quizAnswer.isCorrect ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        quizAnswer.isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {quizAnswer.isCorrect
                        ? "Correct! Great job! 🎉"
                        : "Sorry, that's not correct. Please try again 🤔"}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={handleQuizSubmit}
                    disabled={
                      !selectedOption || (isSubmitting && quizAnswer?.isCorrect)
                    }
                    className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {quizAnswer?.isCorrect && isSubmitting
                      ? "Proceeding..."
                      : "Submit Answer"}
                  </button>
                </div>
              </>
            )}
          </div>
        );

      default:
        return (
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="complete"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                checked={step.isCompleted}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleCompleteStep();
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
        );
    }
  };

  return (
    <div
      className={`bg-white dark:bg-dark-100 rounded-xl shadow-md p-6 w-full max-w-lg mx-auto relative transition-all duration-300 ${showSuccessAnimation ? "ring-2 ring-green-400" : isSubmitting ? "ring-2 ring-gray-400" : ""}`}
    >
      {/* Success animation overlay */}
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
        </div>
      )}

      {/* Processing overlay */}
      {isSubmitting && !showSuccessAnimation && (
        <div className="absolute inset-0 bg-gray-400/10 rounded-xl flex items-center justify-center z-10">
          <div className="bg-white dark:bg-dark-200 rounded-full p-4 shadow-lg">
            <svg
              className="w-12 h-12 text-gray-500 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      )}

      {/* Progress indicator - integrated into the card header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
            {step.type === "connect-wallet" && (
              <span className="text-2xl">👛</span>
            )}
            {step.type === "check-balance" && (
              <span className="text-2xl">💰</span>
            )}
            {step.type === "quiz" && <span className="text-2xl">🎓</span>}
            {!step.type && <span className="text-2xl">📝</span>}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {step.title}
          </h2>
        </div>

        {totalSteps > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Task {currentStepIndex + 1} of {totalSteps}
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {step.description}
      </p>

      {/* Task-specific UI */}
      {renderTaskUI()}
    </div>
  );
};

export default QuestStep;
