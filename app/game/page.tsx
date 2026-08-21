"use client";

import { useState, useMemo, useCallback } from "react";
import Board from "@/components/board";
import {
  DEFAULT_BOARD,
  getLegalMoves,
  applyMove,
  checkForWinner,
  getPieceOwner,
  getCapturingPieces,
} from "@/components/game";
import type { BoardState, Player } from "@/types/board";
import { useSettings } from "@/themes/context";
import defaultStyles from "@/styles/default.module.css";
import cyberpunkStyles from "@/styles/cyberpunk.module.css";

const MAX_TURNS_WITHOUT_CAPTURE_OR_KING = 20;

const pieceBackground = (color: string) =>
  `radial-gradient(circle at 30% 30%, rgba(255,255,255,.55) 0%, ${color} 38%, ${color} 68%, rgba(0,0,0,.55) 100%)`;

export default function Game() {
  const [board, setBoard] = useState<BoardState>(DEFAULT_BOARD);
  const [turn, setTurn] = useState<Player>("light");
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [winner, setWinner] = useState("No Winner");
  const [mustContinueJump, setMustContinueJump] = useState(false);
  const [turnsWithoutProgress, setTurnsWithoutProgress] = useState(0);

  const { settings } = useSettings();

  const isCyberpunk = settings.theme === "cyberpunk";

  const validMoves = useMemo(() => {
    return selected ? getLegalMoves(board, selected[0], selected[1], turn) : [];
  }, [board, selected, turn]);

  const forcedCapturePieces = useMemo(() => {
    return mustContinueJump && selected
      ? [selected]
      : getCapturingPieces(board, turn);
  }, [board, turn, mustContinueJump, selected]);

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      const clickedValidMove = validMoves.some(
        ([validRow, validCol]) => validRow === row && validCol === col,
      );

      if (selected && clickedValidMove) {
        const {
          board: nextBoard,
          turn: nextTurn,
          mustContinueJump: nextMustContinueJump,
          selectedPiece,
          resetTieCounter,
        } = applyMove(board, turn, selected, [row, col]);

        const nextTurnsWithoutProgress = resetTieCounter
          ? 0
          : turnsWithoutProgress + 1;

        setBoard(nextBoard);
        setTurn(nextTurn);
        setSelected(selectedPiece);
        setMustContinueJump(nextMustContinueJump);
        setTurnsWithoutProgress(nextTurnsWithoutProgress);

        const isWinner = checkForWinner(nextBoard);

        if (isWinner !== "No Winner") {
          setWinner(isWinner);
          return;
        }

        if (
          !nextMustContinueJump &&
          nextTurnsWithoutProgress >= MAX_TURNS_WITHOUT_CAPTURE_OR_KING
        ) {
          setWinner("DRAW");
        }

        return;
      }

      if (mustContinueJump) return;

      if (selected && selected[0] === row && selected[1] === col) {
        setSelected(null);
        return;
      }

      const targetPiece = board[row][col];

      if (getPieceOwner(targetPiece) === turn) {
        const selectedPieceMoves = getLegalMoves(board, row, col, turn);

        if (selectedPieceMoves.length === 0) return;

        setSelected([row, col]);
        return;
      }

      setSelected(null);
    },
    [board, turn, selected, validMoves, mustContinueJump, turnsWithoutProgress],
  );

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {winner === "No Winner" ? (
        <div className="flex flex-col gap-4">
          <div
            className={`flex items-center gap-1 text-xl transition-opacity ${
              turn === "dark" ? "opacity-100 font-bold" : "opacity-40"
            }`}
          >
            <div className="flex h-10 w-10 items-center">
              <div
                className={
                  isCyberpunk
                    ? cyberpunkStyles.darkPiece
                    : defaultStyles.darkPiece
                }
                style={
                  isCyberpunk
                    ? {}
                    : {
                        background: pieceBackground(
                          settings.opponentPieceColor,
                        ),
                      }
                }
              />
            </div>
            <p>Opponent</p>
          </div>

          <Board
            board={board}
            selected={selected}
            validMoves={validMoves}
            forcedCapturePieces={forcedCapturePieces}
            activeTurn={turn}
            onSquareClick={handleSquareClick}
            sizeClassName="h-[480px] w-[480px]"
          />

          <div
            className={`flex items-center gap-1 text-xl transition-opacity ${
              turn === "light" ? "opacity-100 font-bold" : "opacity-40"
            }`}
          >
            <div className="flex h-10 w-10 items-center">
              <div
                className={
                  isCyberpunk
                    ? cyberpunkStyles.lightPiece
                    : defaultStyles.lightPiece
                }
                style={
                  isCyberpunk
                    ? {}
                    : { background: pieceBackground(settings.myPieceColor) }
                }
              />
            </div>
            <p>You</p>
          </div>

          <p className="text-center text-sm font-bold opacity-70">
            Counter: {turnsWithoutProgress}/
            {MAX_TURNS_WITHOUT_CAPTURE_OR_KING}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">{winner}</h1>
        </div>
      )}
    </div>
  );
}