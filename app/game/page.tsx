"use client";

import { useState } from "react";
import Board from "@/components/board";
import { DEFAULT_BOARD, getValidMoves, applyMove } from "@/components/game";
import type { BoardState, PieceValue } from "@/types/board";
import { useSettings } from "@/themes/context";

export default function Game() {
  const [board, setBoard] = useState<BoardState>(DEFAULT_BOARD);
  const [turn, setTurn] = useState<Exclude<PieceValue, null>>("light");
  const [selected, setSelected] = useState<[number, number] | null>(null);
  
  const { settings } = useSettings();

  const validMoves = selected
    ? getValidMoves(board, selected[0], selected[1])
    : [];

  function handleSquareClick(row: number, col: number) {
    if (selected && selected[0] === row && selected[1] === col) {
      setSelected(null);
      return;
    }

    if (selected && validMoves.some(([r, c]) => r === row && c === col)) {
      const { board: nextBoard, turn: nextTurn } = applyMove(
        board,
        turn,
        selected,
        [row, col],
      );

      setBoard(nextBoard);
      setTurn(nextTurn);
      setSelected(null);
      return;
    }

    const targetPiece = board[row][col];

    if (targetPiece === turn) {
      setSelected([row, col]);
      return;
    }

    setSelected(null);
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Board
        board={board}
        selected={selected}
        validMoves={validMoves}
        onSquareClick={handleSquareClick}
        sizeClassName="h-[480px] w-[480px]"
        theme={{
          myPieceColor: settings.myPieceColor,
          opponentPieceColor: settings.opponentPieceColor,
          lightTileColor: settings.lightTileColor,
          darkTileColor: settings.darkTileColor,
        }}
      />
    </div>
  );
}