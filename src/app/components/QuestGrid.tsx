"use client";

import React, { useState, useEffect } from "react";
import QuestCard from "./QuestCard";

/**
 * Interface for quest data structure
 */
interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  totalUsers: string;
  category: string;
  difficulty: string;
  tasks: {
    id: string;
    type: string;
    title: string;
    description: string;
  }[];
  createdAt: string;
}

/**
 * Grid component to display quest cards in a responsive layout
 * @returns Grid component with quest cards
 */
const QuestGrid: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuests() {
      try {
        const response = await fetch("/api/quests");

        if (!response.ok) {
          throw new Error(`Error fetching quests: ${response.status}`);
        }

        const data = await response.json();
        setQuests(
          data.quests !== undefined && data.quests !== null ? data.quests : [],
        );
      } catch (error) {
        console.error("Failed to fetch quests:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load quests",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchQuests();
  }, []);

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Popular Quests
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Discover the most popular quests in the Aptos ecosystem
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Data loaded from Redis
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error !== null && error !== "" && (
          <div className="text-center text-red-500 mb-6">{error}</div>
        )}

        {!loading && error === null && quests.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            No quests found. Run{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              npm run redis:import
            </code>{" "}
            to import quests.
          </div>
        )}

        {!loading && error === null && quests.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {quests.map((quest) => (
              <QuestCard
                key={quest.id}
                id={quest.id}
                title={quest.title}
                description={quest.description}
                imageUrl={`/images/quests/${quest.title.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                projectName={quest.category}
                reward={Number(quest.reward)}
                difficulty={quest.difficulty as "Easy" | "Medium" | "Hard"}
                estimatedTime={
                  quest.totalUsers ? `${quest.totalUsers} users` : "New"
                }
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="/projects"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            <span>View all projects</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ml-2 w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default QuestGrid;
