/**
 * Sudoku Engine
 * Complete Sudoku puzzle generation, solving, validation, and hint system
 * Version: 2.1.0
 */

/**
 * Why: Type definitions for Sudoku game state and operations
 * What: Strongly typed interfaces for all Sudoku operations
 */
export type SudokuCell = number | null;
export type SudokuGrid = SudokuCell[][];
export type SudokuDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface SudokuPuzzle {
  puzzle: SudokuGrid;
  solution: SudokuGrid;
  difficulty: SudokuDifficulty;
  cellsToRemove: number;
}

export interface SudokuValidation {
  isValid: boolean;
  errors: { row: number; col: number; message: string }[];
}

export interface SudokuHint {
  row: number;
  col: number;
  value: number;
  reasoning?: string;
}

/**
 * Why: Difficulty settings determine puzzle complexity
 * What: Number of cells to remove for each difficulty level
 */
const DIFFICULTY_SETTINGS: Record<SudokuDifficulty, { cellsToRemove: number; minGiven: number }> = {
  easy: { cellsToRemove: 35, minGiven: 46 },      // ~38% empty
  medium: { cellsToRemove: 45, minGiven: 36 },    // ~55% empty
  hard: { cellsToRemove: 52, minGiven: 29 },      // ~64% empty
  expert: { cellsToRemove: 58, minGiven: 23 },    // ~71% empty
};

/**
 * Why: Create an empty 9x9 Sudoku grid
 * What: Returns a grid filled with null values
 */
export function createEmptyGrid(): SudokuGrid {
  return Array(9).fill(null).map(() => Array(9).fill(null));
}

/**
 * Why: Clone a grid to avoid mutation
 * What: Deep copy of the Sudoku grid
 */
export function cloneGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map(row => [...row]);
}

/**
 * Why: Check if a number can be placed in a specific position
 * What: Validates against row, column, and 3x3 box rules
 */
export function isValidPlacement(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }
  
  return true;
}

/**
 * Why: Generate a valid, complete Sudoku solution
 * What: Uses backtracking algorithm to fill the grid
 */
export function generateSolution(): SudokuGrid {
  const grid = createEmptyGrid();
  fillGrid(grid);
  return grid;
}

/**
 * Why: Recursively fill the grid with valid numbers
 * What: Backtracking algorithm with randomization for variety
 */
function fillGrid(grid: SudokuGrid): boolean {
  // Find empty cell
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        // Try numbers in random order for variety
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        for (const num of numbers) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;
            
            if (fillGrid(grid)) {
              return true;
            }
            
            // Backtrack
            grid[row][col] = null;
          }
        }
        
        return false;
      }
    }
  }
  
  return true; // Grid is complete
}

/**
 * Why: Shuffle array for randomness in puzzle generation
 * What: Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Why: Create a puzzle by removing cells from a complete solution
 * What: Ensures unique solution by validating after each removal
 */
export function generatePuzzle(difficulty: SudokuDifficulty): SudokuPuzzle {
  const solution = generateSolution();
  const puzzle = cloneGrid(solution);
  const settings = DIFFICULTY_SETTINGS[difficulty];
  
  // Get all cell positions
  const positions: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }
  
  // Shuffle positions for random removal
  const shuffledPositions = shuffleArray(positions);
  let removed = 0;
  
  // Remove cells while maintaining unique solution
  for (const [row, col] of shuffledPositions) {
    if (removed >= settings.cellsToRemove) break;
    
    const backup = puzzle[row][col];
    puzzle[row][col] = null;
    
    // Check if puzzle still has unique solution
    const testGrid = cloneGrid(puzzle);
    const solutionCount = countSolutions(testGrid, 2); // Stop after finding 2 solutions
    
    if (solutionCount === 1) {
      removed++;
    } else {
      // Restore cell if removal creates multiple solutions
      puzzle[row][col] = backup;
    }
  }
  
  return {
    puzzle,
    solution,
    difficulty,
    cellsToRemove: removed,
  };
}

/**
 * Why: Count number of solutions to ensure uniqueness
 * What: Modified backtracking that stops after finding max solutions
 */
