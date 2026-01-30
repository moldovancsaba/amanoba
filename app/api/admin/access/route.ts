/**
 * Admin Access API
 *
 * What: Returns whether the current user can access admin and their role mode
 * Why: Lets the frontend show/hide Admin link and limit nav for editor-only users
 */

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin, getPlayerIdFromSession, hasEditorAccess } from '@/lib/rbac';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { canAccessAdmin: false, isAdmin: false, isEditorOnly: false },
        { status: 200 }
      );
    }

    const admin = isAdmin(session);
    const playerId = getPlayerIdFromSession(session);
    const editor = await hasEditorAccess(playerId);
    const canAccessAdmin = admin || editor;
    const isEditorOnly = !admin && editor;

    return NextResponse.json({
      canAccessAdmin,
      isAdmin: admin,
      isEditorOnly,
    });
  } catch (_error) {
    return NextResponse.json(
      { canAccessAdmin: false, isAdmin: false, isEditorOnly: false },
      { status: 200 }
    );
  }
}
