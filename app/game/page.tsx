"use client";

import { DEFAULT_BOARD, getValidMoves, applyMove } from "@/components/game";
import type { BoardState } from "@/types/board";
import { useSettings } from "@/themes/context";
import Board from "@/components/board";
import { useState } from "react";
import Board, {
  type BoardState,
  type BoardTheme,
} from "@/app/components/board";

type CheckerSettings = BoardTheme & {
  backgroundColor: string;
};

const DEFAULT_SETTINGS: CheckerSettings = {
  myPieceColor: "#f7e7ce",
  opponentPieceColor: "#4a2e1b",
  lightTileColor: "#f0d9b5",
  darkTileColor: "#b58863",
  backgroundColor: "#4c2424",
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

export default function Game() {
  const [board, setBoard] = useState<BoardState>(DEFAULT_BOARD);
  const [turn, setTurn] = useState<"light" | "dark">("light");
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const { settings } = useSettings();

  const myPieceColor = settings.playerSide;
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

    // logic for online multiplayer and bot games.
    // const targetPiece = board[row][col];
    // if (targetPiece === myPieceColor && turn === myPieceColor) {
    //   setSelected([row, col]);
    //   return;
    // }

    // logic for local multiplayer games.
    const targetPiece = board[row][col];
    if (targetPiece === turn) {
      setSelected([row, col]);
      return;
    }

    setSelected(null);
  }

  const boardTheme: BoardTheme = {
    myPieceColor: settings.myPieceColor,
    opponentPieceColor: settings.opponentPieceColor,
    lightTileColor: settings.lightTileColor,
    darkTileColor: settings.darkTileColor,
  };

  return (
    <div
      className="flex h-screen w-full items-center justify-center"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <Board
        board={board}
        selected={null}
        validMoves={[]}
        onSquareClick={() => undefined}
        theme={boardTheme}
        sizeClassName="h-[480px] w-[480px]"
      />
    </div>
  );
}
