"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";

interface SuccessModalProps {
  questId: string;
  onClose: () => void;
  isOpen: boolean;
}

/**
 * Modal displayed after successful quest creation
 * @param questId - ID of the created quest
 * @param onClose - Function to call when the modal is closed
 * @param isOpen - Whether the modal is open
 * @returns Success modal component
 */
export default function SuccessModal({
  questId,
  onClose,
  isOpen,
}: SuccessModalProps) {
  const router = useRouter();
  const [copySuccess, setCopySuccess] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  /**
   * Controls the staggered animation of content
   */
  useEffect(() => {
    if (isOpen) {
      // Reset animation stages when modal opens
      setAnimationStage(0);

      // Stagger the animations
      const stageTimers = [
        setTimeout(() => setAnimationStage(1), 300), // Icon appears
        setTimeout(() => setAnimationStage(2), 500), // Title and text appear
        setTimeout(() => setAnimationStage(3), 700), // What's next section appears
        setTimeout(() => setAnimationStage(4), 900), // Quest ID and buttons appear
      ];

      return () => {
        // Clean up timers on close
        stageTimers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [isOpen]);

  /**
   * Navigate to the created quest page
   */
  const goToQuest = () => {
    router.push(`/quest/${encodeURIComponent(questId)}`);
  };

  /**
   * Copy quest link to clipboard with animation
   */
  const copyQuestLink = () => {
    const link = `${window.location.origin}/quest/${encodeURIComponent(questId)}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  /**
   * Helper to apply appropriate animation classes based on animation stage
   */
  const getAnimationClass = (stageRequired: number) => {
    return animationStage >= stageRequired
      ? "opacity-100 transform translate-y-0"
      : "opacity-0 transform translate-y-4";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <div
          className={`mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ease-out ${getAnimationClass(1)}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-600"
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
        </div>
        <div
          className={`transition-all duration-500 ease-out delay-100 ${getAnimationClass(2)}`}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Quest Created!
          </h3>
          <p className="text-gray-600">
            Your quest has been successfully created and is now available for
            users.
          </p>
        </div>

        <div
          className={`mt-4 p-3 bg-gray-50 rounded-lg transition-all duration-500 ease-out delay-150 ${getAnimationClass(3)}`}
        >
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            What&apos;s next?
          </h4>
          <ul className="text-sm text-left text-gray-600 space-y-2 pl-5 list-disc">
            <li>Share your quest link with potential participants</li>
            <li>Promote your quest on social media</li>
            <li>Check back to monitor quest completion progress</li>
          </ul>
        </div>

        <div
          className={`mt-4 flex justify-between items-center p-3 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 transition-all duration-500 ease-out delay-200 ${getAnimationClass(4)}`}
        >
          <span className="text-sm font-mono text-gray-600 truncate max-w-[80%]">
            {questId}
          </span>
          <button
            onClick={copyQuestLink}
            className={`relative p-2 rounded-md transition-all duration-200 ${
              copySuccess ? "bg-green-100" : "hover:bg-gray-200"
            }`}
            aria-label="Copy link"
          >
            {copySuccess ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
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
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            )}
            <span
              className={`absolute -top-1 -right-1 flex h-3 w-3 ${copySuccess ? "" : "opacity-0"}`}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </button>
        </div>
      </div>

      <div
        className={`flex flex-col sm:flex-row gap-3 justify-center transition-all duration-500 ease-out delay-300 ${getAnimationClass(4)}`}
      >
        <button
          onClick={goToQuest}
          className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium w-full transition-colors duration-200"
        >
          View Quest
        </button>
        <button
          onClick={onClose}
          className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-100 w-full transition-colors duration-200"
        >
          Create Another
        </button>
      </div>
    </Modal>
  );
}
