import type { BoardState, MoveResult } from "@/types/board";

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

export function isKing(board: BoardState, row: number, col: number): boolean {
  const piece = board[row][col];
  return piece === "darkKing" || piece === "lightKing";
}

export function validMove(
  board: BoardState,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean {
  if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;

  const piece = board[fromRow][fromCol];
  if (!piece || board[toRow][toCol] !== null) return false;

  const isKing = piece === "darkKing" || piece === "lightKing";
  const isDark = piece === "dark" || piece === "darkKing";

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  if (!isKing) {
    const forward = isDark ? 1 : -1;
    if (rowDiff > 0 && forward === -1) return false;
    if (rowDiff < 0 && forward === 1) return false;
  }

  if (Math.abs(colDiff) === 1 && Math.abs(rowDiff) === 1) return true;

  if (Math.abs(colDiff) === 2 && Math.abs(rowDiff) === 2) {
    const middleRow = fromRow + rowDiff / 2;
    const middleCol = fromCol + colDiff / 2;
    const middlePiece = board[middleRow][middleCol];

    if (!middlePiece) return false;

    const middleIsDark = middlePiece === "dark" || middlePiece === "darkKing";
    return isDark !== middleIsDark;
  }

  return false;
}

export function getValidMoves(
  board: BoardState,
  row: number,
  col: number,
): [number, number][] {
  const piece = board[row][col];
  if (!piece) return [];

  const destinations: [number, number][] = [];
  const isKing = piece === "darkKing" || piece === "lightKing";
  const forward = piece === "dark" || piece === "darkKing" ? 1 : -1;

  const directions = isKing ? [1, -1] : [forward];

  for (const dir of directions) {
    const r1 = row + dir;
    const r2 = row + dir * 2;

    if (validMove(board, row, col, r1, col - 1))
      destinations.push([r1, col - 1]);
    if (validMove(board, row, col, r1, col + 1))
      destinations.push([r1, col + 1]);
    if (validMove(board, row, col, r2, col - 2))
      destinations.push([r2, col - 2]);
    if (validMove(board, row, col, r2, col + 2))
      destinations.push([r2, col + 2]);
  }

  return destinations;
}

export function applyMove(
  board: BoardState,
  currentTurn: "light" | "dark",
  from: [number, number],
  to: [number, number],
): MoveResult {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  if (!validMove(board, fromRow, fromCol, toRow, toCol)) {
    return { board, turn: currentTurn };
  }

  let piece = board[fromRow][fromCol];
  const nextBoard = [...board];

  nextBoard[fromRow] = [...nextBoard[fromRow]];
  if (fromRow !== toRow) {
    nextBoard[toRow] = [...nextBoard[toRow]];
  }

  if (piece === "light" && toRow === 0) piece = "lightKing";
  if (piece === "dark" && toRow === 7) piece = "darkKing";

  nextBoard[fromRow][fromCol] = null;
  nextBoard[toRow][toCol] = piece;

  const rowDiff = toRow - fromRow;

  if (Math.abs(rowDiff) === 2) {
    const middleRow = fromRow + rowDiff / 2;
    const middleCol = fromCol + (toCol - fromCol) / 2;

    if (middleRow !== fromRow && middleRow !== toRow) {
      nextBoard[middleRow] = [...nextBoard[middleRow]];
    }
    nextBoard[middleRow][middleCol] = null;
  }

  return {
    board: nextBoard,
    turn: currentTurn === "light" ? "dark" : "light",
  };
}
