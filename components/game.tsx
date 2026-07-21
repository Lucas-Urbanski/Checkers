import type { BoardState, MoveResult, PieceValue, Player } from "@/types/board";

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

function isInsideBoard(row: number, col: number) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function getPieceOwner(piece: PieceValue): Player | null {
  if (piece === "light" || piece === "lightKing") return "light";
  if (piece === "dark" || piece === "darkKing") return "dark";
  return null;
}

function isKing(piece: PieceValue) {
  return piece === "lightKing" || piece === "darkKing";
}

function getMoveDirections(piece: Exclude<PieceValue, null>): [number, number][] {
  if (isKing(piece)) {
    return [
      [1, -1],
      [1, 1],
      [-1, -1],
      [-1, 1],
    ];
  }

  if (piece === "dark") {
    return [
      [1, -1],
      [1, 1],
    ];
  }

  return [
    [-1, -1],
    [-1, 1],
  ];
}

export function getNormalMoves(
  board: BoardState,
  row: number,
  col: number,
): [number, number][] {
  const piece = board[row][col];

  if (!piece) return [];

  const moves: [number, number][] = [];

  for (const [rowDirection, colDirection] of getMoveDirections(piece)) {
    const targetRow = row + rowDirection;
    const targetCol = col + colDirection;

    if (
      isInsideBoard(targetRow, targetCol) &&
      board[targetRow][targetCol] === null
    ) {
      moves.push([targetRow, targetCol]);
    }
  }

  return moves;
}

export function getCaptureMoves(
  board: BoardState,
  row: number,
  col: number,
): [number, number][] {
  const piece = board[row][col];

  if (!piece) return [];

  const pieceOwner = getPieceOwner(piece);
  const captures: [number, number][] = [];

  for (const [rowDirection, colDirection] of getMoveDirections(piece)) {
    const enemyRow = row + rowDirection;
    const enemyCol = col + colDirection;
    const landingRow = row + rowDirection * 2;
    const landingCol = col + colDirection * 2;

    if (!isInsideBoard(enemyRow, enemyCol)) continue;
    if (!isInsideBoard(landingRow, landingCol)) continue;

    const enemyPiece = board[enemyRow][enemyCol];
    const enemyOwner = getPieceOwner(enemyPiece);

    if (
      enemyPiece &&
      enemyOwner &&
      enemyOwner !== pieceOwner &&
      board[landingRow][landingCol] === null
    ) {
      captures.push([landingRow, landingCol]);
    }
  }

  return captures;
}

export function getValidMoves(
  board: BoardState,
  row: number,
  col: number,
): [number, number][] {
  const captureMoves = getCaptureMoves(board, row, col);

  if (captureMoves.length > 0) {
    return captureMoves;
  }

  return getNormalMoves(board, row, col);
}

export function validMove(
  board: BoardState,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean {
  return getValidMoves(board, fromRow, fromCol).some(
    ([row, col]) => row === toRow && col === toCol,
  );
}

function crownPiece(
  piece: Exclude<PieceValue, null>,
  row: number,
): Exclude<PieceValue, null> {
  if (piece === "light" && row === 0) return "lightKing";
  if (piece === "dark" && row === 7) return "darkKing";
  return piece;
}

export function applyMove(
  board: BoardState,
  currentTurn: Player,
  from: [number, number],
  to: [number, number],
): MoveResult {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  if (!validMove(board, fromRow, fromCol, toRow, toCol)) {
    return {
      board,
      turn: currentTurn,
      mustContinueJump: false,
      selectedPiece: null,
    };
  }

  const movingPiece = board[fromRow][fromCol];

  if (!movingPiece) {
    return {
      board,
      turn: currentTurn,
      mustContinueJump: false,
      selectedPiece: null,
    };
  }

  const nextBoard = board.map((boardRow) => [...boardRow]) as BoardState;

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  const isCaptureMove =
    Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2;

  nextBoard[fromRow][fromCol] = null;
  nextBoard[toRow][toCol] = crownPiece(movingPiece, toRow);

  if (isCaptureMove) {
    const capturedRow = fromRow + rowDiff / 2;
    const capturedCol = fromCol + colDiff / 2;

    nextBoard[capturedRow][capturedCol] = null;

    const nextCaptureMoves = getCaptureMoves(nextBoard, toRow, toCol);

    if (nextCaptureMoves.length > 0) {
      return {
        board: nextBoard,
        turn: currentTurn,
        mustContinueJump: true,
        selectedPiece: [toRow, toCol],
      };
    }
  }

  return {
    board: nextBoard,
    turn: currentTurn === "light" ? "dark" : "light",
    mustContinueJump: false,
    selectedPiece: null,
  };
}