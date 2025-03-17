import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuestGrid from "./components/QuestGrid";
import Footer from "./components/Footer";

/**
 * Main page component that displays hero section and popular quests
 * @returns Main page
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-light-100 dark:bg-dark-300 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <QuestGrid />
      </main>
      <Footer />
    </div>
  );
}
