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
  const [copied, setCopied] = useState(false);

  // Store the promo code in state so it doesn't change on re-renders
  const [promoCode] = useState(() => {
    return `APT-${questTitle.slice(0, 3).toUpperCase()}-${reward}-${Math.floor(
      Math.random() * 10000,
    )
      .toString()
      .padStart(4, "0")}`;
  });

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
   * Handles copying the promo code to clipboard
   */
  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
        <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Your reward promo code
          </p>

          <div className="mb-4">
            <div className="relative bg-white dark:bg-dark-300 py-4 px-6 rounded border border-gray-200 dark:border-dark-400 mx-auto">
              <code className="block font-mono text-2xl text-primary text-center">
                {promoCode}
              </code>
              <button
                onClick={handleCopyCode}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-md transition-colors"
                aria-label="Copy promo code"
              >
                {copied ? (
                  <svg
                    className="w-5 h-5"
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
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 6h12a2 2 0 012 2v10a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Use this code on our rewards page to claim your APT.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestCompletion;
