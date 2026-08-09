/**
 * LanguageSwitcher Component
 * 
 * Displays available language variants for a course and allows users to switch between them.
 * Only renders if multiple languages are available.
 */

import Link from 'next/link';
import { getCourseLanguageVariants } from '../lib/course-helpers';
import { LanguageBadge } from './patterns/gds/LanguageBadge';
import { COURSE_LANGUAGE_OPTIONS } from '../lib/constants/course-languages';

interface LanguageSwitcherProps {
  courseId: string;
  currentLanguage: string;
}

export async function LanguageSwitcher({
  courseId,
  currentLanguage,
}: LanguageSwitcherProps) {
  const variants = await getCourseLanguageVariants(courseId);

  // Don't render if only one language available
  if (variants.available.length <= 1) {
    return null;
  }

  return (
    <div className="language-switcher">
      <div className="language-switcher-header">
        <h4 className="language-switcher-title">Available Languages</h4>
        <p className="language-switcher-subtitle">
          This course is available in {variants.available.length} languages
        </p>
      </div>

      <div className="language-options">
        {variants.available.map(lang => {
          const isOriginal = lang === variants.original?.language;
          const isCurrent = lang === currentLanguage;

          // Find course ID for this language
          let variantCourseId: string;
          if (lang === variants.original?.language) {
            variantCourseId = variants.original.courseId;
          } else {
            const variant = variants.variants.find(v => v.language === lang);
            variantCourseId = variant?.courseId || courseId;
          }

          // Get language metadata
          const langInfo = COURSE_LANGUAGE_OPTIONS.find(opt => opt.code === lang);
          const translationStatus = variants.variants.find(v => v.language === lang)?.translationStatus;

          // Type-safe language code for LanguageBadge
          const languageCode = COURSE_LANGUAGE_OPTIONS.find(opt => opt.code === lang)?.code || 'en';

          return (
            <Link
              key={lang}
              href={`/courses/${variantCourseId}`}
              className={`language-option ${isCurrent ? 'language-option--active' : ''}`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <div className="language-option-badge">
                <LanguageBadge language={languageCode} display="native" />
              </div>

              <div className="language-option-meta">
                {isOriginal && (
                  <span className="language-badge language-badge--original">
                    Original
                  </span>
                )}
                {isCurrent && (
                  <span className="language-badge language-badge--current">
                    Current
                  </span>
                )}
                {translationStatus === 'draft' && (
                  <span className="language-badge language-badge--draft">
                    Draft
                  </span>
                )}
                {translationStatus === 'review' && (
                  <span className="language-badge language-badge--review">
                    In Review
                  </span>
                )}
              </div>

              {langInfo && (
                <div className="language-option-name">
                  {langInfo.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .language-switcher {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          margin-top: var(--space-6);
        }

        .language-switcher-header {
          margin-bottom: var(--space-4);
        }

        .language-switcher-title {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin: 0 0 var(--space-1) 0;
        }

        .language-switcher-subtitle {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
        }

        .language-options {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-background);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .language-option:hover {
          background: var(--color-surface-hover);
          border-color: var(--color-primary);
          transform: translateX(2px);
        }

        .language-option--active {
          background: var(--color-primary-surface);
          border-color: var(--color-primary);
          font-weight: var(--font-weight-medium);
        }

        .language-option-badge {
          flex-shrink: 0;
        }

        .language-option-meta {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .language-badge {
          display: inline-block;
          padding: var(--space-1) var(--space-2);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
          border-radius: var(--radius-sm);
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .language-badge--original {
          background: var(--color-success-surface);
          color: var(--color-success);
          border: 1px solid var(--color-success);
        }

        .language-badge--current {
          background: var(--color-primary-surface);
          color: var(--color-primary);
          border: 1px solid var(--color-primary);
        }

        .language-badge--draft {
          background: var(--color-warning-surface);
          color: var(--color-warning);
          border: 1px solid var(--color-warning);
        }

        .language-badge--review {
          background: var(--color-info-surface);
          color: var(--color-info);
          border: 1px solid var(--color-info);
        }

        .language-option-name {
          margin-left: auto;
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        @media (max-width: 640px) {
          .language-options {
            gap: var(--space-1);
          }

          .language-option {
            padding: var(--space-2);
            font-size: var(--font-size-sm);
          }

          .language-option-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
