import { validateQuest, QuestData } from "./validateQuest";

describe("validateQuest", () => {
  // Valid quest example
  const validQuest: QuestData = {
    title: "Learn Solidity Basics",
    description:
      "A comprehensive introduction to writing smart contracts with Solidity",
    reward: "5",
    totalUsers: "10",
    category: "learning",
    difficulty: "beginner",
    tasks: [
      {
        id: "1",
        type: "connect-wallet",
        title: "Connect Your Wallet",
        description:
          "Connect your wallet to start interacting with the blockchain",
      },
      {
        id: "2",
        type: "quiz",
        title: "Solidity Basics Quiz",
        description: "Test your knowledge of Solidity fundamentals",
        question: "Which of the following is a valid Solidity data type?",
        options: ["int256", "floating", "char", "String"],
        correctAnswer: "int256",
      },
      {
        id: "3",
        type: "check-balance",
        title: "Add Funds to Your Wallet",
        description: "Add some APT to your wallet to continue",
        requiredAmount: "0.01",
      },
    ],
  };

  test("should validate a correct quest object", () => {
    const result = validateQuest(validQuest);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test("should validate a correct quest JSON string", () => {
    const result = validateQuest(JSON.stringify(validQuest));
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test("should reject invalid JSON string", () => {
    const result = validateQuest("{ invalid json }");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("Invalid JSON format");
  });

  test("should reject missing title", () => {
    const invalidQuest = { ...validQuest, title: "" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("title");
  });

  test("should reject title that is too short", () => {
    const invalidQuest = { ...validQuest, title: "ABC" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("title");
  });

  test("should reject missing description", () => {
    const invalidQuest = { ...validQuest, description: "" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("description");
  });

  test("should reject description that is too short", () => {
    const invalidQuest = { ...validQuest, description: "Too short" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("description");
  });

  test("should reject invalid reward format", () => {
    const invalidQuest = { ...validQuest, reward: "not-a-number" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("reward");
  });

  test("should reject negative reward", () => {
    const invalidQuest = { ...validQuest, reward: "-5" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("reward");
  });

  test("should reject zero reward", () => {
    const invalidQuest = { ...validQuest, reward: "0" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("reward");
  });

  test("should reject missing totalUsers", () => {
    const invalidQuest = { ...validQuest, totalUsers: "" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("totalUsers");
  });

  test("should reject invalid totalUsers format", () => {
    const invalidQuest = { ...validQuest, totalUsers: "not-a-number" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("totalUsers");
  });

  test("should reject negative totalUsers", () => {
    const invalidQuest = { ...validQuest, totalUsers: "-5" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("totalUsers");
  });

  test("should reject zero totalUsers", () => {
    const invalidQuest = { ...validQuest, totalUsers: "0" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("totalUsers");
  });

  test("should reject non-integer totalUsers", () => {
    const invalidQuest = { ...validQuest, totalUsers: "5.5" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("totalUsers");
  });

  test("should reject invalid category", () => {
    const invalidQuest = { ...validQuest, category: "invalid-category" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("category");
  });

  test("should reject invalid difficulty", () => {
    const invalidQuest = { ...validQuest, difficulty: "impossible" };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("difficulty");
  });

  test("should reject empty tasks array", () => {
    const invalidQuest = { ...validQuest, tasks: [] };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks");
  });

  test("should reject too many tasks", () => {
    // Create 21 tasks (exceeding the 20 limit)
    const tooManyTasks = Array(21)
      .fill(validQuest.tasks[0])
      .map((task, i) => ({
        ...task,
        id: String(i),
      }));

    const invalidQuest = { ...validQuest, tasks: tooManyTasks };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks");
  });

  test("should reject task with missing id", () => {
    const invalidTasks = [
      { ...validQuest.tasks[0], id: "" },
      ...validQuest.tasks.slice(1),
    ];
    const invalidQuest = { ...validQuest, tasks: invalidTasks };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks[0].id");
  });

  test("should reject task with missing title", () => {
    const invalidTasks = [
      { ...validQuest.tasks[0], title: "" },
      ...validQuest.tasks.slice(1),
    ];
    const invalidQuest = { ...validQuest, tasks: invalidTasks };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks[0].title");
  });

  test("should reject task with invalid type", () => {
    const invalidTasks = [
      {
        ...validQuest.tasks[0],
        type: "invalid-type" as unknown as
          | "connect-wallet"
          | "check-balance"
          | "quiz",
      },
      ...validQuest.tasks.slice(1),
    ];
    const invalidQuest = { ...validQuest, tasks: invalidTasks };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks[0].type");
  });

  test("should reject quiz task with missing question", () => {
    const invalidTasks = [
      validQuest.tasks[0],
      { ...validQuest.tasks[1], question: "" },
      validQuest.tasks[2],
    ];
    const invalidQuest = { ...validQuest, tasks: invalidTasks };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks[1].question");
  });

  test("should reject quiz task with insufficient options", () => {
    const invalidTasks = [
      validQuest.tasks[0],
      { ...validQuest.tasks[1], options: ["Only one option"] },
      validQuest.tasks[2],
    ];
    const invalidQuest = { ...validQuest, tasks: invalidTasks };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks[1].options");
  });

  test("should reject quiz task with missing correct answer", () => {
    const invalidTasks = [
      validQuest.tasks[0],
      { ...validQuest.tasks[1], correctAnswer: "" },
      validQuest.tasks[2],
    ];
    const invalidQuest = { ...validQuest, tasks: invalidTasks };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks[1].correctAnswer");
  });

  test("should reject quiz task with correct answer not in options", () => {
    const invalidTasks = [
      validQuest.tasks[0],
      {
        ...validQuest.tasks[1],
        correctAnswer: "Not in options",
      },
      validQuest.tasks[2],
    ];
    const invalidQuest = { ...validQuest, tasks: invalidTasks };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks[1].correctAnswer");
  });

  test("should reject check-balance task with missing required amount", () => {
    const invalidTasks = [
      validQuest.tasks[0],
      validQuest.tasks[1],
      { ...validQuest.tasks[2], requiredAmount: "" },
    ];
    const invalidQuest = { ...validQuest, tasks: invalidTasks };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks[2].requiredAmount");
  });

  test("should reject check-balance task with invalid amount format", () => {
    const invalidTasks = [
      validQuest.tasks[0],
      validQuest.tasks[1],
      { ...validQuest.tasks[2], requiredAmount: "not-a-number" },
    ];
    const invalidQuest = { ...validQuest, tasks: invalidTasks };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks[2].requiredAmount");
  });

  test("should reject check-balance task with negative or zero amount", () => {
    const invalidTasks = [
      validQuest.tasks[0],
      validQuest.tasks[1],
      { ...validQuest.tasks[2], requiredAmount: "0" },
    ];
    const invalidQuest = { ...validQuest, tasks: invalidTasks };
    const result = validateQuest(invalidQuest);
    expect(result.isValid).toBe(false);
    expect(result.field).toBe("tasks[2].requiredAmount");
  });
});
