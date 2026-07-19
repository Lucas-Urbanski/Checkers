"use client";

import type { BoardState, PieceValue } from "@/types/board";
import { useSettings } from "@/themes/context";
import type { CheckerSettings } from "@/types/settings";

import defaultStyles from "@/styles/default.module.css";
import cyberpunkStyles from "@/styles/cyberpunk.module.css";

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
  styles: Record<string, string>,
  isCyberpunk: boolean,
  onSquareClick: (row: number, col: number) => void,
) {
  if (!pieceType) return null;

  const isDark = pieceType === "dark";
  const isKing = false;
  let pieceClass;
  if (isKing) {
    pieceClass = isDark ? styles.darkPiece : styles.lightPiece;
  } else {
    pieceClass = isDark ? styles.darkKing : styles.lightKing;
  }

  const pieceStyle = isCyberpunk
    ? {}
    : {
        background: pieceBackground(
          isDark ? theme.opponentPieceColor : theme.myPieceColor,
        ),
      };

  return (
    <button
      type="button"
      className={pieceClass}
      style={pieceStyle}
      onClick={(event) => {
        event.stopPropagation();
        onSquareClick(row, col);
      }}
    />
  );
}

function renderSquares(
  board: BoardState,
  selected: [number, number] | null,
  validMoves: [number, number][],
  theme: BoardTheme,
  styles: Record<string, string>,
  isCyberpunk: boolean,
  onSquareClick: (row: number, col: number) => void,
) {
  const squares = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const key = `${row}-${col}`;
      const isDarkSquare = (row + col) % 2 !== 0;
      const isSelected = selected?.[0] === row && selected?.[1] === col;
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

      const squareClasses = [
        isDarkSquare ? styles.darkSquare : styles.lightSquare,
        isSelected ? styles.selected : "",
        isValidMove ? styles.validMove : "",
      ]
        .filter(Boolean)
        .join(" ");

      const squareStyle = isCyberpunk
        ? {}
        : {
            background: isDarkSquare
              ? theme.darkTileColor
              : theme.lightTileColor,
          };

      squares.push(
        <div
          key={key}
          className={squareClasses}
          style={squareStyle}
          onClick={() => onSquareClick(row, col)}
        >
          {renderPiece(
            board[row][col],
            row,
            col,
            theme,
            styles,
            isCyberpunk,
            onSquareClick,
          )}
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

  const isCyberpunk = settings.theme === "cyberpunk";
  const styles = isCyberpunk ? cyberpunkStyles : defaultStyles;

  const currentTheme: BoardTheme = theme ?? {
    myPieceColor: settings.myPieceColor,
    opponentPieceColor: settings.opponentPieceColor,
    lightTileColor: settings.lightTileColor,
    darkTileColor: settings.darkTileColor,
  };

  const boardContainerClass = isCyberpunk
    ? `grid grid-cols-8 grid-rows-8 border-2 border-[#00f2fe] shadow-[0_0_20px_rgba(0,242,254,0.3)] bg-[#010003] ${sizeClassName}`
    : `grid grid-cols-8 grid-rows-8 border-4 border-[#855f42] shadow-2xl ${sizeClassName}`;

  return (
    <div className={boardContainerClass}>
      {renderSquares(
        board,
        selected,
        validMoves,
        currentTheme,
        styles,
        isCyberpunk,
        onSquareClick,
      )}
    </div>
  );
}
