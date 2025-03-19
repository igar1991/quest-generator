"use client";

import React, { ReactNode } from "react";

interface CardTemplateProps {
  /** Card title */
  title: string;
  /** Card description */
  description?: string;
  /** Optional icon to display in the header */
  icon?: ReactNode;
  /** Optional indication like "Task 1 of 3" */
  indicator?: string;
  /** Children components to render in the card body */
  children: ReactNode;
  /** Whether the card is in a success state */
  showSuccess?: boolean;
  /** Whether the card is in a loading state */
  isLoading?: boolean;
  /** Class names to apply to icon wrapper */
  iconWrapperClassName?: string;
}

/**
 * Reusable card template component with consistent styling
 * @param props Card properties including title, content, and state
 * @returns CardTemplate component
 */
const CardTemplate: React.FC<CardTemplateProps> = ({
  title,
  description,
  icon,
  indicator,
  children,
  showSuccess = false,
  isLoading = false,
  iconWrapperClassName = "bg-primary/20",
}) => {
  return (
    <div
      className={`bg-white dark:bg-dark-100 rounded-xl shadow-lg hover:shadow-xl p-6 w-full max-w-lg mx-auto relative transition-all duration-300 ${
        showSuccess
          ? "ring-4 ring-green-400"
          : isLoading
            ? "ring-2 ring-gray-400"
            : "border border-gray-100"
      }`}
    >
      {/* Success animation overlay */}
      {showSuccess && (
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
      {isLoading && !showSuccess && (
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

      {/* Indicator positioned at top-left, above the title */}
      {indicator && (
        <div className="mb-3">
          <div className="inline-block px-3 py-1.5 bg-gray-100 dark:bg-dark-200 rounded-full text-sm text-gray-600 dark:text-gray-400 font-medium">
            {indicator}
          </div>
        </div>
      )}

      {/* Card header */}
      <div className="flex items-center mb-4">
        {icon && (
          <div
            className={`w-14 h-14 ${iconWrapperClassName} rounded-full flex items-center justify-center mr-4 shadow-sm`}
          >
            {icon}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>

      {/* Card description */}
      {description && (
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-base">
          {description}
        </p>
      )}

      {/* Card content */}
      <div className={`${!description ? "mt-4" : ""}`}>{children}</div>
    </div>
  );
};

export default CardTemplate;
