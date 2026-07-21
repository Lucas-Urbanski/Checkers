export type PieceValue = "dark" | "light" | "darkKing" | "lightKing" | null;
export type BoardState = PieceValue[][];
export type Player = "light" | "dark";

export interface MoveResult {
  board: BoardState;
  turn: Player;
  mustContinueJump: boolean;
  selectedPiece: [number, number] | null;
}