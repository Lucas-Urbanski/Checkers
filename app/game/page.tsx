"use client";

import { useState } from "react";
import Board from "@/components/board";
import {
  DEFAULT_BOARD,
  getLegalMoves,
  applyMove,
  checkForWinner,
  getPieceOwner,
  playerHasCapture,
  getCapturingPieces,
} from "@/components/game";
import type { BoardState, Player } from "@/types/board";
import { useSettings } from "@/themes/context";

export default function Game() {
  const [board, setBoard] = useState<BoardState>(DEFAULT_BOARD);
  const [turn, setTurn] = useState<Player>("light");
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [winner, setWinner] = useState("No Winner");
  const [mustContinueJump, setMustContinueJump] = useState(false);

  const { settings } = useSettings();

  const validMoves = selected
    ? getLegalMoves(board, selected[0], selected[1], turn)
    : [];

  const forcedCapturePieces =
    mustContinueJump && selected ? [selected] : getCapturingPieces(board, turn);

  function handleSquareClick(row: number, col: number) {
    const clickedValidMove = validMoves.some(
      ([validRow, validCol]) => validRow === row && validCol === col,
    );

    if (selected && clickedValidMove) {
      const {
        board: nextBoard,
        turn: nextTurn,
        mustContinueJump: nextMustContinueJump,
        selectedPiece,
      } = applyMove(board, turn, selected, [row, col]);

      setBoard(nextBoard);
      setTurn(nextTurn);
      setSelected(selectedPiece);
      setMustContinueJump(nextMustContinueJump);

      const isWinner = checkForWinner(nextBoard);

      if (isWinner !== "No Winner") {
        setWinner(isWinner);
      }

      return;
    }

    if (mustContinueJump) {
      return;
    }

    if (selected && selected[0] === row && selected[1] === col) {
      setSelected(null);
      return;
    }

    const targetPiece = board[row][col];

    if (getPieceOwner(targetPiece) === turn) {
      const selectedPieceMoves = getLegalMoves(board, row, col, turn);

      if (playerHasCapture(board, turn) && selectedPieceMoves.length === 0) {
        return;
      }

      setSelected([row, col]);
      return;
    }

    setSelected(null);
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {winner === "No Winner" ? (
        <div>
          <p> dark </p>
          <Board
            board={board}
            selected={selected}
            validMoves={validMoves}
            forcedCapturePieces={forcedCapturePieces}
            onSquareClick={handleSquareClick}
            sizeClassName="h-[480px] w-[480px]"
            theme={{
              myPieceColor: settings.myPieceColor,
              opponentPieceColor: settings.opponentPieceColor,
              lightTileColor: settings.lightTileColor,
              darkTileColor: settings.darkTileColor,
            }}
          />
          <p> light </p>
        </div>
      ) : (
        <h1>{winner}</h1>
      )}
    </div>
  );
}
