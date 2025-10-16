/**
 * Madoku Game Engine
 * 
 * Purpose: Competitive number-picking strategy game where two players alternate picking numbers from a Sudoku board
 * Why: Port of the original Madoku game - a unique strategic game different from Sudoku puzzle-solving
 * 
 * Game Rules:
 * 1. Start with a filled Sudoku board (valid solution)
 * 2. Players alternate turns picking numbers
 * 3. First player picks from a specific row (starting at row 4)
 * 4. The picked number is removed and added to player's score
 * 5. Next player must pick from the column (or row) corresponding to the picked cell
 * 6. Game continues until no valid moves remain
 * 7. Highest score wins
 */

import { generateSolution, type SudokuGrid } from './sudoku-engine';

export type MadokuBoard = SudokuGrid; // 9x9 grid with numbers 1-9 or null
export type PickMode = 'row' | 'col';
export type CellPosition = { row: number; col: number };

/**
 * Ghost Mode Transformation
 * 
 * What: Randomly flips the sign of non-null cells so values become a mix of positive/negative.
 * Why: Increases difficulty without changing move legality (mirrors original Madoku "Ghost" behavior).
 */
export function applyGhost(board: MadokuBoard): MadokuBoard {
  // Functional: produce a new board; do not mutate input
  return board.map(row => row.map(cell => {
    if (cell == null) return null;
    const sign = Math.random() < 0.5 ? -1 : 1; // Strategic: 50/50 sign flip per cell for unpredictable pattern
    return cell * sign;
  })) as MadokuBoard;
}

export interface MadokuMove {
  player: number;
  row: number;
  col: number;
  value: number;
  turn: number;
}

export interface MadokuGameState {
  board: MadokuBoard;
  currentPlayer: number; // 0 = player 1, 1 = player 2
  p1Score: number;
  p2Score: number;
  allowedRowOrCol: number | null;
  picking: PickMode | null;
  totalTurns: number;
  gameEnded: boolean;
  winner: number | null; // 0 = player 1, 1 = player 2, null = tie
  moveHistory: MadokuMove[];
}

/**
 * Create initial game state
 * 
 * @returns New game state with filled Sudoku board
 */
export function createInitialState(): MadokuGameState {
  const board = generateSolution();
  
  return {
    board,
    currentPlayer: 0,
    p1Score: 0,
    p2Score: 0,
    allowedRowOrCol: 4, // Start with middle row
    picking: 'row',
    totalTurns: 1,
    gameEnded: false,
    winner: null,
    moveHistory: [],
  };
}

/**
 * Get available moves for current turn
 * 
 * @param board - Current game board
 * @param allowedRowOrCol - Which row or column can be picked from
 * @param picking - Whether picking from row or column
 * @returns Array of available cell positions
 */
export function getAvailableMoves(
  board: MadokuBoard,
  allowedRowOrCol: number,
  picking: PickMode
): CellPosition[] {
  const moves: CellPosition[] = [];
  
  for (let i = 0; i < 9; i++) {
    const [r, c] = picking === 'row' ? [allowedRowOrCol, i] : [i, allowedRowOrCol];
    if (board[r][c] !== null) {
      moves.push({ row: r, col: c });
    }
  }
  
  return moves;
}

/**
 * Check if a move is valid
 * 
 * @param state - Current game state
 * @param row - Row of cell to pick
 * @param col - Column of cell to pick
 * @returns Whether the move is valid
 */
export function isValidMove(state: MadokuGameState, row: number, col: number): boolean {
  if (state.gameEnded) return false;
  if (state.allowedRowOrCol === null || state.picking === null) return false;
  if (state.board[row][col] === null) return false;
  
  const isCorrectRowOrCol = state.picking === 'row'
    ? row === state.allowedRowOrCol
    : col === state.allowedRowOrCol;
  
  return isCorrectRowOrCol;
}

/**
 * Execute a move and return new game state
 * 
 * @param state - Current game state
 * @param row - Row of cell to pick
 * @param col - Column of cell to pick
 * @returns New game state after move
 */
export function executeMove(state: MadokuGameState, row: number, col: number): MadokuGameState {
  if (!isValidMove(state, row, col)) {
    throw new Error('Invalid move');
  }
  
  const value = state.board[row][col]!;
  
  // Clone board and remove picked cell
  const newBoard = state.board.map(r => [...r]);
  newBoard[row][col] = null;
  
  // Update scores
  const newP1Score = state.currentPlayer === 0 ? state.p1Score + value : state.p1Score;
  const newP2Score = state.currentPlayer === 1 ? state.p2Score + value : state.p2Score;
  
  // Calculate next player's constraints
  let nextRowOrCol: number;
  let nextPicking: PickMode;
  
  if (state.picking === 'row') {
    nextRowOrCol = col;
    nextPicking = 'col';
  } else {
    nextRowOrCol = row;
    nextPicking = 'row';
  }
  
  // Check if next player has any valid moves
  const nextMoves = getAvailableMoves(newBoard, nextRowOrCol, nextPicking);
  const gameEnded = nextMoves.length === 0;
  
  // Determine winner
  let winner: number | null = null;
  if (gameEnded) {
    if (newP1Score > newP2Score) {
      winner = 0;
    } else if (newP2Score > newP1Score) {
      winner = 1;
    }
    // else stays null for tie
  }
  
  // Add move to history
  const newMoveHistory = [
    ...state.moveHistory,
    {
      player: state.currentPlayer,
      row,
      col,
      value,
      turn: state.totalTurns,
    },
  ];
  
  return {
    board: newBoard,
    currentPlayer: gameEnded ? state.currentPlayer : 1 - state.currentPlayer,
    p1Score: newP1Score,
    p2Score: newP2Score,
    allowedRowOrCol: nextRowOrCol,
    picking: nextPicking,
    totalTurns: state.totalTurns + 1,
    gameEnded,
    winner,
    moveHistory: newMoveHistory,
  };
}

/**
 * Clone game state (deep copy)
 * 
 * @param state - Game state to clone
 * @returns Cloned game state
 */
export function cloneGameState(state: MadokuGameState): MadokuGameState {
  return {
    ...state,
    board: state.board.map(r => [...r]),
    moveHistory: [...state.moveHistory],
  };
}

/**
 * Get game result message
 * 
 * @param state - Game state
 * @returns Result message
 */
export function getGameResult(state: MadokuGameState): string {
  if (!state.gameEnded) return 'Game in progress';
  
  if (state.winner === null) {
    return `It's a tie! Final Score: ${state.p1Score} - ${state.p2Score}`;
  }
  
  const winnerName = state.winner === 0 ? 'Player 1' : 'Player 2';
  const winnerScore = state.winner === 0 ? state.p1Score : state.p2Score;
  const loserScore = state.winner === 0 ? state.p2Score : state.p1Score;
  
  return `${winnerName} wins! Final Score: ${winnerScore} - ${loserScore}`;
}
