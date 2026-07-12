import type { BoardState, PieceValue } from "@/types/board";

export const DEFAULT_BOARD: BoardState = [
  [null, "dark", null, "dark", null, "dark", null, "dark"],
  ["dark", null, "dark", null, "dark", null, "dark", null],
  [null, "dark", null, "dark", null, "dark", null, "dark"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["light", null, "light", null, "light", null, "light", null],
  [null, "light", null, "light", null, "light", null, "light"],
  ["light", null, "light", null, "light", null, "light", null],
];

export function placePiece(board: BoardState, row: number, col: number, piece: PieceValue): BoardState {
  return board.map((boardRow, r) =>
    r === row ? boardRow.map((cell, c) => (c === col ? piece : cell)) : boardRow
  );
}

export function removePiece(board: BoardState, row: number, col: number): BoardState {
  return placePiece(board, row, col, null);
}

export function validMove(
  board: BoardState,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean {
  if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;

  const piece = board[fromRow][fromCol];
  if (!piece || board[toRow][toCol] !== null) return false;

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  const forward = piece === "dark" ? 1 : -1;

  // Standard move
  if (Math.abs(colDiff) === 1 && rowDiff === forward) return true;

  // Jump over opponent
  if (Math.abs(colDiff) === 2 && rowDiff === forward * 2) {
    const middleRow = fromRow + forward;
    const middleCol = fromCol + colDiff / 2;
    const middlePiece = board[middleRow][middleCol];
    const opponent = piece === "dark" ? "light" : "dark";
    return middlePiece === opponent;
  }

  return false;
}

export function getValidMoves(board: BoardState, row: number, col: number): [number, number][] {
  const piece = board[row][col];
  if (!piece) return [];

  const destinations: [number, number][] = [];
  const forward = piece === "dark" ? 1 : -1;
  const targets = [
    [row + forward, col - 1],
    [row + forward, col + 1],
    [row + forward * 2, col - 2],
    [row + forward * 2, col + 2],
  ];

  for (const [toRow, toCol] of targets) {
    if (validMove(board, row, col, toRow, toCol)) {
      destinations.push([toRow, toCol]);
    }
  }

  return destinations;
}

interface MoveResult {
  board: BoardState;
  turn: "light" | "dark";
}

export function applyMove(
  board: BoardState,
  currentTurn: "light" | "dark",
  from: [number, number],
  to: [number, number]
): MoveResult {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  if (!validMove(board, fromRow, fromCol, toRow, toCol)) {
    return { board, turn: currentTurn };
  }

  const piece = board[fromRow][fromCol];
  let nextBoard = removePiece(board, fromRow, fromCol);
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  if (Math.abs(rowDiff) === 2) {
    const middleRow = fromRow + rowDiff / 2;
    const middleCol = fromCol + colDiff / 2;
    nextBoard = removePiece(nextBoard, middleRow, middleCol);
  }

  nextBoard = placePiece(nextBoard, toRow, toCol, piece);
  const nextTurn = currentTurn === "light" ? "dark" : "light";

  return { board: nextBoard, turn: nextTurn };
}