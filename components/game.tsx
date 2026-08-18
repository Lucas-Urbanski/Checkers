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

const KING_DIRECTIONS: [number, number][] = [
  [1, -1],
  [1, 1],
  [-1, -1],
  [-1, 1],
];
const DARK_DIRECTIONS: [number, number][] = [
  [1, -1],
  [1, 1],
];
const LIGHT_DIRECTIONS: [number, number][] = [
  [-1, -1],
  [-1, 1],
];

function isInsideBoard(row: number, col: number) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function getPieceOwner(piece: PieceValue): Player | null {
  if (piece === "light" || piece === "lightKing") return "light";
  if (piece === "dark" || piece === "darkKing") return "dark";
  return null;
}

export function checkForWinner(board: BoardState) {
  let lightWins = false;
  let darkWins = false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const owner = getPieceOwner(board[row][col]);

      if (owner === "light" && !lightWins) {
        if (getValidMoves(board, row, col).length > 0) lightWins = true;
      }
      if (owner === "dark" && !darkWins) {
        if (getValidMoves(board, row, col).length > 0) darkWins = true;
      }

      if (lightWins && darkWins) return "No Winner";
    }
  }

  if (!darkWins) return "Light Wins";
  if (!lightWins) return "Dark Wins";
  return "No Winner";
}

function getMoveDirections(
  piece: Exclude<PieceValue, null>,
): [number, number][] {
  if (piece === "lightKing" || piece === "darkKing") return KING_DIRECTIONS;
  if (piece === "dark") return DARK_DIRECTIONS;
  return LIGHT_DIRECTIONS;
}

function getNormalMoves(
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

function getCaptureMoves(
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

function findPieces(board: BoardState, player: Player): [number, number][] {
  const pieces: [number, number][] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (getPieceOwner(board[row][col]) === player) {
        pieces.push([row, col]);
      }
    }
  }
  return pieces;
}

export function getCapturingPieces(
  board: BoardState,
  player: Player,
): [number, number][] {
  return findPieces(board, player).filter(
    ([row, col]) => getCaptureMoves(board, row, col).length > 0,
  );
}

export function playerHasCapture(board: BoardState, player: Player): boolean {
  return findPieces(board, player).some(
    ([row, col]) => getCaptureMoves(board, row, col).length > 0,
  );
}

export function getLegalMoves(
  board: BoardState,
  row: number,
  col: number,
  turn: Player,
): [number, number][] {
  const piece = board[row][col];

  if (!piece) return [];
  if (getPieceOwner(piece) !== turn) return [];

  const captureMoves = getCaptureMoves(board, row, col);

  if (captureMoves.length > 0) {
    return captureMoves;
  }

  if (playerHasCapture(board, turn)) {
    return [];
  }

  return getNormalMoves(board, row, col);
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

function validMove(
  board: BoardState,
  currentTurn: Player,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean {
  return getLegalMoves(board, fromRow, fromCol, currentTurn).some(
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

  if (!validMove(board, currentTurn, fromRow, fromCol, toRow, toCol)) {
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

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  const isCaptureMove = Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2;
  const nextBoard = [...board];

  nextBoard[fromRow] = [...nextBoard[fromRow]];
  nextBoard[toRow] = [...nextBoard[toRow]];
  nextBoard[fromRow][fromCol] = null;
  
  const crownedPiece = crownPiece(movingPiece, toRow);
  nextBoard[toRow][toCol] = crownedPiece;
  
  const wasJustCrowned = movingPiece !== crownedPiece;

  if (isCaptureMove) {
    const capturedRow = fromRow + rowDiff / 2;
    const capturedCol = fromCol + colDiff / 2;

    nextBoard[capturedRow] = [...nextBoard[capturedRow]];
    nextBoard[capturedRow][capturedCol] = null;

    if (!wasJustCrowned) {
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
  }

  return {
    board: nextBoard,
    turn: currentTurn === "light" ? "dark" : "light",
    mustContinueJump: false,
    selectedPiece: null,
  };
}
