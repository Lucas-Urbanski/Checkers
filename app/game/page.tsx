"use client";

import { useState } from "react";
import "@/styles/square.css";
import "@/styles/piece.css";

type PieceValue = "dark" | "light" | null;
type BoardState = PieceValue[][];

const DEFAULT_BOARD: BoardState = [
  [null, "dark", null, "dark", null, "dark", null, "dark"],
  ["dark", null, "dark", null, "dark", null, "dark", null],
  [null, "dark", null, "dark", null, "dark", null, "dark"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["light", null, "light", null, "light", null, "light", null],
  [null, "light", null, "light", null, "light", null, "light"],
  ["light", null, "light", null, "light", null, "light", null],
];

function renderPiece(pieceType: PieceValue) {
  if (pieceType === "dark") return <button className="darkPiece" />;
  if (pieceType === "light") return <button className="lightPiece" />;
  
  return null;
}

function renderSquares(board: BoardState) {
  const squares = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const key = `${row}-${col}`;
      const isDarkSquare = (row + col) % 2 !== 0;

      if (isDarkSquare) {
        squares.push(
          <div key={key} className="darkSquare">
            {renderPiece(board[row][col])}
          </div>
        );
      }
      else {
        squares.push(<div key={key} className="lightSquare" />);
      }
    }
  }
  return squares;
}

export default function Game() {
  const [board, setBoard] = useState<BoardState>(DEFAULT_BOARD);

  return (
    <div className="flex justify-center items-center w-full h-screen bg-neutral-800">
      <div className="grid grid-cols-8 grid-rows-8 w-[480px] h-[480px] border-2 border-neutral-600">
        {renderSquares(board)}
      </div>
    </div>
  );
}