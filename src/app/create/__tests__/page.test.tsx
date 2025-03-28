import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import CreateQuestPage from "../page";
// Remove import since we're just mocking it
// import { validateQuestLocal } from "../../../utils/questApi";

// Mock validateQuestLocal function
jest.mock("../../../utils/questApi", () => ({
  validateQuestLocal: jest.fn().mockImplementation(() => ({ isValid: true })),
  createQuest: jest.fn().mockImplementation(() =>
    Promise.resolve({
      id: "mock-quest-id",
      createdAt: "2023-01-01T00:00:00.000Z",
    }),
  ),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    };
  },
}));

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

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe("CreateQuestPage", () => {
  it("renders the page title", () => {
    render(<CreateQuestPage />);
    expect(screen.getByText("Create New Quest")).toBeInTheDocument();
  });

  it("allows filling out quest information", () => {
    render(<CreateQuestPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Quest Title") as HTMLElement, {
      target: { value: "Test Quest" },
    });
    fireEvent.change(screen.getByLabelText("Description") as HTMLElement, {
      target: { value: "A test quest description" },
    });
    fireEvent.change(screen.getByLabelText("Reward (in APT)") as HTMLElement, {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText("Total users") as HTMLElement, {
      target: { value: "10" },
    });

    // Check if the values were updated
    expect(screen.getByLabelText("Quest Title")).toHaveValue("Test Quest");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "A test quest description",
    );
    expect(screen.getByLabelText("Reward (in APT)")).toHaveValue(100);
    expect(screen.getByLabelText("Total users")).toHaveValue(10);
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
    fireEvent.click(screen.getByText("Add Task") as HTMLElement);

    // Find the task section by its heading text
    const taskHeading = screen.getByText("Step 1: Quiz Question");
    const taskSection = taskHeading.closest(".border") as HTMLElement;
    expect(taskSection).toBeInTheDocument();

    // Use within to find elements specifically within the task section
    const titleInput = within(taskSection).getByLabelText(
      "Title",
    ) as HTMLElement;
    const descriptionInput = within(taskSection).getByLabelText(
      "Description",
    ) as HTMLElement;

    // Add text to the task
    fireEvent.change(titleInput, { target: { value: "Task One Title" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Task 1 Description" },
    });

    // Remove the task using the button within the task section
    const removeButton = within(taskSection).getByText("Remove") as HTMLElement;
    fireEvent.click(removeButton);

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
    fireEvent.change(
      screen.getByRole("combobox", { name: "" }) as HTMLElement,
      {
        target: { value: "quiz" },
      },
    );
    fireEvent.click(screen.getByText("Add Task") as HTMLElement);

    // Find the quiz task section by its heading
    const taskHeading = screen.getByText("Step 1: Quiz Question");
    const taskSection = taskHeading.closest(".border") as HTMLElement;
    expect(taskSection).toBeInTheDocument();

    // Fill out the quiz task - using within to scope to the task section
    const titleInput = within(taskSection).getByLabelText(
      "Title",
    ) as HTMLElement;
    fireEvent.change(titleInput, { target: { value: "Quiz Title Test" } });

    const descriptionInput = within(taskSection).getByLabelText(
      "Description",
    ) as HTMLElement;
    fireEvent.change(descriptionInput, {
      target: { value: "Quiz Description" },
    });

    const questionInput = within(taskSection).getByLabelText(
      "Question",
    ) as HTMLElement;
    fireEvent.change(questionInput, {
      target: { value: "What is the answer?" },
    });

    // Add options
    const addOptionButton = within(taskSection).getByText(
      "Add Option",
    ) as HTMLElement;
    fireEvent.click(addOptionButton);

    // Should have an option input
    const optionInputs = within(taskSection).getAllByPlaceholderText(/Option/);
    expect(optionInputs.length).toBe(1);

    // Add text to the option
    fireEvent.change(optionInputs[0] as HTMLElement, {
      target: { value: "Option 1" },
    });

    // Add another option
    fireEvent.click(addOptionButton);

    // Add text to the second option
    const secondOptionInput = within(taskSection).getByPlaceholderText(
      "Option 2",
    ) as HTMLElement;
    fireEvent.change(secondOptionInput, { target: { value: "Wrong answer" } });

    // Select a correct answer
    const correctAnswerSelect = within(taskSection).getByLabelText(
      "Correct Answer",
    ) as HTMLElement;
    fireEvent.change(correctAnswerSelect, { target: { value: "Option 1" } });

    // Check that the options are saved in the dropdown
    const options = within(correctAnswerSelect).getAllByRole("option");
    expect(options.length).toBe(3); // includes "Select correct answer" option
  });

  it("creates a quest on submit", async () => {
    // Use the mocked validateQuestLocal and createQuest from the jest.mock at the top
    const { validateQuestLocal, createQuest } = jest.requireMock(
      "../../../utils/questApi",
    );
    validateQuestLocal.mockReturnValue({ isValid: true });
    createQuest.mockResolvedValue({
      id: "mock-quest-id",
      createdAt: "2023-01-01T00:00:00.000Z",
      title: "Test Quest Title",
    });

    render(<CreateQuestPage />);

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText("Quest Title") as HTMLElement, {
      target: { value: "Test Quest Title" },
    });
    fireEvent.change(screen.getByLabelText("Description") as HTMLElement, {
      target: {
        value:
          "This is a test quest description that is long enough to be valid.",
      },
    });
    fireEvent.change(screen.getByLabelText("Reward (in APT)") as HTMLElement, {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText("Total users") as HTMLElement, {
      target: { value: "10" },
    });

    // Make sure quiz is selected
    fireEvent.change(
      screen.getByRole("combobox", { name: "" }) as HTMLElement,
      {
        target: { value: "quiz" },
      },
    );

    // Add a task
    fireEvent.click(screen.getByText("Add Task") as HTMLElement);

    // Find task section and fill it out
    const taskHeading = screen.getByText("Step 1: Quiz Question");
    const taskSection = taskHeading.closest(".border") as HTMLElement;

    const titleInput = within(taskSection).getByLabelText(
      "Title",
    ) as HTMLElement;
    const descriptionInput = within(taskSection).getByLabelText(
      "Description",
    ) as HTMLElement;

    fireEvent.change(titleInput, { target: { value: "Task One Title" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Task 1 Description" },
    });

    // Fill out quiz fields
    const questionInput = within(taskSection).getByLabelText(
      "Question",
    ) as HTMLElement;
    fireEvent.change(questionInput, {
      target: { value: "What is the answer?" },
    });

    // Add options
    const addOptionButton = within(taskSection).getByText(
      "Add Option",
    ) as HTMLElement;
    fireEvent.click(addOptionButton);

    // Add option text
    const optionInput = within(taskSection).getByPlaceholderText(
      "Option 1",
    ) as HTMLElement;
    fireEvent.change(optionInput, { target: { value: "This is the answer" } });

    // Add second option
    fireEvent.click(addOptionButton);

    // Add second option text
    const secondOptionInput = within(taskSection).getByPlaceholderText(
      "Option 2",
    ) as HTMLElement;
    fireEvent.change(secondOptionInput, { target: { value: "Wrong answer" } });

    // Select correct answer
    const correctAnswerSelect = within(taskSection).getByLabelText(
      "Correct Answer",
    ) as HTMLElement;
    fireEvent.change(correctAnswerSelect, {
      target: { value: "This is the answer" },
    });

    // Submit the form
    fireEvent.click(
      screen.getByRole("button", { name: "Create Quest" }) as HTMLElement,
    );

    // Wait for createQuest to be called and async operations to complete
    await waitFor(() => {
      expect(createQuest).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Quest Title",
          description:
            "This is a test quest description that is long enough to be valid.",
          reward: "100",
          totalUsers: "10",
          tasks: expect.arrayContaining([
            expect.objectContaining({
              title: "Task One Title",
              description: "Task 1 Description",
              type: "quiz",
              question: "What is the answer?",
              options: ["This is the answer", "Wrong answer"],
              correctAnswer: "This is the answer",
            }),
          ]),
        }),
      );
    });

    // Check for success message
    await waitFor(() => {
      // Find the success message by its container class and verify the text
      const successElements = screen.getAllByText(
        /Quest "Test Quest Title" created successfully!/,
      );
      expect(successElements.length).toBeGreaterThan(0);
      expect(successElements[0]).toBeInTheDocument();
    });
  });

  it("shows confirmation dialog when back button is clicked with changes", () => {
    render(<CreateQuestPage />);

    // Fill out a field to trigger form change
    fireEvent.change(screen.getByLabelText("Quest Title") as HTMLElement, {
      target: { value: "Test Quest" },
    });

    // Click the back button
    fireEvent.click(screen.getByLabelText("Go back") as HTMLElement);

    // Confirmation dialog should appear
    expect(screen.getByText("Discard changes?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You have unsaved changes. Are you sure you want to go back? All your changes will be lost.",
      ),
    ).toBeInTheDocument();

    // Check for Cancel and Discard buttons
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Discard")).toBeInTheDocument();
  });

  it("handles check-balance-increment task type with auto-set title and description", () => {
    render(<CreateQuestPage />);

    // Select check-balance-increment type and add a task
    fireEvent.change(
      screen.getByRole("combobox", { name: "" }) as HTMLElement,
      {
        target: { value: "check-balance-increment" },
      },
    );
    fireEvent.click(screen.getByText("Add Task") as HTMLElement);

    // Find the task section by its heading
    const taskHeading = screen.getByText("Step 1: Check Balance Increment");
    const taskSection = taskHeading.closest(".border") as HTMLElement;
    expect(taskSection).toBeInTheDocument();

    // Verify the default information box is shown
    const infoBox = within(taskSection).getByText("Default Task Information");
    expect(infoBox).toBeInTheDocument();

    // Verify the title and description are displayed
    expect(
      within(taskSection).getByText(/Add APT to your wallet/),
    ).toBeInTheDocument();
    expect(
      within(taskSection).getByText(
        /Transfer APT to your wallet to complete this task/,
      ),
    ).toBeInTheDocument();

    // Verify the Required APT Amount field is shown
    const amountInput = within(taskSection).getByLabelText(
      "Required APT Amount",
    ) as HTMLInputElement;
    expect(amountInput).toBeInTheDocument();

    // Fill out the Required APT Amount
    fireEvent.change(amountInput, { target: { value: "0.5" } });
    expect(amountInput.value).toBe("0.5");
  });
});
