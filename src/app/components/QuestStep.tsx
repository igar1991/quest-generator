"use client";

import React, { useState, useEffect } from "react";
import ConnectButton from "./ConnectButton";
import { useWallet } from "../context/WalletContext";
import Button from "./ui/Button";
import { QuestStepUI } from "../types/quest";

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
      address !== null &&
      address !== "" &&
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
      }, 1000); // Shorter delay for better user experience
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
    // Always show the animation and complete the step
    console.log("Checking balance increase (demo mode - auto success)");

    // Show animation
    setIsSubmitting(true);

    // Immediately show success animation
    setShowSuccessAnimation(true);

    // Wait for animation to be visible before proceeding
    setTimeout(() => {
      // Complete the step which will trigger navigation to next step
      onComplete(step.id, true);
      setIsSubmitting(false);
    }, 1500);
  };

  /**
   * Handles validation and completion of quiz task
   */
  const handleQuizSubmit = () => {
    if (
      selectedOption === null ||
      selectedOption === undefined ||
      selectedOption === "" ||
      step.correctAnswer === undefined ||
      step.correctAnswer === null ||
      step.correctAnswer === ""
    )
      return;

    const isCorrect = selectedOption === step.correctAnswer;

    setQuizAnswer({
      isCorrect,
      message: isCorrect
        ? "Correct! Great job!"
        : "Sorry, that's not correct. Try again.",
    });

    if (isCorrect) {
      // Handle successful answer
      setIsSubmitting(true);

      // Show success animation
      setShowSuccessAnimation(true);

      // Allow animation to show before proceeding
      setTimeout(() => {
        // Complete the step which will trigger navigation to next step
        onComplete(step.id, true);
        setIsSubmitting(false);
      }, 2000); // Longer delay for animation
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
                {address !== null && address !== "" ? (
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
                  <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                    <div className="grid grid-cols-1 gap-3">
                      {initialBalance !== null && (
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <p className="text-sm font-medium text-blue-700">
                            Initial balance:{" "}
                            <span className="font-mono">
                              {initialBalance} APT
                            </span>
                          </p>
                        </div>
                      )}

                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <p className="text-sm font-medium text-green-700">
                          Current balance:{" "}
                          <span className="font-mono">
                            {balance !== undefined
                              ? `${balance} APT`
                              : "Unknown"}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-purple-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          ></path>
                        </svg>
                        <p className="text-sm font-medium text-purple-700">
                          Required increase:{" "}
                          <span className="font-mono font-bold">
                            {step.requiredAmount} APT
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckBalanceComplete}
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-h-[48px]"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    }
                  >
                    Verify Balance Increase
                  </Button>
                </>
              ) : (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 text-amber-700 mb-4">
                  <div className="flex items-center mb-3">
                    <svg
                      className="w-5 h-5 text-amber-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      ></path>
                    </svg>
                    <span className="font-medium">
                      Please connect your wallet first to check balance.
                    </span>
                  </div>
                  <ConnectButton
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onSuccess={() => {}}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case "quiz":
        return (
          <div className="mb-6">
            {step.question !== undefined &&
              step.question !== null &&
              step.question !== "" &&
              step.options !== undefined &&
              step.options.length > 0 && (
                <>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">
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
                              if (quizAnswer !== null) {
                                setQuizAnswer(null);
                              }
                            }}
                            disabled={
                              isSubmitting === true &&
                              quizAnswer?.isCorrect === true
                            }
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

                  {quizAnswer !== null && (
                    <div
                      className={`mb-4 p-3 rounded-lg flex items-center ${
                        quizAnswer.isCorrect === true
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div
                        className={`mr-3 flex-shrink-0 ${
                          quizAnswer.isCorrect === true
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {quizAnswer.isCorrect === true ? (
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          quizAnswer.isCorrect === true
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {quizAnswer.isCorrect === true
                          ? "Correct! Great job! 🎉"
                          : "Sorry, that's not correct. Try again."}
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Button
                      onClick={handleQuizSubmit}
                      variant="primary"
                      size="lg"
                      fullWidth
                      className="bg-blue-600 hover:bg-blue-700 text-white min-h-[48px]"
                      disabled={
                        selectedOption === null ||
                        selectedOption === undefined ||
                        selectedOption === "" ||
                        (isSubmitting === true &&
                          quizAnswer?.isCorrect === true)
                      }
                      isLoading={
                        quizAnswer?.isCorrect === true && isSubmitting === true
                      }
                      icon={
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          ></path>
                        </svg>
                      }
                    >
                      {quizAnswer?.isCorrect === true && isSubmitting === true
                        ? "Proceeding..."
                        : "Submit Answer"}
                    </Button>
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
      className={`bg-white dark:bg-dark-100 rounded-xl shadow-lg hover:shadow-xl p-6 w-full max-w-lg mx-auto relative transition-all duration-300 ${
        showSuccessAnimation
          ? "ring-4 ring-green-400"
          : isSubmitting
            ? "ring-2 ring-gray-400"
            : "border border-gray-100"
      }`}
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
      <div className="flex flex-wrap items-center justify-between mb-5 gap-2">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mr-4 shadow-sm">
            {step.type === "connect-wallet" && (
              <span className="text-2xl">👛</span>
            )}
            {step.type === "check-balance" && (
              <span className="text-2xl">💰</span>
            )}
            {step.type === "quiz" && <span className="text-2xl">🎓</span>}
            {!step.type && <span className="text-2xl">📝</span>}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {step.title}
          </h2>
        </div>

        {totalSteps > 0 && (
          <div className="px-3 py-1.5 bg-gray-100 dark:bg-dark-200 rounded-full text-sm text-gray-600 dark:text-gray-400 font-medium shadow-sm">
            Task {currentStepIndex + 1} of {totalSteps}
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6 text-base sm:text-lg">
        {step.description}
      </p>

      {/* Task-specific UI */}
      {renderTaskUI()}
    </div>
  );
};

export default QuestStep;
