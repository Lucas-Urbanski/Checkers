"use client";

import type { BoardState, PieceValue } from "@/types/board";
import { useSettings } from "@/themes/context";
import { useState } from "react";
import "@/styles/square.css";
import "@/styles/piece.css";

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

function renderPiece(
  pieceType: PieceValue,
  myPieceColor: string,
  opponentPieceColor: string,
) {
  if (pieceType === "dark") {
    return (
      <button
        className="darkPiece"
        style={{ backgroundColor: opponentPieceColor }}
      />
    );
  }

  if (pieceType === "light") {
    return (
      <button
        className="lightPiece"
        style={{ backgroundColor: myPieceColor }}
      />
    );
  }

  return null;
}

function renderSquares(
  board: BoardState,
  myPieceColor: string,
  opponentPieceColor: string,
) {
  const squares = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const key = `${row}-${col}`;
      const isDarkSquare = (row + col) % 2 !== 0;

      squares.push(
        <div key={key} className={isDarkSquare ? "darkSquare" : "lightSquare"}>
          {renderPiece(board[row][col], myPieceColor, opponentPieceColor)}
        </div>,
      );
    }
  }

  return squares;
}

export default function Game() {
  const [board] = useState<BoardState>(DEFAULT_BOARD);
  const { settings } = useSettings();

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="grid h-[480px] w-[480px] grid-cols-8 grid-rows-8 border-4 border-[#855f42] shadow-2xl">
        {renderSquares(board, settings.myPieceColor, settings.opponentPieceColor)}
      </div>
    </div>
  );
}