"use client";
import React, { useEffect, useReducer } from "react";

const GRID_SIZE = 12; // Size of the grid

// Type definitions for points and directions
type Point = {
  x: number;
  y: number;
};

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

// State type for the snake game
type SnakeState = {
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
type MoveAction = { type: "MOVE" };
type ChangeDirectionAction = { type: "CHANGE_DIRECTION"; direction: Direction };
type GenerateFoodAction = { type: "GENERATE_FOOD" };
type StartGameAction = { type: "START_GAME" };
type GameOverAction = { type: "GAME_OVER" };
type ResetAction = { type: "RESET" };

type SnakeAction =
  | MoveAction
  | ChangeDirectionAction
  | GenerateFoodAction
  | StartGameAction
  | GameOverAction
  | ResetAction;

// Initial state of the game
const initialState: SnakeState = {
  snake: [
    { x: 6, y: 6 },
    { x: 6, y: 7 },
    { x: 6, y: 8 },
  ],
  food: { x: 0, y: 0 },
  direction: "RIGHT",
  isGameStarted: false,
  isGameOver: false,
  score: 0,
  highestScore: 0,
  speed: 200,
};

// Function to generate a random point on the grid
const getRandomPoint = (): Point => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

// Function to check if a point is part of the snake
const isSnakeCell = (point: Point, snake: Point[]): boolean => {
  return snake.some(
    (segment) => segment.x === point.x && segment.y === point.y,
  );
};

// Function to generate a new food point that is not on the snake
const generateFood = (snake: Point[]): Point => {
  let newFood;
  do {
    newFood = getRandomPoint();
  } while (isSnakeCell(newFood, snake));
  return newFood;
};

// Reducer function to manage the game state
const snakeReducer = (state: SnakeState, action: SnakeAction): SnakeState => {
  switch (action.type) {
    case "MOVE":
      if (state.isGameOver || !state.isGameStarted) return state;

      const newSnake = [...state.snake];
      const head = newSnake[0];
      let newHead: Point = { x: head.x, y: head.y };

      // Update the head position based on the current direction
      switch (state.direction) {
        case "UP":
          newHead.y -= 1;
          break;
        case "DOWN":
          newHead.y += 1;
          break;
        case "LEFT":
          newHead.x -= 1;
          break;
        case "RIGHT":
          newHead.x += 1;
          break;
      }

      // Check for boundary collision
      // if (
      //   newHead.x < 0 ||
      //   newHead.x >= GRID_SIZE ||
      //   newHead.y < 0 ||
      //   newHead.y >= GRID_SIZE
      // ) {
      //   return { ...state, isGameOver: true };
      // }

      // Wrap around the grid if the snake goes out of bounds
      if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
      if (newHead.x >= GRID_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
      if (newHead.y >= GRID_SIZE) newHead.y = 0;

      // Check for collision with itself
      if (isSnakeCell(newHead, newSnake)) {
        return {
          ...state,
          isGameOver: true,
          highestScore: Math.max(state.score, state.highestScore),
        };
      }

      newSnake.unshift(newHead);

      // Check if the snake has eaten the food
      if (newHead.x === state.food.x && newHead.y === state.food.y) {
        return {
          ...state,
          snake: newSnake,
          food: generateFood(newSnake),
          score: state.score + 1,
          speed: state.speed - 5,
        };
      } else {
        newSnake.pop();
        return { ...state, snake: newSnake };
      }

    case "CHANGE_DIRECTION":
      const oppositeDirections: { [key in Direction]: Direction } = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      };

      // Prevent the snake from reversing direction
      if (state.direction !== oppositeDirections[action.direction]) {
        return { ...state, direction: action.direction };
      }
      return state;

    case "GENERATE_FOOD":
      return { ...state, food: generateFood(state.snake) };

    case "START_GAME":
      return {
        ...initialState,
        isGameStarted: true,
        highestScore: state.highestScore,
      };

    case "GAME_OVER":
      return {
        ...state,
        isGameOver: true,
        highestScore: Math.max(state.score, state.highestScore),
      };

    case "RESET":
      return {
        ...initialState,
        isGameStarted: true,
        highestScore: state.highestScore,
      };

    default:
      return state;
  }
};

// Function to get the corner class for grid cells
const getCornerClass = (row: number, col: number, gridSize: number): string => {
  if (row === 0 && col === 0) return "rounded-tl-xl";
  if (row === 0 && col === gridSize - 1) return "rounded-tr-xl";
  if (row === gridSize - 1 && col === 0) return "rounded-bl-xl";
  if (row === gridSize - 1 && col === gridSize - 1) return "rounded-br-xl";
  return "";
};

// Component for each grid cell
const GridCell = ({
  index,
  snake,
  food,
}: {
  index: number;
  snake: Point[];
  food: Point;
}) => {
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  const isSnake = isSnakeCell({ x: col, y: row }, snake);
  const isFood = food.x === col && food.y === row;
  const isHead = snake[0].x === col && snake[0].y === row;
  const cornerClass = getCornerClass(row, col, GRID_SIZE);

  return (
    <div
      key={index}
      className={`flex items-center justify-center w-8 h-8 ${cornerClass} ${
        isHead
          ? "bg-red-900"
          : isSnake
          ? "bg-red-500"
          : isFood
          ? "bg-green-500"
          : "bg-slate-200"
      }`}
    />
  );
};

// Main Snake component
export default function Snake() {
  const [state, dispatch] = useReducer(snakeReducer, initialState);

  useEffect(() => {
    dispatch({ type: "GENERATE_FOOD" });

    // Handle keydown events to change direction
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyDirectionMap: { [key: string]: Direction } = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };

      const newDirection = keyDirectionMap[e.key];
      if (newDirection) {
        dispatch({ type: "CHANGE_DIRECTION", direction: newDirection });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Move the snake at regular intervals if the game has started
    const interval = setInterval(() => {
      if (state.isGameStarted) {
        dispatch({ type: "MOVE" });
      }
    }, state.speed);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, [state.isGameStarted, state.speed]);

  // Handle game start
  const handleStart = () => {
    dispatch({ type: "START_GAME" });
  };

  // Handle game reset
  const handleReset = () => {
    dispatch({ type: "RESET" });
    dispatch({ type: "GENERATE_FOOD" });
  };

  return (
    <div className="relative">
      <section
        className="grid gap-0.5 border-2 border-black rounded-xl"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {!state.isGameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-xl">
            <button
              onClick={handleStart}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Start Game
            </button>
          </div>
        )}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
          <GridCell
            key={index}
            index={index}
            snake={state.snake}
            food={state.food}
          />
        ))}
        {state.isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black bg-opacity-50 text-white rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <p className="text-3xl">Game Over</p>
              <p className="text-xl text-white">Score: {state.score}</p>
            </div>
            <button
              onClick={handleReset}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Play Again
            </button>
          </div>
        )}
      </section>
      {state.isGameStarted && !state.isGameOver && (
        <div className="absolute top-4 left-4 flex flex-row text-black text-sm">
          <p>
            Score: {state.score} - Highest Score: {state.highestScore}
          </p>
        </div>
      )}
    </div>
  );
}
