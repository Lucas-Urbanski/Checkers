export type CheckerSettings = {
  playerName: string;
  myPieceColor: string;
  opponentPieceColor: string;
  playerSide: "light" | "dark";
  backgroundColor: string;
};

export const DEFAULT_SETTINGS: CheckerSettings = {
  playerName: "",
  myPieceColor: "#f7e7ce",
  opponentPieceColor: "#4a2e1b",
  playerSide: "light",
  backgroundColor: "#4c2424",
};