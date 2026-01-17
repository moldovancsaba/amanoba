/**
 * Email Settings Page
 * 
 * What: Manage email preferences for lesson delivery
 * Why: Allows students to control when and how they receive lesson emails
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import { Save, Mail, Clock, Globe, CheckCircle } from 'lucide-react';

interface EmailPreferences {
  receiveLessonEmails: boolean;
  emailFrequency: 'daily' | 'weekly' | 'never';
  preferredEmailTime?: number;
  timezone?: string;
}

export default function EmailSettingsPage() {
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('settings');
  const [preferences, setPreferences] = useState<EmailPreferences>({
    receiveLessonEmails: true,
    emailFrequency: 'daily',
    preferredEmailTime: 8,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch('/api/profile');
        const data = await response.json();

        if (data.success && data.player?.emailPreferences) {
          setPreferences({
            receiveLessonEmails: data.player.emailPreferences.receiveLessonEmails ?? true,
            emailFrequency: data.player.emailPreferences.emailFrequency || 'daily',
            preferredEmailTime: data.player.emailPreferences.preferredEmailTime ?? 8,
            timezone: data.player.emailPreferences.timezone || data.player.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        }
      } catch (error) {
        console.error('Failed to load email preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [session]);

  const handleSave = async () => {
    if (!session?.user) return;

    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailPreferences: preferences,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-brand-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <LocaleLink
              href="/dashboard"
              className="inline-flex items-center gap-2 text-brand-white hover:text-brand-accent"
            >
              ← Back to Dashboard
            </LocaleLink>
            <h1 className="text-2xl font-bold text-brand-white">Email Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent">
          {/* Receive Lesson Emails Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-brand-accent" />
                <div>
                  <h2 className="text-xl font-bold text-brand-black">Receive Lesson Emails</h2>
                  <p className="text-sm text-brand-darkGrey">
                    Get daily lesson emails delivered to your inbox
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.receiveLessonEmails}
                  onChange={(e) =>
                    setPreferences({ ...preferences, receiveLessonEmails: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-brand-darkGrey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
              </label>
            </div>
          </div>

          {preferences.receiveLessonEmails && (
            <>
              {/* Email Frequency */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Email Frequency
                </label>
                <select
                  value={preferences.emailFrequency}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      emailFrequency: e.target.value as 'daily' | 'weekly' | 'never',
                    })
                  }
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly Summary</option>
                  <option value="never">Never</option>
                </select>
                <p className="text-xs text-brand-darkGrey mt-1">
                  How often you want to receive lesson emails
                </p>
              </div>

              {/* Preferred Email Time */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-brand-accent" />
                  <label className="block text-sm font-medium text-brand-black">
                    Preferred Email Time
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={preferences.preferredEmailTime}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      preferredEmailTime: parseInt(e.target.value) || 8,
                    })
                  }
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                />
                <p className="text-xs text-brand-darkGrey mt-1">
                  Hour of day (0-23) when you prefer to receive emails (in your timezone)
                </p>
              </div>

              {/* Timezone */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-brand-accent" />
                  <label className="block text-sm font-medium text-brand-black">Timezone</label>
                </div>
                <select
                  value={preferences.timezone}
                  onChange={(e) =>
                    setPreferences({ ...preferences, timezone: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                >
                  {Intl.supportedValuesOf('timeZone').map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-brand-darkGrey mt-1">
                  Your timezone for email delivery scheduling
                </p>
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-brand-darkGrey/20">
            {saved && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Saved!</span>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>

          {/* Unsubscribe Link */}
          <div className="mt-6 pt-6 border-t border-brand-darkGrey/20">
            <p className="text-sm text-brand-darkGrey mb-2">
              Don't want to receive emails anymore?
            </p>
            <LocaleLink
              href="/api/email/unsubscribe"
              className="text-brand-accent hover:underline text-sm font-medium"
            >
              Unsubscribe from all lesson emails
            </LocaleLink>
          </div>
        </div>
      </main>
    </div>
  );
}
