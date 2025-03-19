"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * Interface for a task in a quest
 */
interface QuestTask {
  id: string;
  type: string;
  title: string;
  description: string;
}

interface QuestCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectName: string;
  reward: number;
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced";
  estimatedTime: string;
  tasks?: QuestTask[]; // Use the specific type instead of any
}

/**
 * QuestCard component displays information about a quest
 * @param props Quest information including title, description, reward, etc.
 * @returns QuestCard component
 */
const QuestCard: React.FC<QuestCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  projectName,
  reward,
  difficulty,
  estimatedTime,
  tasks = [], // Default to empty array if not provided
}) => {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);

  const difficultyColor = (() => {
    // Normalize difficulty to handle both lowercase and capitalized values
    const normalizedDifficulty =
      difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

    const colorMap = {
      Easy: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Hard: "bg-red-100 text-red-800",
      Beginner: "bg-green-100 text-green-800",
      Intermediate: "bg-yellow-100 text-yellow-800",
      Advanced: "bg-red-100 text-red-800",
    };

    return colorMap[normalizedDifficulty] || "bg-gray-100 text-gray-800";
  })();

  // Create a placeholder image url based on the quest ID for consistency
  const placeholderImage = useMemo(() => {
    const colors = ["2196f3", "f44336", "4caf50", "ff9800", "9c27b0", "673ab7"];
    const colorIndex = Number(id.replace(/\D/g, "")) % colors.length || 0;
    return `https://placehold.co/400x240/${colors[colorIndex]}/ffffff/png?text=${encodeURIComponent(
      projectName,
    )}`;
  }, [id, projectName]);

  // Determine which image source to use
  const imageSource = useMemo(() => {
    // If we have an error or the image isn't a full URL (doesn't start with http), use placeholder
    if (imageError || !imageUrl || !imageUrl.startsWith("http")) {
      return placeholderImage;
    }
    return imageUrl;
  }, [imageUrl, imageError, placeholderImage]);

  /**
   * Navigate to quest detail page when card is clicked
   */
  const handleCardClick = () => {
    router.push(`/quest/${id}`);
  };

  /**
   * Handle image load error
   */
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className="group bg-white dark:bg-dark-100 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] flex flex-col h-full cursor-pointer relative border border-gray-100"
      onClick={handleCardClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* URL tooltip that appears on hover */}
      {showTooltip && (
        <div className="absolute left-0 right-0 bottom-full mb-2 z-20 px-4 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg">
            {`/quest/${id}`}
          </div>
          <div className="w-3 h-3 bg-gray-800 transform rotate-45 mx-auto -mt-1.5"></div>
        </div>
      )}

      {/* Image section at the top */}
      <div className="relative h-40 w-full bg-gradient-to-r from-primary/20 to-aptos/20">
        <div className="relative h-full w-full">
          <Image
            src={imageSource}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            onError={handleImageError}
            priority={true}
          />
        </div>
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium z-10">
          {reward} APT
        </div>
      </div>

      {/* Card content - styled consistently with CardTemplate */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {projectName}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor}`}>
            {difficulty.charAt(0).toUpperCase() +
              difficulty.slice(1).toLowerCase()}
          </span>
        </div>

        <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2 mb-2">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
          {description}
        </p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-dark-200">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              {estimatedTime}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
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
              {tasks.length + 1} {tasks.length + 1 === 1 ? "task" : "tasks"}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click from firing
              router.push(`/quest/${id}`);
            }}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Start Quest
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;
