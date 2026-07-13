export type CheckerSettings = {
  playerName: string;
  theme: string;
  myPieceColor: string;
  opponentPieceColor: string;
  lightTileColor: string;
  darkTileColor: string;
  backgroundColor: string;
};

export const DEFAULT_SETTINGS: CheckerSettings = {
  playerName: "",
  theme: "",
  myPieceColor: "#f7e7ce",
  opponentPieceColor: "#4a2e1b",
  lightTileColor: "#f0d9b5",
  darkTileColor: "#b58863",
  backgroundColor: "#4c2424",
};