'use client';

/**
 * Madoku Game Page
 * 
 * Why: Premium Sudoku game with advanced features (placeholder for MVP)
 * What: Coming soon page for premium Sudoku integration
 */

import { useRouter } from 'next/navigation';

export default function MadokuGame() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🔢</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Madoku</h1>
          <p className="text-xl text-gray-600 mb-8">
            Premium Sudoku Experience
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Coming Soon!</h3>
            <p className="text-gray-700 mb-4">
              Madoku is our premium Sudoku game featuring:
            </p>
            <ul className="text-left text-gray-700 space-y-2 max-w-md mx-auto">
              <li>• Classic 9x9 Sudoku puzzles</li>
              <li>• Multiple difficulty levels</li>
              <li>• Daily challenges</li>
              <li>• Progress tracking</li>
              <li>• Hint system</li>
              <li>• Time trials</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-yellow-800">
              <span className="text-2xl">⭐</span>
              <span className="font-bold">Premium Feature</span>
            </div>
            <p className="text-yellow-700 text-sm mt-2">
              This game requires a premium subscription to play
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/games')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Back to Games
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              View Dashboard
            </button>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            Full Sudoku implementation coming in Phase 5
          </p>
        </div>
      </div>
    </div>
  );
}
