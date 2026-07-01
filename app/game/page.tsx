"use client";

import { useState } from "react";
import Board, { PieceValue, BoardState } from "../components/board";

type Player = "light" | "dark";

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



export default function Game() {
  const [board, setBoard] = useState<BoardState>(DEFAULT_BOARD);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [turn, setTurn] = useState<Player>("light");

  function getValidMoves(){
    const moves: [number, number][] = [];
    return;
  }

  function handleSquareClick(){
    return;
  }

  return (
    <div className="flex justify-center items-center w-full h-screen bg-neutral-800">
      <Board
        board={board}
        selected={selected}
        validMoves={validMoves}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
}
