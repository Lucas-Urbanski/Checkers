import "@/styles/square.css";
import "@/styles/piece.css";

export type PieceValue = "dark" | "light" | null;
export type BoardState = PieceValue[][];

export type BoardTheme = {
  myPieceColor: string;
  opponentPieceColor: string;
  lightTileColor: string;
  darkTileColor: string;
};

const DEFAULT_THEME: BoardTheme = {
  myPieceColor: "#f7e7ce",
  opponentPieceColor: "#4a2e1b",
  lightTileColor: "#f0d9b5",
  darkTileColor: "#b58863",
};

function renderPiece(
  pieceType: PieceValue,
  row: number,
  col: number,
  onSquareClick: (row: number, col: number) => void,
  theme: BoardTheme,
) {
  if (pieceType === "dark") {
    return (
      <button
        type="button"
        className="darkPiece"
        style={{ backgroundColor: theme.opponentPieceColor }}
        onClick={(event) => {
          event.stopPropagation();
          onSquareClick(row, col);
        }}
      />
    );
  }

  if (pieceType === "light") {
    return (
      <button
        type="button"
        className="lightPiece"
        style={{ backgroundColor: theme.myPieceColor }}
        onClick={(event) => {
          event.stopPropagation();
          onSquareClick(row, col);
        }}
      />
    );
  }

  return null;
}

function renderSquares(
  board: BoardState,
  selected: [number, number] | null,
  validMoves: [number, number][],
  onSquareClick: (row: number, col: number) => void,
  theme: BoardTheme,
) {
  const squares = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const key = `${row}-${col}`;
      const isDarkSquare = (row + col) % 2 !== 0;

      if (isDarkSquare) {
        const isSelected = selected?.[0] === row && selected?.[1] === col;
        const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

        squares.push(
          <div
            key={key}
            className={`darkSquare${isSelected ? " selected" : ""}`}
            style={{ background: theme.darkTileColor }}
            onClick={() => onSquareClick(row, col)}
          >
            {isValidMove && <div className="moveDot" />}
            {renderPiece(board[row][col], row, col, onSquareClick, theme)}
          </div>,
        );
      } else {
        squares.push(
          <div
            key={key}
            className="lightSquare"
            style={{ background: theme.lightTileColor }}
          />,
        );
      }
    }
  }

  return squares;
}

export default function Board({
  board,
  selected,
  validMoves,
  onSquareClick,
  theme = DEFAULT_THEME,
  sizeClassName = "w-[480px] h-[480px]",
}: {
  board: BoardState;
  selected: [number, number] | null;
  validMoves: [number, number][];
  onSquareClick: (row: number, col: number) => void;
  theme?: BoardTheme;
  sizeClassName?: string;
}) {
  return (
    <div
      className={`grid grid-cols-8 grid-rows-8 border-2 border-neutral-600 ${sizeClassName}`}
    >
      {renderSquares(board, selected, validMoves, onSquareClick, theme)}
    </div>
  );
}