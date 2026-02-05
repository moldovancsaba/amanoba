/**
 * Madoku AI - Computer Player Logic
 * 
 * Purpose: AI opponent for Madoku game using minimax algorithm
 * Why: Provides challenging computer opponents at different skill levels
 * 
 * Strategy:
 * - Level 1 (Easy): Looks 1 move ahead, greedy selection
 * - Level 2 (Medium): Looks 2 moves ahead with basic minimax
 * - Level 3 (Hard): Looks 3+ moves ahead with full minimax
 */

import {
  type MadokuBoard,
  type PickMode,
  type CellPosition,
  getAvailableMoves,
} from './madoku-engine';
import { GAME_AI_PERSONAS } from '@/app/lib/constants/color-tokens';

/**
 * Find best move using minimax algorithm
 * 
 * @param board - Current game board
 * @param allowedRowOrCol - Which row/column can be picked from
 * @param picking - Whether picking from row or column
 * @param aiScore - Current AI score
 * @param playerScore - Current player score
 * @param aiLevel - Difficulty level (1=easy, 2=medium, 3=hard)
 * @returns Best move for AI
 */
export function findBestMove(
  board: MadokuBoard,
  allowedRowOrCol: number,
  picking: PickMode,
  aiScore: number,
  playerScore: number,
  aiLevel: number
): CellPosition {
  const moves = getAvailableMoves(board, allowedRowOrCol, picking);
  
  if (moves.length === 0) {
    throw new Error('No available moves');
  }
  
  if (moves.length === 1) {
    return moves[0];
  }
  
  // Level 1: Greedy - just pick highest value
  if (aiLevel <= 1) {
    let bestMove = moves[0];
    let highestValue = board[moves[0].row][moves[0].col]!;
    
    for (const move of moves) {
      const value = board[move.row][move.col]!;
      if (value > highestValue) {
        highestValue = value;
        bestMove = move;
      }
    }
    
    return bestMove;
  }
  
  // Level 2+: Minimax with lookahead
  const depth = aiLevel >= 3 ? 3 : 2;
  let bestDiff = -Infinity;
  let bestMove = moves[0];
  
  for (const move of moves) {
    const value = board[move.row][move.col]!;
    const newBoard = board.map((r: (number | null)[]) => [...r]);
    newBoard[move.row][move.col] = null;
    
    const nextRowOrCol = picking === 'row' ? move.col : move.row;
    const nextPicking: PickMode = picking === 'row' ? 'col' : 'row';
    
    const replyMoves = getAvailableMoves(newBoard, nextRowOrCol, nextPicking);
    
    if (replyMoves.length === 0) {
      // Game ends after this move
      const diff = (aiScore + value) - playerScore;
      if (diff > bestDiff) {
        bestDiff = diff;
        bestMove = move;
      }
      continue;
    }
    
    // Simulate player's best reply (minimizing AI advantage)
    const minDiff = minimaxPlayer(
      newBoard,
      nextRowOrCol,
      nextPicking,
      aiScore + value,
      playerScore,
      depth - 1
    );
    
    if (minDiff > bestDiff) {
      bestDiff = minDiff;
      bestMove = move;
    }
  }
  
  return bestMove;
}

/**
 * Minimax for player's turn (minimizing AI advantage)
 */
function minimaxPlayer(
  board: MadokuBoard,
  allowedRowOrCol: number,
  picking: PickMode,
  aiScore: number,
  playerScore: number,
  depth: number
): number {
  const moves = getAvailableMoves(board, allowedRowOrCol, picking);
  
  if (moves.length === 0 || depth <= 0) {
    return aiScore - playerScore;
  }
  
  let minDiff = Infinity;
  
  for (const move of moves) {
    const value = board[move.row][move.col]!;
    const newBoard = board.map((r: (number | null)[]) => [...r]);
    newBoard[move.row][move.col] = null;
    
    const nextRowOrCol = picking === 'row' ? move.col : move.row;
    const nextPicking: PickMode = picking === 'row' ? 'col' : 'row';
    
    const aiMoves = getAvailableMoves(newBoard, nextRowOrCol, nextPicking);
    
    if (aiMoves.length === 0) {
      const diff = aiScore - (playerScore + value);
      if (diff < minDiff) {
        minDiff = diff;
      }
      continue;
    }
    
    if (depth > 1) {
      const maxDiff = minimaxAI(
        newBoard,
        nextRowOrCol,
        nextPicking,
        aiScore,
        playerScore + value,
        depth - 1
      );
      
      if (maxDiff < minDiff) {
        minDiff = maxDiff;
      }
    } else {
      const diff = aiScore - (playerScore + value);
      if (diff < minDiff) {
        minDiff = diff;
      }
    }
  }
  
  return minDiff;
}

/**
 * Minimax for AI's turn (maximizing AI advantage)
 */
function minimaxAI(
  board: MadokuBoard,
  allowedRowOrCol: number,
  picking: PickMode,
  aiScore: number,
  playerScore: number,
  depth: number
): number {
  const moves = getAvailableMoves(board, allowedRowOrCol, picking);
  
  if (moves.length === 0 || depth <= 0) {
    return aiScore - playerScore;
  }
  
  let maxDiff = -Infinity;
  
  for (const move of moves) {
    const value = board[move.row][move.col]!;
    const newBoard = board.map((r: (number | null)[]) => [...r]);
    newBoard[move.row][move.col] = null;
    
    const nextRowOrCol = picking === 'row' ? move.col : move.row;
    const nextPicking: PickMode = picking === 'row' ? 'col' : 'row';
    
    const replyMoves = getAvailableMoves(newBoard, nextRowOrCol, nextPicking);
    
    if (replyMoves.length === 0) {
      const diff = (aiScore + value) - playerScore;
      if (diff > maxDiff) {
        maxDiff = diff;
      }
      continue;
    }
    
    // Just evaluate immediate result for efficiency
    const diff = (aiScore + value) - playerScore;
    if (diff > maxDiff) {
      maxDiff = diff;
    }
  }
  
  return maxDiff;
}

/**
 * Get random AI persona based on level
 */
export function getRandomAIPersona(level: number): { name: string; emoji: string; color: string } {
  const pool = GAME_AI_PERSONAS[level as keyof typeof GAME_AI_PERSONAS] || GAME_AI_PERSONAS[2];
  return pool[Math.floor(Math.random() * pool.length)];
}
