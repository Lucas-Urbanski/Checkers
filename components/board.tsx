"use client";

import type { BoardState, PieceValue } from "@/types/board";
import { useSettings } from "@/themes/context";
import "@/styles/square.css";
import "@/styles/piece.css";

function renderPiece(
  pieceType: PieceValue,
  row: number,
  col: number,
  myPieceColor: string,
  opponentPieceColor: string,
  onSquareClick: (row: number, col: number) => void,
) {
  if (pieceType === "dark") {
    return (
      <button
        className="darkPiece"
        style={{ backgroundColor: opponentPieceColor }}
        onClick={(e) => {
          e.stopPropagation();
          onSquareClick(row, col);
        }}
      />
    );
  }

  if (pieceType === "light") {
    return (
      <button
        className="lightPiece"
        style={{ backgroundColor: myPieceColor }}
        onClick={(e) => {
          e.stopPropagation();
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
  myPieceColor: string,
  opponentPieceColor: string,
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
          className={`${isDarkSquare ? "darkSquare" : "lightSquare"}${isSelected ? " selected" : ""}`}
          onClick={() => onSquareClick(row, col)}
        >
          {isValidMove && <div className="moveablePiece" />}
          {renderPiece(board[row][col], row, col, myPieceColor, opponentPieceColor, onSquareClick)}
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
}: {
  board: BoardState;
  selected: [number, number] | null;
  validMoves: [number, number][];
  onSquareClick: (row: number, col: number) => void;
}) {
  const { settings } = useSettings();

  return (
    <div className="grid h-[480px] w-[480px] grid-cols-8 grid-rows-8 border-4 border-[#855f42] shadow-2xl">
      {renderSquares(
        board,
        selected,
        validMoves,
        settings.myPieceColor,
        settings.opponentPieceColor,
        onSquareClick,
      )}
    </div>
  );
}