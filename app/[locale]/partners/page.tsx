import Link from 'next/link';
import { auth } from '@/auth';
import { ThemeToggle } from '@/components/ThemeToggle';

/**
 * What: Home page for Amanoba unified game platform
 * Why: Landing page showcasing platform features, games, and gamification system
 */
export default async function HomePage() {
  // Get authentication session
  // Why: Show personalized content based on auth status
  const session = await auth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🎮</span>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                  Amanoba
                </h1>
                <p className="text-sm text-gray-600">Unified Game Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {session.user.name}
                  </span>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Play. Compete. Achieve.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience engaging games with comprehensive gamification. Unlock achievements, 
            climb leaderboards, and earn rewards as you play QUIZZZ, WHACKPOP, and premium Madoku Sudoku.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session?.user ? (
              <>
                <Link 
                  href="/games" 
                  className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-indigo-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg font-medium text-lg"
                >
                  🎮 Start Playing
                </Link>
                
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-lg"
                >
                  📊 My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-indigo-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg font-medium text-lg"
                >
                  🎮 Sign In to Play
                </Link>
                
                <Link 
                  href="#features" 
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-lg"
                >
                  Learn More ↓
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Games */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Three Game Types</h3>
            <p className="text-gray-600">
              QUIZZZ board quiz, WHACKPOP action game, and premium Madoku Sudoku 
              with AI opponents and ELO rankings.
            </p>
          </div>
          
          {/* Gamification */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">18 Achievements</h3>
            <p className="text-gray-600">
              Unlock achievements across milestone, streak, skill, and consistency categories. 
              Track your progress and earn rewards.
            </p>
          </div>
          
          {/* Progression */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">50 Levels & Titles</h3>
            <p className="text-gray-600">
              Progress through 50 levels with exponential XP curve. 
              Earn prestigious titles from Beginner to Legend.
            </p>
          </div>
          
          {/* Leaderboards */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Leaderboards</h3>
            <p className="text-gray-600">
              Compete globally or by brand. Track weekly, monthly, and all-time rankings 
              with comprehensive analytics.
            </p>
          </div>
          
          {/* Challenges */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Daily Challenges</h3>
            <p className="text-gray-600">
              Complete daily challenges across easy, medium, and hard difficulties. 
              New challenges every day with special rewards.
            </p>
          </div>
          
          {/* Quests */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Epic Quests</h3>
            <p className="text-gray-600">
              Embark on multi-step quests with unique rewards. 
              Progress through challenges and unlock exclusive content.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>System Online</span>
          </div>
          <p className="mt-4 text-gray-600">
            Version 1.0.0 • Last Updated: 2025-10-10T09:33:28.000Z
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🎮</span>
                <span className="text-xl font-bold">Amanoba</span>
              </div>
              <p className="text-gray-400">
                Unified game platform combining engaging gameplay with 
                comprehensive gamification and progression systems.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Multi-Game Platform</li>
                <li>Achievement System</li>
                <li>Leaderboards & Rankings</li>
                <li>Daily Challenges</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Technical</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Next.js 15.5.2</li>
                <li>MongoDB + Mongoose</li>
                <li>TypeScript 5</li>
                <li>PWA Ready</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p className="mb-2">
              <Link href="/terms" className="hover:text-white transition-colors mx-2">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors mx-2">Privacy</Link>
            </p>
            <p>&copy; 2025 Amanoba by Narimato. Built for engagement and fun.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
