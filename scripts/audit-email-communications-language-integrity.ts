/**
 * Email Communications Language Integrity Audit (Code-level)
 *
 * Purpose:
 * - Catch cross-language leakage introduced at send-time (e.g., English unsubscribe footer appended to non-EN emails).
 * - Inventory other email flows that are English-only and therefore violate language integrity expectations.
 *
 * Notes:
 * - This is a read-only, code-level audit (no DB access).
 * - It complements DB-driven audits (lesson.emailSubject/emailBody integrity) by validating the final HTML fragments
 *   we append at send-time.
 *
 * Usage:
 *   npx tsx scripts/audit-email-communications-language-integrity.ts
 *   npx tsx scripts/audit-email-communications-language-integrity.ts --out-dir scripts/reports --tasklist-dir docs/_archive/tasklists
 */

import { join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

import { locales } from '../app/lib/i18n/locales';
import type { Locale } from '../app/lib/i18n/locales';
import { validateLessonTextLanguageIntegrity } from './language-integrity';
import {
  renderLessonUnsubscribeFooterHtml,
  renderPaymentUnsubscribeFooterHtml,
} from '../app/lib/email/email-localization';
import {
  renderWelcomeEmailHtml,
  renderWelcomeEmailSubject,
  renderCompletionEmailHtml,
  renderCompletionEmailSubject,
  renderReminderEmailHtml,
  renderReminderEmailSubject,
  renderPaymentConfirmationEmail,
} from '../app/lib/email/email-localization';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const TASKLIST_DIR = getArgValue('--tasklist-dir') || join(process.cwd(), 'docs', '_archive', 'tasklists');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function mdEscape(s: string) {
  return String(s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ').trim();
}

function scrubForLanguageIntegrity(text: string, exemptStrings: Array<string | null | undefined>) {
  let s = String(text || '');
  for (const raw of exemptStrings || []) {
    const token = String(raw || '').trim();
    if (!token) continue;
    s = s.split(token).join(' ');
  }
  return s;
}

const SAMPLE_COURSE_NAMES: Record<Locale, string> = {
  en: 'Productivity 2026',
  hu: 'Termelékenység 2026',
  ar: 'الإنتاجية 2026',
  hi: 'उत्पादकता 2026',
  id: 'Produktivitas 2026',
  pt: 'Produtividade 2026',
  vi: 'Năng suất 2026',
  tr: 'Verimlilik 2026',
  bg: 'Продуктивност 2026',
  pl: 'Produktywność 2026',
  ru: 'Продуктивность 2026',
  sw: 'Uzalishaji 2026',
};

const SAMPLE_PLAYER_NAMES: Record<Locale, string> = {
  en: 'Test User',
  hu: 'Teszt Felhasználó',
  ar: 'مستخدم تجريبي',
  hi: 'परीक्षण उपयोगकर्ता',
  id: 'Pengguna Uji',
  pt: 'Usuário de Teste',
  vi: 'Người dùng thử nghiệm',
  tr: 'Test Kullanıcısı',
  bg: 'Тестов потребител',
  pl: 'Użytkownik testowy',
  ru: 'Тестовый пользователь',
  sw: 'Mtumiaji wa Majaribio',
};

function auditLessonUnsubscribeFooter() {
  const tokens = { border: '#dddddd', muted: '#666666' };
  const results = locales.map(locale => {
    const html = renderLessonUnsubscribeFooterHtml({
      locale,
      courseName: SAMPLE_COURSE_NAMES[locale],
      unsubscribeUrl: 'https://www.amanoba.com/api/email/unsubscribe?token=TEST_TOKEN',
      tokens,
    });
    const integrity = validateLessonTextLanguageIntegrity({
      language: locale,
      text: html,
      contextLabel: `email.unsubscribeFooter (${locale})`,
    });
    return { locale, ok: integrity.ok, errors: integrity.errors, findings: integrity.findings };
  });

  return results;
}

function auditTransactionalTemplates() {
  const tokens = { border: '#dddddd', muted: '#666666', bodyText: '#333333', ctaBg: '#FAB908', ctaText: '#111827' };
  const appUrl = 'https://www.amanoba.com';

  return locales.map(locale => {
    const courseName = SAMPLE_COURSE_NAMES[locale];
    const playerName = SAMPLE_PLAYER_NAMES[locale];

    const welcomeSubject = renderWelcomeEmailSubject({ locale, courseName });
    const welcomeHtml = renderWelcomeEmailHtml({
      locale,
      playerName,
      courseName,
      durationDays: 30,
      appUrl,
      tokens,
    });

    const completionSubject = renderCompletionEmailSubject({ locale, courseName });
    const completionHtml = renderCompletionEmailHtml({
      locale,
      playerName,
      courseName,
      durationDays: 30,
      appUrl,
      tokens,
    });

    const reminderSubject = renderReminderEmailSubject({ locale, dayNumber: 3, courseName });
    const reminderHtml = renderReminderEmailHtml({
      locale,
      playerName,
      courseName,
      dayNumber: 3,
      courseSlug: 'PRODUCTIVITY_2026_TEST',
      appUrl,
      tokens,
    });

    const payment = renderPaymentConfirmationEmail({
      locale,
      playerName,
      courseName,
      courseSlug: 'PRODUCTIVITY_2026_TEST',
      appUrl,
      tokens,
      formattedAmount: '$9.99',
      formattedExpiryDate: 'January 31, 2026',
      transactionId: 'TX_TEST_123',
      supportEmail: 'support@amanoba.com',
    });
    const paymentFinalHtml =
      payment.html +
      renderPaymentUnsubscribeFooterHtml({
        locale,
        unsubscribeUrl: 'https://www.amanoba.com/api/email/unsubscribe?token=TEST_TOKEN',
        tokens,
      });

    const checks = [
      { label: `welcome.subject (${locale})`, text: welcomeSubject },
      { label: `welcome.html (${locale})`, text: welcomeHtml },
      { label: `completion.subject (${locale})`, text: completionSubject },
      { label: `completion.html (${locale})`, text: completionHtml },
      { label: `reminder.subject (${locale})`, text: reminderSubject },
      { label: `reminder.html (${locale})`, text: reminderHtml },
      { label: `payment.subject (${locale})`, text: payment.subject },
      { label: `payment.html (${locale})`, text: paymentFinalHtml },
    ];

    const exempt = [
      playerName,
      courseName,
      appUrl,
      '$9.99',
      'January 31, 2026',
      'TX_TEST_123',
      'support@amanoba.com',
      'PRODUCTIVITY_2026_TEST',
    ];

    const failures = checks
      .map(c => ({
        ...c,
        result: validateLessonTextLanguageIntegrity({
          language: locale,
          text: scrubForLanguageIntegrity(c.text, exempt),
          contextLabel: c.label,
        }),
      }))
      .filter(x => !x.result.ok)
      .map(x => ({
        label: x.label,
        errors: x.result.errors,
        findings: x.result.findings,
      }));

    return {
      locale,
      ok: failures.length === 0,
      failures,
    };
  });
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(TASKLIST_DIR, { recursive: true });

  const stamp = isoStamp();

  const unsubscribeFooter = auditLessonUnsubscribeFooter();
  const failingUnsubscribeLocales = unsubscribeFooter.filter(x => !x.ok);

  const transactional = auditTransactionalTemplates();
  const failingTransactionalLocales = transactional.filter(x => !x.ok);

  const report = {
    generatedAt: new Date().toISOString(),
    scope: 'code-level email communications',
    totals: {
      locales: locales.length,
      unsubscribeFooterFailingLocales: failingUnsubscribeLocales.length,
      transactionalTemplatesFailingLocales: failingTransactionalLocales.length,
    },
    unsubscribeFooter,
    transactionalTemplates: transactional,
    communicationFlows: {
      dailyLessonEmail: {
        auditedHere: true,
        risk: 'high',
        note: 'Daily lesson emails append an unsubscribe footer at send-time. This audit verifies the footer is localized for all supported locales.',
      },
      welcomeEmail: {
        auditedHere: true,
        risk: 'high',
        note: 'Welcome email templates are rendered per locale and validated for language integrity.',
      },
      completionEmail: {
        auditedHere: true,
        risk: 'high',
        note: 'Completion email templates are rendered per locale and validated for language integrity.',
      },
      reminderEmail: {
        auditedHere: true,
        risk: 'high',
        note: 'Reminder email templates are rendered per locale and validated for language integrity.',
      },
      paymentConfirmationEmail: {
        auditedHere: true,
        risk: 'medium',
        note: 'Payment confirmation templates are rendered per locale and validated for language integrity including the send-time unsubscribe footer.',
      },
    },
    actionItems: [
      {
        id: 'EMAIL_TEMPLATES_LANGUAGE_INTEGRITY',
        severity: failingTransactionalLocales.length > 0 ? 'P0' : 'P2',
        title: 'Ensure all transactional email templates pass language integrity for all supported locales',
        details: failingTransactionalLocales.length > 0
          ? 'Some locales failed the code-level language integrity validation for transactional email templates.'
          : 'All transactional email templates passed language integrity validation for all supported locales.',
      },
    ],
  };

  const reportPath = join(OUT_DIR, `email-communications-language-audit__${stamp}.json`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  const taskLines: string[] = [];
  taskLines.push(`# Email Communications Language Integrity Audit`);
  taskLines.push(``);
  taskLines.push(`Generated: ${report.generatedAt}`);
  taskLines.push(`Scope: **${report.scope}**`);
  taskLines.push(`Mode: **READ-ONLY** (no DB writes)`);
  taskLines.push(``);
  taskLines.push(`## Safety Rollback Plan`);
  taskLines.push(`- This audit is read-only (no DB writes). Rollback is not applicable.`);
  taskLines.push(``);
  taskLines.push(`## Unsubscribe Footer (Daily Lesson Emails)`);
  if (failingUnsubscribeLocales.length === 0) {
    taskLines.push(`- ✅ Unsubscribe footer passes language integrity for all supported locales: ${locales.join(', ')}`);
  } else {
    taskLines.push(`- ❌ Unsubscribe footer fails language integrity for ${failingUnsubscribeLocales.length} locale(s):`);
    for (const r of failingUnsubscribeLocales) {
      taskLines.push(`  - [ ] ${r.locale}: ${mdEscape(r.errors[0] || 'unknown error')}`);
      for (const f of (r.findings || []).slice(0, 2)) {
        taskLines.push(`    - Finding: ${mdEscape(f.label)} — ${mdEscape(f.snippet)}`);
      }
    }
  }
  taskLines.push(``);
  taskLines.push(`## Transactional Email Templates (Code-level)`);
  if (failingTransactionalLocales.length === 0) {
    taskLines.push(`- ✅ Transactional templates pass language integrity for all supported locales: ${locales.join(', ')}`);
  } else {
    taskLines.push(`- ❌ Transactional templates fail language integrity for ${failingTransactionalLocales.length} locale(s):`);
    for (const r of failingTransactionalLocales) {
      taskLines.push(`  - [ ] ${r.locale}`);
      for (const f of r.failures.slice(0, 3)) {
        taskLines.push(`    - ${mdEscape(f.label)}: ${mdEscape(f.errors?.[0] || 'unknown error')}`);
      }
    }
  }
  taskLines.push(``);
  taskLines.push(`## Action Items`);
  taskLines.push(`- [ ] If any locale fails: fix templates until audit passes`);
  taskLines.push(``);
  taskLines.push(`Report: \`${reportPath}\``);

  const tasklistPath = join(TASKLIST_DIR, `EMAIL_COMMUNICATIONS_LANGUAGE_AUDIT__${stamp}.md`);
  writeFileSync(tasklistPath, taskLines.join('\n'));

  console.log('✅ Email communications language audit complete (read-only)');
  console.log(`- Report: ${reportPath}`);
  console.log(`- Tasklist: ${tasklistPath}`);
  console.log(JSON.stringify(report.totals, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
