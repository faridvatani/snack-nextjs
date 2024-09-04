import { SnakeState, SnakeAction, Direction, Point } from "@/types";
import { generateFood, isSnakeCell } from "@/utils";
import {
  GRID_SIZE,
  DIRECTIONS,
  INITIAL_SPEED,
  FOOD_INITIAL_POSITION,
  SNAKE_INITIAL_POSITION,
} from "@/constants";

export const initialState: SnakeState = {
  snake: SNAKE_INITIAL_POSITION,
  food: FOOD_INITIAL_POSITION,
  direction: DIRECTIONS.RIGHT,
  isGameStarted: false,
  isGameOver: false,
  score: 0,
  highestScore: 0,
  speed: INITIAL_SPEED,
};

// Reducer function to manage the game state
export const snakeReducer = (
  state: SnakeState,
  action: SnakeAction,
): SnakeState => {
  switch (action.type) {
    case "MOVE":
      if (state.isGameOver || !state.isGameStarted) return state;

      const newSnake = [...state.snake];
      const head = newSnake[0];
      let newHead: Point = { x: head.x, y: head.y };

      // Update the head position based on the current direction
      switch (state.direction) {
        case DIRECTIONS.UP:
          newHead.y -= 1;
          break;
        case DIRECTIONS.DOWN:
          newHead.y += 1;
          break;
        case DIRECTIONS.LEFT:
          newHead.x -= 1;
          break;
        case DIRECTIONS.RIGHT:
          newHead.x += 1;
          break;
      }

      // Check for boundary collision and end the game
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
        UP: DIRECTIONS.DOWN,
        DOWN: DIRECTIONS.UP,
        LEFT: DIRECTIONS.RIGHT,
        RIGHT: DIRECTIONS.LEFT,
      };

      // Prevent the snake from reversing direction
      if (state.direction !== oppositeDirections[action.direction]) {
        return { ...state, direction: action.direction };
      }
      return state;

    case "GENERATE_FOOD":
      return { ...state, food: generateFood(state.snake) };

    case "START_GAME":
      return { ...state, isGameStarted: true };

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
