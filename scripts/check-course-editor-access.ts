/**
 * Check whether a given email has editor access to a course (production DB via .env.local).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/check-course-editor-access.ts COURSE_ID email@example.com
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Player } from '../app/lib/models';

const COURSE_ID = process.argv[2];
const EMAIL = process.argv[3];

function normEmail(email: string) {
  return email.trim().toLowerCase();
}

async function main() {
  if (!COURSE_ID || !EMAIL) {
    console.error('Usage: npx tsx --env-file=.env.local scripts/check-course-editor-access.ts COURSE_ID email@example.com');
    process.exit(1);
  }

  await connectDB();

  const player = await Player.findOne({ email: normEmail(EMAIL) })
    .select('_id email name role authProvider isAnonymous ssoSub')
    .lean();

  if (!player) {
    console.error('Player not found by email:', normEmail(EMAIL));
    process.exit(2);
  }

  const course = await Course.findOne({ courseId: COURSE_ID })
    .select('_id courseId name language createdBy assignedEditors requiresPremium isActive')
    .lean();

  if (!course) {
    console.error('Course not found:', COURSE_ID);
    process.exit(3);
  }

  const playerId = String(player._id);
  const createdBy = course.createdBy ? String(course.createdBy as any) : null;
  const assignedEditors = Array.isArray(course.assignedEditors) ? course.assignedEditors.map((id: any) => String(id)) : [];

  const hasAccess = createdBy === playerId || assignedEditors.includes(playerId);

  console.log('Editor access check');
  console.log('- email:', player.email);
  console.log('- playerId:', playerId);
  console.log('- playerRole:', (player as any).role ?? 'user');
  console.log('- courseId:', course.courseId);
  console.log('- courseName:', (course as any).name ?? '');
  console.log('- createdBy:', createdBy);
  console.log('- assignedEditorsCount:', assignedEditors.length);
  console.log('- assignedEditorsIncludesPlayer:', assignedEditors.includes(playerId));
  console.log('- hasEditorAccessToCourse:', hasAccess);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

