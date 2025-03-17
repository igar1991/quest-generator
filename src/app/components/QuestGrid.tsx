"use client";

import React from "react";
import QuestCard from "./QuestCard";
import { questsData } from "../data/questsData";

/**
 * Grid component to display quest cards in a responsive layout
 * @returns Grid component with quest cards
 */
const QuestGrid: React.FC = () => {
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {questsData.map((quest) => (
            <QuestCard
              key={quest.id}
              id={quest.id}
              title={quest.title}
              description={quest.description}
              imageUrl={quest.imageUrl}
              projectName={quest.projectName}
              reward={quest.reward}
              difficulty={quest.difficulty}
              estimatedTime={quest.estimatedTime}
            />
          ))}
        </div>

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
