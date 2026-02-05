/**
 * Create New Course Page
 * 
 * What: Form to create a new 30-day course
 * Why: Allows admins to create courses with basic metadata
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { getStripeMinimum, getFormattedMinimum, meetsStripeMinimum } from '@/app/lib/utils/stripe-minimums';
import { COURSE_LANGUAGE_OPTIONS } from '@/app/lib/constants/course-languages';

export default function NewCoursePage() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    name: '',
    description: '',
    language: 'hu',
    ccsId: '',
    thumbnail: '',
    requiresPremium: false,
    priceAmount: 2999,
    priceCurrency: 'usd',
    completionPoints: 1000,
    lessonPoints: 50,
    perfectCourseBonus: 500,
    completionXP: 500,
    lessonXP: 25,
  });

  useEffect(() => {
    const ccsId = searchParams.get('ccsId');
    const language = searchParams.get('language');
    if (!ccsId && !language) return;
    setFormData((prev) => ({
      ...prev,
      ccsId: ccsId ? ccsId.trim().toUpperCase().replace(/\s+/g, '_') : prev.ccsId,
      language: language ? language.trim() : prev.language,
    }));
  }, [searchParams]);

  const suggestedCourseId =
    formData.ccsId && formData.language
      ? `${formData.ccsId.trim().toUpperCase().replace(/\s+/g, '_')}_${String(formData.language).toUpperCase().replace(/[^A-Z0-9]/g, '_')}`
      : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ccsId: formData.ccsId ? formData.ccsId.trim().toUpperCase().replace(/\s+/g, '_') : undefined,
          price: formData.requiresPremium ? {
            amount: formData.priceAmount,
            currency: formData.priceCurrency,
          } : undefined,
          pointsConfig: {
            completionPoints: formData.completionPoints,
            lessonPoints: formData.lessonPoints,
            perfectCourseBonus: formData.perfectCourseBonus,
          },
          xpConfig: {
            completionXP: formData.completionXP,
            lessonXP: formData.lessonXP,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to course editor to add lessons
        router.push(`/${locale}/admin/courses/${data.course.courseId}`);
      } else {
        alert(data.error || 'Failed to create course');
      }
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/admin/courses`}
          className="p-2 bg-brand-darkGrey text-brand-white rounded-lg hover:bg-brand-secondary-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Course</h1>
          <p className="text-gray-400">Set up basic course information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent">
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-xl font-bold text-brand-black mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Course ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  placeholder="e.g., ENTREPRENEURSHIP_101"
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                />
                <p className="text-xs text-brand-darkGrey mt-1">Unique identifier (uppercase, underscores)</p>
                {suggestedCourseId && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-brand-darkGrey">Suggested:</span>
                    <code className="text-xs bg-brand-darkGrey/10 px-2 py-1 rounded text-brand-black">{suggestedCourseId}</code>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, courseId: suggestedCourseId })}
                      className="text-xs font-bold bg-brand-accent text-brand-black px-2 py-1 rounded hover:bg-brand-primary-400 transition-colors"
                    >
                      Use
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Language *
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                >
                  {COURSE_LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Course Family (CCS ID)
                </label>
                <input
                  type="text"
                  value={formData.ccsId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ccsId: e.target.value,
                    })
                  }
                  placeholder="e.g., PRODUCTIVITY_2026"
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                />
                <p className="text-xs text-brand-darkGrey mt-1">
                  Optional. Use this to link language variants to a course family (e.g. PRODUCTIVITY_2026_HU, PRODUCTIVITY_2026_EN share ccsId=PRODUCTIVITY_2026).
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Entrepreneurship 101"
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Course description..."
                  rows={4}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requiresPremium}
                    onChange={(e) => setFormData({ ...formData, requiresPremium: e.target.checked })}
                    className="w-5 h-5 text-brand-accent border-brand-darkGrey rounded focus:ring-brand-accent"
                  />
                  <span className="text-sm font-medium text-brand-black">Requires Premium</span>
                </label>
              </div>
              {formData.requiresPremium && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-brand-black mb-2">
                      Price (in smallest unit)
                    </label>
                    <input
                      type="number"
                      min={getStripeMinimum(formData.priceCurrency)}
                      step="1"
                      value={formData.priceAmount}
                      onChange={(e) => setFormData({ ...formData, priceAmount: parseInt(e.target.value) || 0 })}
                      className={`w-full px-4 py-2 bg-brand-white border-2 rounded-lg text-brand-black focus:outline-none focus:border-brand-accent ${
                        !meetsStripeMinimum(formData.priceAmount, formData.priceCurrency)
                          ? 'border-red-500'
                          : 'border-brand-darkGrey'
                      }`}
                      placeholder="2999"
                    />
                    {!meetsStripeMinimum(formData.priceAmount, formData.priceCurrency) ? (
                      <p className="text-xs text-red-600 mt-1 font-semibold">
                        ⚠️ Amount too low! Minimum for {formData.priceCurrency.toUpperCase()} is {getFormattedMinimum(formData.priceCurrency)}
                      </p>
                    ) : (
                      <p className="text-xs text-brand-darkGrey mt-1">
                        Enter amount in smallest unit (e.g., 2999 cents = $29.99). Minimum: {getFormattedMinimum(formData.priceCurrency)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-black mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.priceCurrency}
                      onChange={(e) => {
                        const newCurrency = e.target.value;
                        const currentAmount = formData.priceAmount;
                        const minimum = getStripeMinimum(newCurrency);
                        // If current amount is below new currency's minimum, set to minimum
                        const newAmount = currentAmount < minimum ? minimum : currentAmount;
                        setFormData({ 
                          ...formData, 
                          priceCurrency: newCurrency,
                          priceAmount: newAmount,
                        });
                      }}
                      className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                    >
                      <option value="usd">USD ($) - Min: $0.50</option>
                      <option value="eur">EUR (€) - Min: €0.50</option>
                      <option value="huf">HUF (Ft) - Min: 175 Ft</option>
                      <option value="gbp">GBP (£) - Min: £0.30</option>
                    </select>
                    <p className="text-xs text-brand-darkGrey mt-1">
                      Minimum: {getFormattedMinimum(formData.priceCurrency)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Points Configuration */}
          <div>
            <h2 className="text-xl font-bold text-brand-black mb-4">Points & XP Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Completion Points
                </label>
                <input
                  type="number"
                  value={formData.completionPoints}
                  onChange={(e) => setFormData({ ...formData, completionPoints: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Points per Lesson
                </label>
                <input
                  type="number"
                  value={formData.lessonPoints}
                  onChange={(e) => setFormData({ ...formData, lessonPoints: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Perfect Course Bonus
                </label>
                <input
                  type="number"
                  value={formData.perfectCourseBonus}
                  onChange={(e) => setFormData({ ...formData, perfectCourseBonus: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Completion XP
                </label>
                <input
                  type="number"
                  value={formData.completionXP}
                  onChange={(e) => setFormData({ ...formData, completionXP: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  XP per Lesson
                </label>
                <input
                  type="number"
                  value={formData.lessonXP}
                  onChange={(e) => setFormData({ ...formData, lessonXP: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-brand-darkGrey/20">
            <Link
              href={`/${locale}/admin/courses`}
              className="px-6 py-2 bg-brand-darkGrey text-brand-white rounded-lg font-bold hover:bg-brand-secondary-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
