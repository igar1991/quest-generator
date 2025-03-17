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
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address, isConnected } = useWallet();
  const [autoCompletedFirstStep, setAutoCompletedFirstStep] = useState(false);

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
      onComplete(step.id, true);
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

  /**
   * Handle wallet connection success
   * @param connectedAddress The connected wallet address
   */
  const handleWalletConnected = (connectedAddress: string) => {
    // For step 1-2, auto-fill the input with the connected address
    if (connectedAddress) {
      setInputValue(connectedAddress);
    }

    // Note: We're not calling onComplete here anymore as it's handled by the useEffect
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

      {/* Wallet Connect for first step */}
      {step.id === "1-1" && (
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

      {/* Your Aptos Address input for step 1-2 */}
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
      {step.id !== "1-1" && step.id !== "1-2" && (
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
          <Button
            onClick={handleCompleteStep}
            disabled={isSubmitting || !inputValue}
            isLoading={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Verifying..." : "Verify Address"}
          </Button>
        )}

        {step.id !== "1-1" && step.id !== "1-2" && !step.isCompleted && (
          <Button
            onClick={handleCompleteStep}
            isLoading={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Processing..." : "Complete Step"}
          </Button>
        )}

        {/* External link button when relevant */}
        {step.id === "1-3" && (
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

        {step.id === "1-4" && (
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
      </div>
    </div>
  );
};

export default QuestStep;
