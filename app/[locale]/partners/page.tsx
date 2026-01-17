import Link from 'next/link';
import { auth } from '@/auth';
import { ThemeToggle } from '@/components/ThemeToggle';

/**
 * What: Home page for Amanoba unified game platform
 * Why: Landing page showcasing platform features, games, and gamification system
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Get authentication session
  // Why: Show personalized content based on auth status
  const session = await auth();
  return (
    <div className="page-shell">
      {/* Header */}
      <header className="page-header">
        <div className="page-container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🎮</span>
              <div>
                <h1 className="text-2xl font-bold text-brand-white">
                  Amanoba
                </h1>
                <p className="text-sm text-brand-white/70">Unified Game Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {session?.user ? (
                <>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="page-button-primary"
                  >
                    Dashboard
                  </Link>
                  <span className="text-sm text-brand-white/70">
                    {session.user.name}
                  </span>
                </>
              ) : (
                <Link
                  href={`/${locale}/auth/signin`}
                  className="page-button-primary"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-white mb-4">
            Play. Compete. Achieve.
          </h2>
          <p className="text-xl text-brand-white/70 max-w-3xl mx-auto mb-8">
            Experience engaging games with comprehensive gamification. Unlock achievements, 
            climb leaderboards, and earn rewards as you play QUIZZZ, WHACKPOP, and premium Madoku Sudoku.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session?.user ? (
              <>
                <Link 
                  href={`/${locale}/games`} 
                  className="page-button-primary px-8 py-4 text-lg"
                >
                  🎮 Start Playing
                </Link>
                
                <Link 
                  href={`/${locale}/dashboard`} 
                  className="page-button-secondary px-8 py-4 text-lg"
                >
                  📊 My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href={`/${locale}/auth/signin`} 
                  className="page-button-primary px-8 py-4 text-lg"
                >
                  🎮 Sign In to Play
                </Link>
                
                <Link 
                  href={`/${locale}/partners#features`} 
                  className="page-button-secondary px-8 py-4 text-lg"
                >
                  Learn More ↓
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Games */}
          <div className="page-card p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-brand-black mb-3">Three Game Types</h3>
            <p className="text-brand-darkGrey">
              QUIZZZ board quiz, WHACKPOP action game, and premium Madoku Sudoku 
              with AI opponents and ELO rankings.
            </p>
          </div>
          
          {/* Gamification */}
          <div className="page-card p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-brand-black mb-3">18 Achievements</h3>
            <p className="text-brand-darkGrey">
              Unlock achievements across milestone, streak, skill, and consistency categories. 
              Track your progress and earn rewards.
            </p>
          </div>
          
          {/* Progression */}
          <div className="page-card p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-brand-black mb-3">50 Levels & Titles</h3>
            <p className="text-brand-darkGrey">
              Progress through 50 levels with exponential XP curve. 
              Earn prestigious titles from Beginner to Legend.
            </p>
          </div>
          
          {/* Leaderboards */}
          <div className="page-card p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-brand-black mb-3">Leaderboards</h3>
            <p className="text-brand-darkGrey">
              Compete globally or by brand. Track weekly, monthly, and all-time rankings 
              with comprehensive analytics.
            </p>
          </div>
          
          {/* Challenges */}
          <div className="page-card p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-brand-black mb-3">Daily Challenges</h3>
            <p className="text-brand-darkGrey">
              Complete daily challenges across easy, medium, and hard difficulties. 
              New challenges every day with special rewards.
            </p>
          </div>
          
          {/* Quests */}
          <div className="page-card p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-brand-black mb-3">Epic Quests</h3>
            <p className="text-brand-darkGrey">
              Embark on multi-step quests with unique rewards. 
              Progress through challenges and unlock exclusive content.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="page-card p-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-accent/20 text-brand-black rounded-full font-medium">
            <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
            <span>System Online</span>
          </div>
          <p className="mt-4 text-brand-darkGrey">
            Version 1.0.0 • Last Updated: 2025-10-10T09:33:28.000Z
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-darkGrey text-brand-white mt-16">
        <div className="page-container py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🎮</span>
                <span className="text-xl font-bold">Amanoba</span>
              </div>
              <p className="text-brand-white/70">
                Unified game platform combining engaging gameplay with 
                comprehensive gamification and progression systems.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-brand-white/70">
                <li>Multi-Game Platform</li>
                <li>Achievement System</li>
                <li>Leaderboards & Rankings</li>
                <li>Daily Challenges</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Technical</h4>
              <ul className="space-y-2 text-brand-white/70">
                <li>Next.js 15.5.2</li>
                <li>MongoDB + Mongoose</li>
                <li>TypeScript 5</li>
                <li>PWA Ready</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-brand-black text-center text-brand-white/70">
            <p className="mb-2">
              <Link href={`/${locale}/terms`} className="hover:text-white transition-colors mx-2">Terms</Link>
              <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors mx-2">Privacy</Link>
            </p>
            <p>&copy; 2025 Amanoba by Narimato. Built for engagement and fun.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
