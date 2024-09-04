import React from "react";
import { Point } from "@/types";
import { isSnakeCell, getCornerClass } from "@/utils";
import { GRID_SIZE } from "@/constants";

type GridCellProps = {
  index: number;
  snake: Point[];
  food: Point;
};

// Component for each grid cell
const GridCell: React.FC<GridCellProps> = ({ index, snake, food }) => {
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  const isSnake = isSnakeCell({ x: col, y: row }, snake);
  const isFood = food.x === col && food.y === row;
  const isHead = snake[0].x === col && snake[0].y === row;
  const cornerClass = getCornerClass(row, col, GRID_SIZE);

  return (
    <div
      key={index}
      className={`flex items-center justify-center size-8 border border-gray-300 ${cornerClass} ${
        isHead
          ? "bg-blue-700"
          : isSnake
          ? "bg-blue-500"
          : isFood
          ? "bg-green-500"
          : "bg-white/85"
      }`}
    />
  );
};

export default GridCell;
