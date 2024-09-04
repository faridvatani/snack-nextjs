import { GRID_SIZE } from "@/constants";
import { Point } from "@/types";

// Function to generate a random point on the grid
export const getRandomPoint = (): Point => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

// Function to check if a point is part of the snake
export const isSnakeCell = (point: Point, snake: Point[]): boolean => {
  return snake.some(
    (segment) => segment.x === point.x && segment.y === point.y,
  );
};

// Function to generate a new food point that is not on the snake
export const generateFood = (snake: Point[]): Point => {
  let newFood;
  do {
    newFood = getRandomPoint();
  } while (isSnakeCell(newFood, snake));
  return newFood;
};

// Function to get the corner class for grid cells
export const getCornerClass = (
  row: number,
  col: number,
  gridSize: number,
): string => {
  if (row === 0 && col === 0) return "rounded-tl-xl";
  if (row === 0 && col === gridSize - 1) return "rounded-tr-xl";
  if (row === gridSize - 1 && col === 0) return "rounded-bl-xl";
  if (row === gridSize - 1 && col === gridSize - 1) return "rounded-br-xl";
  return "";
};
