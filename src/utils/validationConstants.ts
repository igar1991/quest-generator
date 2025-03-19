/**
 * Constants for validation rules used across the application
 * Shared between frontend and backend validation
 */

// Quest title validation
export const QUEST_TITLE_MIN_LENGTH = 3;
export const QUEST_TITLE_MAX_LENGTH = 100;

// Quest description validation
export const QUEST_DESCRIPTION_MIN_LENGTH = 3;
export const QUEST_DESCRIPTION_MAX_LENGTH = 500;

// Task title validation
export const TASK_TITLE_MIN_LENGTH = 3;
export const TASK_TITLE_MAX_LENGTH = 100;

// Task description validation
export const TASK_DESCRIPTION_MIN_LENGTH = 3;
export const TASK_DESCRIPTION_MAX_LENGTH = 1000;

// Quiz question validation
export const QUIZ_QUESTION_MIN_LENGTH = 3;
export const QUIZ_QUESTION_MAX_LENGTH = 500;

// Quiz option validation
export const QUIZ_OPTION_MIN_LENGTH = 1;
export const QUIZ_OPTION_MAX_LENGTH = 200;

// Quiz minimum number of options
export const QUIZ_MIN_OPTIONS = 2;

// Action task validation
export const ACTION_URL_MIN_LENGTH = 5;
export const ACTION_URL_MAX_LENGTH = 2000;
export const ACTION_SUCCESS_CONDITION_MIN_LENGTH = 3;
export const ACTION_SUCCESS_CONDITION_MAX_LENGTH = 200;

// Reward validation
export const REWARD_MIN = 0.01;
export const REWARD_MAX = 1000;

// Total users validation
export const TOTAL_USERS_MIN = 1;
export const TOTAL_USERS_MAX = 100000;
