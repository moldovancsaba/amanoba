/**
 * Editor Access API
 *
 * What: Returns whether the current user has editor access (assigned to at least one course).
 * Why: Lets the frontend gate the /editor area without using /admin routes.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPlayerIdFromSession, hasEditorAccess, isAdmin } from '@/lib/rbac';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ canAccessEditor: false, isAdmin: false }, { status: 200 });
    }

    const admin = isAdmin(session);
    const playerId = getPlayerIdFromSession(session);
    const editor = await hasEditorAccess(playerId);

    return NextResponse.json(
      {
        canAccessEditor: admin || editor,
        isAdmin: admin,
        isEditorOnly: !admin && editor,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ canAccessEditor: false, isAdmin: false }, { status: 200 });
  }
}

