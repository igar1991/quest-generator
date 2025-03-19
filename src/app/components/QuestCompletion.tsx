"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import Confetti to avoid SSR issues
const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

interface QuestCompletionProps {
  questTitle: string;
  reward: number;
}

/**
 * Component that displays the final completion view after all quest steps are completed
 * @param props Contains quest title and reward amount
 * @returns QuestCompletion component
 */
const QuestCompletion: React.FC<QuestCompletionProps> = ({
  questTitle,
  reward,
}) => {
  const [confettiWidth, setConfettiWidth] = useState(0);
  const [confettiHeight, setConfettiHeight] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    // Set confetti dimensions to window size
    setConfettiWidth(window.innerWidth);
    setConfettiHeight(window.innerHeight);

    // Update confetti dimensions on window resize
    const handleResize = () => {
      setConfettiWidth(window.innerWidth);
      setConfettiHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * Handles claiming the reward
   */
  const handleClaimReward = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsClaimed(true);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-8 w-full max-w-2xl mx-auto relative transition-all duration-300 ring-4 ring-green-400 scale-[1.02] overflow-hidden">
      <Confetti
        width={confettiWidth}
        height={confettiHeight}
        recycle={false}
        numberOfPieces={500}
        gravity={0.15}
      />

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Congratulations!
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          You&apos;ve Completed the Quest!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          You have successfully completed all steps in &quot;{questTitle}&quot;
          and earned {reward} APT.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <div className="text-center relative">
          <button
            onClick={handleClaimReward}
            disabled={isClaimed || isProcessing}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white min-h-[48px] font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary px-6 py-3 text-base ${
              isClaimed
                ? "bg-green-600 hover:bg-green-600 cursor-not-allowed"
                : ""
            } ${isProcessing ? "cursor-wait" : ""}`}
          >
            <div className="flex items-center justify-center">
              {isProcessing && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
              )}
              {!isProcessing && !isClaimed && (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              )}
              {isClaimed && (
                <svg
                  className="w-5 h-5 mr-2"
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
              )}
              {isClaimed ? "Claimed" : "Claim Reward"}
            </div>
          </button>

          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-200/80 rounded-lg">
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin h-10 w-10 text-primary mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
                <p className="text-primary font-medium">Processing...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestCompletion;
