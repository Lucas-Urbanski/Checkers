"use client";

import type { BoardState, PieceValue } from "@/types/board";
import { useSettings } from "@/themes/context";
import type { CheckerSettings } from "@/types/settings";
import "@/styles/square.css";
import "@/styles/piece.css";

export type BoardTheme = Pick<
  CheckerSettings,
  "myPieceColor" | "opponentPieceColor" | "lightTileColor" | "darkTileColor"
>;

function pieceBackground(color: string) {
  return `radial-gradient(circle at 30% 30%, rgba(255,255,255,.55) 0%, ${color} 38%, ${color} 68%, rgba(0,0,0,.55) 100%)`;
}

function renderPiece(
  pieceType: PieceValue,
  row: number,
  col: number,
  theme: BoardTheme,
  onSquareClick: (row: number, col: number) => void,
) {
  if (pieceType === "dark") {
    return (
      <button
        type="button"
        className="darkPiece"
        style={{ background: pieceBackground(theme.opponentPieceColor) }}
        onClick={(event) => {
          event.stopPropagation();
          onSquareClick(row, col);
        }}
      />
    );
  }

  if (pieceType === "light") {
    return (
      <button
        type="button"
        className="lightPiece"
        style={{ background: pieceBackground(theme.myPieceColor) }}
        onClick={(event) => {
          event.stopPropagation();
          onSquareClick(row, col);
        }}
      />
    );
  }

  return null;
}

function renderSquares(
  board: BoardState,
  selected: [number, number] | null,
  validMoves: [number, number][],
  theme: BoardTheme,
  onSquareClick: (row: number, col: number) => void,
) {
  const squares = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const key = `${row}-${col}`;
      const isDarkSquare = (row + col) % 2 !== 0;
      const isSelected = selected?.[0] === row && selected?.[1] === col;
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

      squares.push(
        <div
          key={key}
          className={`${isDarkSquare ? "darkSquare" : "lightSquare"}${
            isSelected ? " selected" : ""
          }${isValidMove ? " validMove" : ""}`}
          style={{
            background: isDarkSquare
              ? theme.darkTileColor
              : theme.lightTileColor,
          }}
          onClick={() => onSquareClick(row, col)}
        >
          {renderPiece(board[row][col], row, col, theme, onSquareClick)}
        </div>,
      );
    }
  }

  return squares;
}

export default function Board({
  board,
  selected,
  validMoves,
  onSquareClick,
  theme,
  sizeClassName = "h-[480px] w-[480px]",
}: {
  board: BoardState;
  selected: [number, number] | null;
  validMoves: [number, number][];
  onSquareClick: (row: number, col: number) => void;
  theme?: BoardTheme;
  sizeClassName?: string;
}) {
  const { settings } = useSettings();

  const currentTheme: BoardTheme = theme ?? {
    myPieceColor: settings.myPieceColor,
    opponentPieceColor: settings.opponentPieceColor,
    lightTileColor: settings.lightTileColor,
    darkTileColor: settings.darkTileColor,
  };

  return (
    <div
      className={`grid grid-cols-8 grid-rows-8 border-4 border-[#855f42] shadow-2xl ${sizeClassName}`}
    >
      {renderSquares(board, selected, validMoves, currentTheme, onSquareClick)}
    </div>
  );
}