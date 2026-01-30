/**
 * Script entrypoint / re-export for Language Integrity.
 *
 * Why:
 * - The delivery system (emails) must enforce language integrity at send-time.
 * - The audits/pipeline scripts also need the exact same logic.
 *
 * Source of truth:
 * - `app/lib/quality/language-integrity.ts`
 */

export * from '../app/lib/quality/language-integrity';

