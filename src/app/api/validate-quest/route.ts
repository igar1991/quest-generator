import { NextResponse } from "next/server";
import { validateQuest, ValidationResult } from "../../../utils/validateQuest";

/**
 * Validate a quest
 * POST /api/validate-quest
 * @param request - The request object containing the quest to validate
 * @returns Response with validation result
 */
export async function POST(request: Request) {
  try {
    const questData = await request.json();
    const validationResult: ValidationResult = validateQuest(questData);

    if (!validationResult.isValid) {
      return NextResponse.json(validationResult, { status: 400 });
    }

    return NextResponse.json(
      { isValid: true, message: "Quest is valid" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error validating quest:", error);
    return NextResponse.json(
      {
        isValid: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