function countSolutions(grid: SudokuGrid, maxCount: number): number {
  let count = 0;
  
  function solve(): boolean {
    if (count >= maxCount) return true;
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              
              if (solve()) return true;
              
              grid[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    
    count++;
    return false;
  }
  
  solve();
  return count;
}

/**
 * Why: Solve a Sudoku puzzle using backtracking
 * What: Returns solved grid or null if unsolvable
 */
export function solvePuzzle(grid: SudokuGrid): SudokuGrid | null {
  const workingGrid = cloneGrid(grid);
  
  if (solveRecursive(workingGrid)) {
    return workingGrid;
  }
  
  return null;
}

/**
 * Why: Recursive solver for Sudoku puzzles
 * What: Backtracking algorithm that tries all possibilities
 */
function solveRecursive(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;
            
            if (solveRecursive(grid)) {
              return true;
            }
            
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Why: Validate current puzzle state and identify errors
 * What: Checks all Sudoku rules and returns detailed error information
 */
export function validatePuzzle(grid: SudokuGrid): SudokuValidation {
  const errors: { row: number; col: number; message: string }[] = [];
  
  // Check each filled cell
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = grid[row][col];
      if (value === null) continue;
      
      // Temporarily remove cell to check if placement is valid
      grid[row][col] = null;
      const isValid = isValidPlacement(grid, row, col, value);
      grid[row][col] = value;
      
      if (!isValid) {
        errors.push({
          row,
          col,
          message: `Invalid placement: ${value}`,
        });
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Why: Provide intelligent hints to help players
 * What: Finds the easiest cell to fill based on candidate elimination
 */
export function getHint(puzzle: SudokuGrid, solution: SudokuGrid): SudokuHint | null {
  interface CellCandidate {
    row: number;
    col: number;
    value: number;
    candidateCount: number;
  }
  
  const candidates: CellCandidate[] = [];
  
  // Find all empty cells and count their valid candidates
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] === null) {
        const validNumbers: number[] = [];
        
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(puzzle, row, col, num)) {
            validNumbers.push(num);
          }
        }
        
        if (validNumbers.length > 0) {
          candidates.push({
            row,
            col,
            value: solution[row][col] as number,
            candidateCount: validNumbers.length,
          });
        }
      }
    }
  }
  
  if (candidates.length === 0) return null;
  
  // Sort by candidate count (cells with fewer options are easier)
  candidates.sort((a, b) => a.candidateCount - b.candidateCount);
  
  const hint = candidates[0];
  
  return {
    row: hint.row,
    col: hint.col,
    value: hint.value,
    reasoning: hint.candidateCount === 1 
      ? 'Only one possible value for this cell'
      : `One of ${hint.candidateCount} possible values`,
  };
}

/**
 * Why: Check if puzzle is completely and correctly solved
 * What: Validates all cells are filled and follow Sudoku rules
 */
export function isPuzzleComplete(grid: SudokuGrid): boolean {
  // Check if all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) return false;
    }
  }
  
  // Validate the complete puzzle
  const validation = validatePuzzle(grid);
  return validation.isValid;
}

/**
 * Why: Get possible candidates for a specific cell
 * What: Returns array of valid numbers that can be placed
 */
export function getCandidates(grid: SudokuGrid, row: number, col: number): number[] {
  if (grid[row][col] !== null) return [];
  
  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      candidates.push(num);
    }
  }
  
  return candidates;
}

/**
 * Why: Calculate puzzle completion percentage
 * What: Returns percentage of filled cells
 */
export function getCompletionPercentage(grid: SudokuGrid): number {
  let filled = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== null) filled++;
    }
  }
  return Math.round((filled / 81) * 100);
}

/**
 * Why: Get difficulty score for a puzzle
 * What: Calculates score based on given cells and solving techniques required
 */
export function getDifficultyScore(puzzle: SudokuGrid): number {
  let givenCells = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] !== null) givenCells++;
    }
  }
  
  // Base score on number of given cells (more given = easier)
  const baseScore = 81 - givenCells;
  
  // Additional scoring could be based on solving techniques required
  // For now, use simple calculation
  return baseScore;
}
