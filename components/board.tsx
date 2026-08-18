"use client";

import { memo, useMemo } from "react";
import type { BoardState, PieceValue } from "@/types/board";
import { useSettings } from "@/themes/context";
import type { CheckerSettings } from "@/types/settings";
import defaultStyles from "@/styles/default.module.css";
import cyberpunkStyles from "@/styles/cyberpunk.module.css";

export type BoardTheme = Pick<
  CheckerSettings,
  "myPieceColor" | "opponentPieceColor" | "lightTileColor" | "darkTileColor"
>;

const pieceBackground = (color: string) =>
  `radial-gradient(circle at 30% 30%, rgba(255,255,255,.55) 0%, ${color} 38%, ${color} 68%, rgba(0,0,0,.55) 100%)`;

const Piece = memo(function Piece({
  pieceType,
  row,
  col,
  theme,
  styles,
  isCyberpunk,
  onSquareClick,
}: {
  pieceType: PieceValue;
  row: number;
  col: number;
  theme: BoardTheme;
  styles: Record<string, string>;
  isCyberpunk: boolean;
  onSquareClick: (row: number, col: number) => void;
}) {
  if (!pieceType) return null;

  const isKing = pieceType === "darkKing" || pieceType === "lightKing";
  const isDark = pieceType === "dark" || pieceType === "darkKing";

  const pieceClass = isKing
    ? isDark
      ? styles.darkKing
      : styles.lightKing
    : isDark
      ? styles.darkPiece
      : styles.lightPiece;

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
});

const Square = memo(function Square({
  row,
  col,
  piece,
  isDarkSquare,
  isSelected,
  isValidMove,
  isForcedCapture,
  theme,
  styles,
  isCyberpunk,
  onSquareClick,
}: {
  row: number;
  col: number;
  piece: PieceValue;
  isDarkSquare: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isForcedCapture: boolean;
  theme: BoardTheme;
  styles: Record<string, string>;
  isCyberpunk: boolean;
  onSquareClick: (row: number, col: number) => void;
}) {
  const squareClasses = [
    isDarkSquare ? styles.darkSquare : styles.lightSquare,
    isSelected ? styles.selected : "",
    isValidMove ? styles.validMove : "",
    isForcedCapture ? styles.forcedCapture : "",
  ]
    .filter(Boolean)
    .join(" ");

  const squareStyle = isCyberpunk
    ? {}
    : {
        background: isDarkSquare ? theme.darkTileColor : theme.lightTileColor,
      };

  return (
    <div
      className={squareClasses}
      style={squareStyle}
      onClick={() => onSquareClick(row, col)}
    >
      <Piece
        pieceType={piece}
        row={row}
        col={col}
        theme={theme}
        styles={styles}
        isCyberpunk={isCyberpunk}
        onSquareClick={onSquareClick}
      />
    </div>
  );
});

export default memo(function Board({
  board,
  selected,
  validMoves,
  forcedCapturePieces = [],
  onSquareClick,
  theme,
  sizeClassName = "h-[480px] w-[480px]",
}: {
  board: BoardState;
  selected: [number, number] | null;
  validMoves: [number, number][];
  forcedCapturePieces?: [number, number][];
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

  const validMovesSet = useMemo(
    () => new Set(validMoves.map(([r, c]) => `${r}-${c}`)),
    [validMoves],
  );

  const forcedCaptureSet = useMemo(
    () => new Set(forcedCapturePieces.map(([r, c]) => `${r}-${c}`)),
    [forcedCapturePieces],
  );

  const selectedKey = selected ? `${selected[0]}-${selected[1]}` : null;

  const boardContainerClass = isCyberpunk
    ? `grid grid-cols-8 grid-rows-8 border-2 border-[#00f2fe] shadow-[0_0_20px_rgba(0,242,254,0.3)] bg-[#010003] ${sizeClassName}`
    : `grid grid-cols-8 grid-rows-8 border-4 border-[#855f42] shadow-2xl ${sizeClassName}`;

  const squares = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const key = `${row}-${col}`;
      const isDarkSquare = (row + col) % 2 !== 0;

      const isForcedCapture = forcedCaptureSet.has(key);
      const isSelected = selectedKey === key && !isForcedCapture;
      const isValidMove = validMovesSet.has(key);

      squares.push(
        <Square
          key={key}
          row={row}
          col={col}
          piece={board[row][col]}
          isDarkSquare={isDarkSquare}
          isSelected={isSelected}
          isValidMove={isValidMove}
          isForcedCapture={isForcedCapture}
          theme={currentTheme}
          styles={styles}
          isCyberpunk={isCyberpunk}
          onSquareClick={onSquareClick}
        />,
      );
    }
  }

  return <div className={boardContainerClass}>{squares}</div>;
});
