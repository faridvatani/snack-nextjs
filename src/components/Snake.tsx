"use client";
import React, { FC, useEffect, useReducer } from "react";
import { initialState, snakeReducer } from "@/reducers/snakeReducer";
import { DIRECTIONS, GRID_SIZE } from "@/constants";
import GridCell from "@/components/GridCell";
import { Direction } from "@/types";

const Snake: FC = () => {
  const [state, dispatch] = useReducer(snakeReducer, initialState);

  useEffect(() => {
    dispatch({ type: "GENERATE_FOOD" });

    // Handle keydown events to change direction
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyDirectionMap: { [key: string]: Direction } = {
        ArrowUp: DIRECTIONS.UP,
        ArrowDown: DIRECTIONS.DOWN,
        ArrowLeft: DIRECTIONS.LEFT,
        ArrowRight: DIRECTIONS.RIGHT,
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
    <section className="relative">
      <div
        className="grid gap-0.5 border-2 border-gray-700 rounded-xl"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {!state.isGameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 text-white rounded-xl">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-700 bg-opacity-50 text-white rounded-xl">
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
      </div>
      {state.isGameStarted && !state.isGameOver && (
        <div className="absolute top-4 left-4 flex flex-row text-gray-700 text-sm">
          <p>
            Score: {state.score} - Highest Score: {state.highestScore}
          </p>
        </div>
      )}
    </section>
  );
};

export default Snake;
