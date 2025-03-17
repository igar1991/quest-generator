"use client";

import React, { useState } from "react";
import { QuestStep as QuestStepType } from "../data/questStepsData";

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
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles validation and completion of the current step
   */
  const handleCompleteStep = () => {
    setIsSubmitting(true);
    setValidationError("");

    // If step has a validation function, check input
    if (step.validationFunction && inputValue) {
      const result = step.validationFunction(inputValue);

      if (!result.isValid) {
        setValidationError(result.message);
        setIsSubmitting(false);
        return;
      }
    }

    // Simulate API call to verify step completion
    setTimeout(() => {
      onComplete(step.id, true);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-6 w-full max-w-lg mx-auto">
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

      {/* Different input types based on step */}
      {step.id === "1-2" && (
        <div className="mb-4">
          <label
            htmlFor="aptosAddress"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Your Aptos Address
          </label>
          <input
            type="text"
            id="aptosAddress"
            placeholder="0x..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {validationError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {validationError}
            </p>
          )}
        </div>
      )}

      {/* Generic step completion */}
      {step.id !== "1-2" && (
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
              onChange={(e) => onComplete(step.id, e.target.checked)}
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

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {step.id === "1-2" && (
          <button
            onClick={handleCompleteStep}
            disabled={isSubmitting || !inputValue}
            className={`
              ${isSubmitting ? "bg-gray-400 cursor-wait" : "bg-primary hover:bg-primary/90"} 
              text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors
              disabled:bg-gray-300 disabled:cursor-not-allowed
              w-full sm:w-auto
            `}
          >
            {isSubmitting ? "Verifying..." : "Verify Address"}
          </button>
        )}

        {step.id !== "1-2" && !step.isCompleted && (
          <button
            onClick={handleCompleteStep}
            disabled={isSubmitting}
            className={`
              ${isSubmitting ? "bg-gray-400 cursor-wait" : "bg-primary hover:bg-primary/90"} 
              text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors
              w-full sm:w-auto
            `}
          >
            {isSubmitting ? "Processing..." : "Complete Step"}
          </button>
        )}

        {/* External link button when relevant */}
        {step.id === "1-3" && (
          <a
            href="https://coinmarketcap.com/currencies/aptos/markets/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center w-full sm:w-auto"
          >
            Get APT
          </a>
        )}

        {step.id === "1-4" && (
          <a
            href="https://pontem.network/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center w-full sm:w-auto"
          >
            Go to Pontem DEX
          </a>
        )}
      </div>
    </div>
  );
};

export default QuestStep;
