export type PieceValue = "dark" | "light" | "darkKing" | "lightKing" | null;
export type BoardState = PieceValue[][];
export interface MoveResult {
  board: BoardState;
  turn: "light" | "dark";
}
