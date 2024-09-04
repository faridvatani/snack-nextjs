export const GRID_SIZE = 12;
export const INITIAL_SPEED = 200;
export const SNAKE_INITIAL_POSITION = [
  { x: 6, y: 6 },
  { x: 6, y: 7 },
  { x: 6, y: 8 },
];
export const FOOD_INITIAL_POSITION = { x: 0, y: 0 };
export const DIRECTIONS = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const;
