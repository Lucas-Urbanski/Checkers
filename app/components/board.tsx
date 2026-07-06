import "@/styles/square.css";
import "@/styles/piece.css";

export type PieceValue = "dark" | "light" | null;
export type BoardState = PieceValue[][];

function renderPiece(
  pieceType: PieceValue,
  row: number,
  col: number,
  onSquareClick: (row: number, col: number) => void,
) {
  if (pieceType === "dark")
    return (
      <button
        className="darkPiece"
        onClick={(e) => {
          e.stopPropagation();
          onSquareClick(row, col);
        }}
      />
    );
  if (pieceType === "light")
    return (
      <button
        className="lightPiece"
        onClick={(e) => {
          e.stopPropagation();
          onSquareClick(row, col);
        }}
      />
    );
  return null;
}

function renderSquares(
  board: BoardState,
  selected: [number, number] | null,
  validMoves: [number, number][],
  onSquareClick: (row: number, col: number) => void,
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
            onClick={() => onSquareClick(row, col)}
          >
            {isValidMove && <div className="moveDot" />}
            {renderPiece(board[row][col], row, col, onSquareClick)}
          </div>,
        );
      } else {
        squares.push(<div key={key} className="lightSquare" />);
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
}: {
  board: BoardState;
  selected: [number, number] | null;
  validMoves: [number, number][];
  onSquareClick: (row: number, col: number) => void;
}) {
  return (
    <div className="grid grid-cols-8 grid-rows-8 w-[480px] h-[480px] border-2 border-neutral-600">
      {renderSquares(board, selected, validMoves, onSquareClick)}
    </div>
  );
}
