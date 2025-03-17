import { render, screen, fireEvent, within } from "@testing-library/react";
import CreateQuestPage from "../page";

// Mock console.log
const originalConsoleLog = console.log;
let consoleOutput: string[] = [];

beforeEach(() => {
  consoleOutput = [];
  console.log = jest.fn((...args) => {
    consoleOutput.push(args.join(" "));
  });
});

afterEach(() => {
  console.log = originalConsoleLog;
});

describe("CreateQuestPage", () => {
  it("renders the page title", () => {
    render(<CreateQuestPage />);
    expect(screen.getByText("Create New Quest")).toBeInTheDocument();
  });

  it("allows filling out quest information", () => {
    render(<CreateQuestPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Quest" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "A test quest description" },
    });
    fireEvent.change(screen.getByLabelText("Reward"), {
      target: { value: "100 TEST" },
    });

    // Check if the values were updated
    expect(screen.getByLabelText("Title")).toHaveValue("Test Quest");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "A test quest description",
    );
    expect(screen.getByLabelText("Reward")).toHaveValue("100 TEST");
  });

  it("allows adding and removing tasks", () => {
    render(<CreateQuestPage />);

    // Initially, there should be no tasks
    expect(
      screen.getByText(
        "No tasks added yet. Use the button above to add tasks.",
      ),
    ).toBeInTheDocument();

    // Add a task
    fireEvent.click(screen.getByText("Add Task"));

    // Step 1 should be visible
    const taskSection = screen
      .getByText("Step 1: Text Instruction")
      .closest(".border")!;

    // Should have inputs for title and description
    const titleInput = within(taskSection).getByLabelText("Title");
    const descriptionInput = within(taskSection).getByLabelText("Description");

    // Add text to the task
    fireEvent.change(titleInput, { target: { value: "Task 1 Title" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Task 1 Description" },
    });

    // Remove the task
    fireEvent.click(within(taskSection).getByText("Remove"));

    // No tasks message should appear again
    expect(
      screen.getByText(
        "No tasks added yet. Use the button above to add tasks.",
      ),
    ).toBeInTheDocument();
  });

  it("handles quiz task type with options", () => {
    render(<CreateQuestPage />);

    // Select quiz type and add a task
    fireEvent.change(screen.getByRole("combobox", { name: "" }), {
      target: { value: "quiz" },
    });
    fireEvent.click(screen.getByText("Add Task"));

    // Should be a quiz task
    const taskSection = screen
      .getByText("Step 1: Quiz Question")
      .closest(".border")!;

    // Fill out the quiz task
    fireEvent.change(within(taskSection).getByLabelText("Title"), {
      target: { value: "Quiz Title" },
    });
    fireEvent.change(within(taskSection).getByLabelText("Description"), {
      target: { value: "Quiz Description" },
    });
    fireEvent.change(within(taskSection).getByLabelText("Question"), {
      target: { value: "What is the answer?" },
    });

    // Add options
    fireEvent.click(within(taskSection).getByText("Add Option"));

    // Should have an option input
    const optionInputs = within(taskSection).getAllByPlaceholderText(/Option/);
    expect(optionInputs.length).toBe(1);

    // Add text to the option
    fireEvent.change(optionInputs[0], { target: { value: "Option 1" } });

    // Add another option
    fireEvent.click(within(taskSection).getByText("Add Option"));

    // Should have two option inputs now
    const updatedOptionInputs =
      within(taskSection).getAllByPlaceholderText(/Option/);
    expect(updatedOptionInputs.length).toBe(2);

    // Add text to the second option
    fireEvent.change(updatedOptionInputs[1], { target: { value: "Option 2" } });

    // Select a correct answer
    const correctAnswerSelect =
      within(taskSection).getByLabelText("Correct Answer");
    fireEvent.change(correctAnswerSelect, { target: { value: "Option 2" } });

    // Check that the options are saved in the dropdown
    expect(within(correctAnswerSelect).getAllByRole("option").length).toBe(3); // includes "Select correct answer" option
  });

  it("logs quest data to console on submit", () => {
    render(<CreateQuestPage />);

    // Fill out required fields
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Quest" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "A test quest description" },
    });
    fireEvent.change(screen.getByLabelText("Reward"), {
      target: { value: "100 TEST" },
    });

    // Add a task
    fireEvent.click(screen.getByText("Add Task"));

    // Get the task section
    const taskSection = screen
      .getByText("Step 1: Text Instruction")
      .closest(".border")!;

    fireEvent.change(within(taskSection).getByLabelText("Title"), {
      target: { value: "Task Title" },
    });
    fireEvent.change(within(taskSection).getByLabelText("Description"), {
      target: { value: "Task Description" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Create Quest"));

    // Check that console.log was called with quest data
    expect(consoleOutput.length).toBe(1);
    expect(consoleOutput[0]).toContain("Quest data:");

    // Parse the JSON from the console output and verify structure
    const logData = consoleOutput[0].replace("Quest data:", "").trim();
    const questData = JSON.parse(logData);

    expect(questData.title).toBe("Test Quest");
    expect(questData.description).toBe("A test quest description");
    expect(questData.reward).toBe("100 TEST");
    expect(questData.tasks.length).toBe(1);
    expect(questData.tasks[0].title).toBe("Task Title");
    expect(questData.tasks[0].description).toBe("Task Description");
  });
});
