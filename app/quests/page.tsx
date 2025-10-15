'use client';

/**
 * Quests Page
 * 
 * Why: Provide multi-step storyline challenges for extended engagement
 * What: Shows active and available quests with step-by-step progression
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Map, ChevronLeft, CheckCircle, Circle, Lock, Trophy, Sparkles } from 'lucide-react';

interface QuestStep {
  stepNumber: number;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
}

interface Quest {
  _id: string;
  name: string;
  description: string;
  storyline?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  steps: QuestStep[];
  totalSteps: number;
  currentStep: number;
  rewards: {
    points: number;
    xp: number;
    title?: string;
  };
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: string;
  isPremiumOnly: boolean;
}

const DIFFICULTY_COLORS = {
  easy: 'from-green-500 to-emerald-600',
  medium: 'from-blue-500 to-cyan-600',
  hard: 'from-purple-500 to-pink-600',
  expert: 'from-red-500 to-orange-600',
};

export default function QuestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const fetchQuests = async () => {
      try {
        const playerId = (session.user as any).playerId;
        setIsPremium((session.user as any).isPremium || false);
        
        // Note: This endpoint needs to be created
        const response = await fetch(`/api/quests?playerId=${playerId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load quests');
        }
        
        const data = await response.json();
        setQuests(data.quests || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, [session, status, router]);

  const getQuestProgress = (quest: Quest): number => {
    return Math.round((quest.currentStep / quest.totalSteps) * 100);
  };

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading quests...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Quests</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const activeQuests = quests.filter(q => q.isActive && !q.isCompleted);
  const availableQuests = quests.filter(q => !q.isActive && !q.isCompleted);
  const completedQuests = quests.filter(q => q.isCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Map className="w-10 h-10" />
                Quest Log
              </h1>
              <p className="text-white/80 mt-1">Epic multi-step adventures await</p>
            </div>
            <Link
              href="/dashboard"
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="text-purple-600 text-3xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-gray-900">
              {activeQuests.length}
            </div>
            <div className="text-gray-600">Active</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="text-blue-600 text-3xl mb-2">✨</div>
            <div className="text-3xl font-bold text-gray-900">
              {availableQuests.length}
            </div>
            <div className="text-gray-600">Available</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="text-green-600 text-3xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-gray-900">
              {completedQuests.length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
        </div>

        {/* Active Quests */}
        {activeQuests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-7 h-7" />
              Active Quests ({activeQuests.length})
            </h2>
            <div className="space-y-6">
              {activeQuests.map(quest => {
                const progress = getQuestProgress(quest);
                
                return (
                  <div
                    key={quest._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    {/* Quest Header */}
                    <div className={`bg-gradient-to-r ${DIFFICULTY_COLORS[quest.difficulty]} text-white p-6`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold">{quest.name}</h3>
                            {quest.isPremiumOnly && (
                              <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                                ⭐ PREMIUM
                              </span>
                            )}
                          </div>
                          <p className="text-white/90">{quest.description}</p>
                          {quest.storyline && (
                            <p className="text-white/70 text-sm mt-2 italic">{quest.storyline}</p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-3xl font-bold">{quest.currentStep}/{quest.totalSteps}</div>
                          <div className="text-white/80 text-sm">Steps</div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-white h-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Quest Steps */}
                    <div className="p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Quest Steps:</h4>
                      <div className="space-y-3">
                        {quest.steps.map((step, index) => (
                          <div
                            key={index}
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              step.isCompleted
                                ? 'bg-green-50 border border-green-200'
                                : index === quest.currentStep
                                ? 'bg-blue-50 border border-blue-200'
                                : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              {step.isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : index === quest.currentStep ? (
                                <Circle className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  Step {step.stepNumber}:
                                </span>
                                {index === quest.currentStep && !step.isCompleted && (
                                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                    CURRENT
                                  </span>
                                )}
                              </div>
                              <p className={`text-sm mt-1 ${
                                step.isCompleted ? 'text-green-700' : 'text-gray-600'
                              }`}>
                                {step.description}
                              </p>
                              {step.completedAt && (
                                <p className="text-xs text-gray-500 mt-1">
                                  ✓ Completed {new Date(step.completedAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Rewards */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-3">Quest Rewards:</h4>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-purple-600" />
                            <span className="font-bold text-purple-600">{quest.rewards.points} Points</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-indigo-600 text-xl">⚡</span>
                            <span className="font-bold text-indigo-600">{quest.rewards.xp} XP</span>
                          </div>
                          {quest.rewards.title && (
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-600 text-xl">👑</span>
                              <span className="font-bold text-yellow-600">Title: "{quest.rewards.title}"</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Link
                        href="/games"
                        className="mt-4 block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold text-center hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        Continue Quest
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Quests */}
        {availableQuests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Available Quests ({availableQuests.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableQuests.map(quest => {
                const isLocked = quest.isPremiumOnly && !isPremium;
                
                return (
                  <div
                    key={quest._id}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                      isLocked ? 'opacity-60' : ''
                    }`}
                  >
                    <div className={`bg-gradient-to-r ${DIFFICULTY_COLORS[quest.difficulty]} text-white p-6`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{quest.name}</h3>
                        {isLocked && <Lock className="w-5 h-5" />}
                      </div>
                      <p className="text-white/90 text-sm">{quest.description}</p>
                      <div className="mt-3 text-sm text-white/80">
                        {quest.totalSteps} steps • {quest.difficulty}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-purple-600" />
                          <span className="font-bold text-purple-600">{quest.rewards.points} pts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-indigo-600">⚡</span>
                          <span className="font-bold text-indigo-600">{quest.rewards.xp} XP</span>
                        </div>
                      </div>
                      
                      <button
                        disabled={isLocked}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${
                          isLocked
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-4 h-4 inline mr-2" />
                            Premium Only
                          </>
                        ) : (
                          'Start Quest'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Quests */}
        {completedQuests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-7 h-7" />
              Completed Quests ({completedQuests.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedQuests.map(quest => (
                <div
                  key={quest._id}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 border-green-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{quest.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{quest.description}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600 font-medium">✓ {quest.totalSteps} Steps Completed</span>
                  </div>
                  
                  {quest.completedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Completed {new Date(quest.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {quests.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Quests Available
            </h3>
            <p className="text-gray-600 mb-6">
              New quests are added regularly. Check back soon for epic adventures!
            </p>
            <Link
              href="/games"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Play Games
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
