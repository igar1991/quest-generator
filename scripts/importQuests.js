#!/usr/bin/env node
const Redis = require("ioredis");
const fs = require("fs");
const path = require("path");

// Create Redis client
const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

// Directly define the quests data here to avoid complex parsing
const questsData = [
  {
    id: "1",
    title: "Get Started with Aptos Move",
    description:
      "Learn the basics of Move programming language and create your first smart contract on Aptos.",
    imageUrl: "/images/quests/aptos-move.jpg",
    projectName: "Aptos Foundation",
    reward: 5,
    difficulty: "Easy",
    estimatedTime: "30 min",
    tasks: [
      {
        id: "1-1",
        type: "connect-wallet",
        title: "Connect Your Wallet",
        description:
          "Connect your Aptos wallet to start interacting with the blockchain",
      },
      {
        id: "1-2",
        type: "quiz",
        title: "Understand Move Basics",
        description: "Test your knowledge about the Move programming language",
        question: "What is Move primarily designed for?",
        options: [
          "General-purpose programming",
          "Web development",
          "Digital asset management and smart contracts",
          "Machine learning",
        ],
        correctAnswer: "Digital asset management and smart contracts",
      },
      {
        id: "1-3",
        type: "quiz",
        title: "Aptos Architecture",
        description: "Learn about the Aptos blockchain architecture",
        question: "Which of the following is NOT a key component of Aptos?",
        options: ["Move VM", "Solidity Runtime", "Block-STM", "BFT Consensus"],
        correctAnswer: "Solidity Runtime",
      },
      {
        id: "1-4",
        type: "quiz",
        title: "Smart Contract Security",
        description:
          "Test your knowledge about smart contract security principles",
        question: "Which security feature is built into the Move language?",
        options: [
          "Automatic memory management",
          "Resource types that prevent copying or implicit destruction",
          "Just-in-time compilation",
          "Dynamic typing",
        ],
        correctAnswer:
          "Resource types that prevent copying or implicit destruction",
      },
    ],
  },
  {
    id: "2",
    title: "Swap Tokens on Pontem",
    description:
      "Learn how to use Pontem DEX to swap tokens on the Aptos blockchain with competitive rates and low fees.",
    imageUrl: "/images/quests/pontem.jpg",
    projectName: "Pontem Network",
    reward: 3,
    difficulty: "Easy",
    estimatedTime: "15 min",
    tasks: [
      {
        id: "2-1",
        type: "connect-wallet",
        title: "Connect to Pontem",
        description: "Connect your wallet to the Pontem DEX interface",
      },
      {
        id: "2-2",
        type: "quiz",
        title: "Understanding Liquidity Pools",
        description: "Learn about how liquidity pools work on Pontem",
        question: "What is the primary purpose of a liquidity pool in a DEX?",
        options: [
          "To store user credentials",
          "To facilitate token swaps without traditional order books",
          "To mine new tokens",
          "To verify user identities",
        ],
        correctAnswer:
          "To facilitate token swaps without traditional order books",
      },
      {
        id: "2-3",
        type: "check-balance",
        title: "Add APT to Your Wallet",
        description: "Add at least 0.01 APT to your wallet to continue",
        requiredAmount: "0.01",
      },
    ],
  },
  {
    id: "3",
    title: "Aptos Blockchain Quiz Challenge",
    description:
      "Test your knowledge about the Aptos blockchain technology and ecosystem through a series of educational quizzes.",
    imageUrl: "/images/quests/topaz.jpg",
    projectName: "Aptos Education",
    reward: 4,
    difficulty: "Medium",
    estimatedTime: "25 min",
    tasks: [
      {
        id: "3-1",
        type: "quiz",
        title: "Aptos Fundamentals",
        description: "Test your knowledge of Aptos blockchain fundamentals",
        question: "What consensus mechanism does Aptos use?",
        options: [
          "Proof of Work",
          "Proof of Stake",
          "Proof of History",
          "Byzantine Fault Tolerance (BFT)",
        ],
        correctAnswer: "Byzantine Fault Tolerance (BFT)",
      },
      {
        id: "3-2",
        type: "quiz",
        title: "Move VM",
        description: "Understanding the Move Virtual Machine",
        question: "Where was the Move language originally developed?",
        options: [
          "Ethereum Foundation",
          "Facebook's Libra/Diem project",
          "Solana Labs",
          "Binance",
        ],
        correctAnswer: "Facebook's Libra/Diem project",
      },
      {
        id: "3-3",
        type: "quiz",
        title: "Aptos Tokenomics",
        description: "Learn about the APT token and its economics",
        question: "What is the primary utility of the APT token?",
        options: [
          "Governance only",
          "Transaction fees only",
          "Staking only",
          "All of the above",
        ],
        correctAnswer: "All of the above",
      },
      {
        id: "3-4",
        type: "quiz",
        title: "Aptos Development",
        description: "Learn about developing on Aptos",
        question:
          "Which programming language is primarily used for Aptos smart contract development?",
        options: ["JavaScript", "Solidity", "Move", "Rust"],
        correctAnswer: "Move",
      },
      {
        id: "3-5",
        type: "quiz",
        title: "Aptos Ecosystem",
        description: "Explore the growing Aptos ecosystem",
        question: "Which of the following is NOT an Aptos wallet?",
        options: ["Petra", "Martian", "Phantom", "Pontem"],
        correctAnswer: "Phantom",
      },
    ],
  },
];

/**
 * Import quests to Redis
 */
async function importQuestsToRedis() {
  try {
    console.log("Starting import of quest data to Redis...");
    
    // Clear existing data in Redis
    const keys = await redisClient.keys("quests:*");
    if (keys.length > 0) {
      const pipeline = redisClient.pipeline();
      keys.forEach((key) => {
        pipeline.del(key);
      });
      await pipeline.exec();
      console.log(`Cleared ${keys.length} existing quest keys`);
    }
    
    // Reset the quests:all set
    await redisClient.del("quests:all");
    
    // Import each quest
    const pipeline = redisClient.pipeline();
    for (const quest of questsData) {
      // Format the quest data to match the Quest interface
      const formattedQuest = {
        id: quest.id,
        title: quest.title,
        description: quest.description,
        reward: quest.reward.toString(),
        totalUsers: "0", // Default value
        category: quest.projectName || "Aptos", // Default value
        difficulty: quest.difficulty,
        tasks: quest.tasks.map((task) => ({
          id: task.id,
          type: task.type === "connect-wallet" ? "action" : task.type,
          title: task.title,
          description: task.description,
          question: task.question,
          options: task.options,
          correctAnswer: task.correctAnswer,
          actionUrl: task.type === "connect-wallet" ? "/api/connect-wallet" : undefined,
          successCondition: task.type === "check-balance" 
            ? `amount>=${task.requiredAmount}`
            : undefined,
        })),
        createdAt: new Date().toISOString(),
      };
      
      // Store the quest in Redis
      pipeline.hset(
        `quests:${quest.id}`,
        "data",
        JSON.stringify(formattedQuest),
      );
      
      // Add to the set of all quests
      pipeline.sadd("quests:all", quest.id);
    }
    
    await pipeline.exec();
    console.log(`Successfully imported ${questsData.length} quests to Redis`);
    redisClient.quit();
  } catch (error) {
    console.error("Error importing quests to Redis:", error);
    redisClient.quit();
    process.exit(1);
  }
}

// Run the import function
importQuestsToRedis();
