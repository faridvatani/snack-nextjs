import { DIRECTIONS } from "@/constants";

// Type definitions for points and directions
export type Point = {
  x: number; // x is the horizontal coordinate (column index).
  y: number; // y is the vertical coordinate (row index).
};

export type Direction = keyof typeof DIRECTIONS;

// State type for the snake game
export type SnakeState = {
  snake: Point[];
  food: Point;
  direction: Direction;
  isGameStarted: boolean;
  isGameOver: boolean;
  score: number;
  highestScore: number;
  speed: number;
};

// Action types for the reducer
export type SnakeAction =
  | { type: "MOVE" }
  | { type: "CHANGE_DIRECTION"; direction: Direction }
  | { type: "GENERATE_FOOD" }
  | { type: "START_GAME" }
  | { type: "GAME_OVER" }
  | { type: "RESET" };
