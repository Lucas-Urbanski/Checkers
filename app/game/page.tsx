"use client";

import { useState } from "react";
import "@/styles/square.css";
import "@/styles/piece.css";

type PieceValue = "dark" | "light" | null;
type BoardState = PieceValue[][];

type CheckerSettings = {
  myPieceColor: string;
  opponentPieceColor: string;
  backgroundColor: string;
};

const DEFAULT_SETTINGS: CheckerSettings = {
  myPieceColor: "#f7e7ce",
  opponentPieceColor: "#4a2e1b",
  backgroundColor: "#f5efe6",
};

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

function loadSettings(): CheckerSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const savedSettings = localStorage.getItem("checkerSettings");

    if (!savedSettings) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(savedSettings),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function renderPiece(pieceType: PieceValue, settings: CheckerSettings) {
  if (pieceType === "dark") {
    return (
      <button
        className="darkPiece"
        style={{
          backgroundColor: settings.opponentPieceColor,
        }}
      />
    );
  }

  if (pieceType === "light") {
    return (
      <button
        className="lightPiece"
        style={{
          backgroundColor: settings.myPieceColor,
        }}
      />
    );
  }

  return null;
}

function renderSquares(board: BoardState, settings: CheckerSettings) {
  const squares = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const key = `${row}-${col}`;
      const isDarkSquare = (row + col) % 2 !== 0;

      if (isDarkSquare) {
        squares.push(
          <div key={key} className="darkSquare">
            {renderPiece(board[row][col], settings)}
          </div>,
        );
      } else {
        squares.push(
          <div key={key} className="lightSquare">
            {renderPiece(board[row][col], settings)}
          </div>,
        );
      }
    }
  }

  return squares;
}

export default function Game() {
  const [board] = useState<BoardState>(DEFAULT_BOARD);
  const [settings] = useState<CheckerSettings>(loadSettings);

  return (
    <div
      className="flex h-screen w-full items-center justify-center"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <div className="grid h-[480px] w-[480px] grid-cols-8 grid-rows-8 border-4 border-[#855f42] shadow-2xl">
        {renderSquares(board, settings)}
      </div>
    </div>
  );
}