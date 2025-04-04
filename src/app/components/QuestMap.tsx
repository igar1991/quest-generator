"use client";

import React, { useState } from "react";
import { QuestStepUI } from "../types/quest";

interface QuestMapProps {
  steps: QuestStepUI[];
  questId: string;
  onStepClick: (step: QuestStepUI) => void;
}

/**
 * Component that displays quest steps as a game map with paths connecting them
 * Styled like classic mobile game level maps
 * @param props Quest map configuration with steps, quest ID and click handler
 * @returns QuestMap component
 */
const QuestMap: React.FC<QuestMapProps> = ({ steps, questId, onStepClick }) => {
  // State to track which step tooltip is currently visible
  const [hoveredStepId, setHoveredStepId] = useState<string | null>(null);

  // Get background color based on quest ID - for visual variety
  const getBackgroundColor = (id: string) => {
    const colors = {
      "1": "from-amber-100 to-amber-200", // Desert theme
      "2": "from-blue-100 to-blue-200", // Water theme
      "3": "from-pink-100 to-pink-200", // Candy theme
      "4": "from-green-100 to-green-200", // Forest theme
      "5": "from-purple-100 to-purple-200", // Fantasy theme
    };
    return colors[id as keyof typeof colors] || "from-gray-100 to-gray-200";
  };

  /**
   * Check if a step is accessible to navigate to
   * @param step The step to check
   * @returns Whether the step is accessible
   */
  const isStepAccessible = (step: QuestStepUI): boolean => {
    // Step is not accessible if locked
    if (step.isLocked) return false;

    // Step is not accessible if completed
    if (step.isCompleted) return false;

    // All other unlocked steps are accessible
    return true;
  };

  // Get step icon based on type and completion status
  const getStepIcon = (step: QuestStepUI, accessible: boolean): string => {
    if (!accessible && step.isLocked) return "🔒";
    if (step.isCompleted) return "✓";

    switch (step.type) {
      case "connect-wallet":
        return "👛";
      case "check-balance":
        return "💰";
      case "quiz":
        return "🎓";
      default:
        return "🚀";
    }
  };

  return (
    <div
      className={`relative bg-gradient-to-b ${getBackgroundColor(questId)} p-6 rounded-xl min-h-[500px] w-full max-w-md mx-auto`}
    >
      {/* The winding path */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-12 bg-amber-600/30 rounded-full h-full z-0 flex flex-col items-center justify-between py-10">
          {/* Path decorations - small dots along the path */}
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="w-2 h-2 rounded-full bg-amber-800/30" />
          ))}
        </div>
      </div>

      {/* Quest steps */}
      <div className="relative z-10 flex flex-col items-center space-y-16 py-6">
        {steps.map((step, index) => {
          // Calculate if step should be on left or right side of path
          // Creates a winding effect like in the reference images
          const isOnLeft = index % 2 === 0;
          const isHovered = hoveredStepId === step.id;
          const accessible = isStepAccessible(step);

          return (
            <div
              key={step.id}
              className={`w-full flex ${isOnLeft ? "justify-end" : "justify-start"} items-center`}
            >
              <div
                className="relative"
                onMouseEnter={() => setHoveredStepId(step.id)}
                onMouseLeave={() => setHoveredStepId(null)}
                onTouchStart={() =>
                  setHoveredStepId(step.id === hoveredStepId ? null : step.id)
                }
              >
                <button
                  onClick={() => onStepClick(step)}
                  disabled={!accessible}
                  className={`
                    relative 
                    flex flex-col items-center justify-center 
                    w-16 h-16 
                    rounded-full shadow-lg 
                    transition-all duration-300
                    ${
                      !accessible && !step.isCompleted
                        ? "cursor-not-allowed filter grayscale opacity-60"
                        : accessible
                          ? "cursor-pointer hover:scale-110"
                          : "cursor-not-allowed"
                    }
                    ${
                      step.isCompleted
                        ? "bg-green-500 ring-4 ring-green-200"
                        : "bg-indigo-500 hover:bg-indigo-600"
                    }
                  `}
                >
                  {/* Step number badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold shadow">
                    {index + 1}
                  </div>

                  {/* Step icon */}
                  <div className="text-white text-2xl">
                    {getStepIcon(step, accessible)}
                  </div>
                </button>

                {/* Tooltip that appears on hover */}
                {isHovered && (
                  <div
                    className={`
                      absolute ${isOnLeft ? "right-20" : "left-20"} top-0
                      w-64 bg-white p-4 rounded-lg shadow-lg 
                      z-20 transition-all duration-200 
                      md:w-72
                      text-left
                    `}
                    style={{
                      // Ensures tooltip stays in view on smaller screens
                      maxWidth: "calc(100vw - 100px)",
                      transform: `translateY(-${!accessible ? "10" : "25"}%)`,
                    }}
                  >
                    <h4 className="font-bold text-sm text-gray-900">
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {step.description}
                    </p>

                    {/* Achievement requirement explanation */}
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <h5 className="text-xs font-semibold text-indigo-600">
                        How to achieve:
                      </h5>
                      <p className="text-xs mt-1 text-gray-700">
                        {!accessible && step.isLocked
                          ? "Complete previous steps to unlock this achievement"
                          : step.isCompleted
                            ? "Completed! Great job on finishing this task."
                            : `Complete this ${step.type} task to advance to the next step.`}
                      </p>
                    </div>

                    {/* Task type indicator */}
                    {step.type && (
                      <div className="mt-2 flex items-center">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {step.type.replace("-", " ")}
                        </span>
                      </div>
                    )}

                    {/* Small triangle pointer for the tooltip */}
                    <div
                      className={`absolute top-6 ${isOnLeft ? "-right-2" : "-left-2"} w-4 h-4 bg-white transform rotate-45`}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestMap;
