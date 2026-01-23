# Admin UI Improvements

**Date**: 2026-01-23  
**Status**: ✅ COMPLETE  
**Priority**: P0 (CRITICAL)  
**Related Documents**: TASKLIST.md, RELEASE_NOTES.md

---

## Overview

Cleanup and improvements to the admin interface for better UX and consistency.

---

## Tasks

### 1. Remove Deprecated Admin Docs Menu Item

**What**: Remove the "Course Creation Guide" menu item and its content from admin sidebar.

**Why**: The admin docs feature is deprecated and no longer needed.

**Files to Modify**:
- `app/[locale]/admin/layout.tsx` - Remove menu item from navigationItems array
- Delete `app/[locale]/admin/docs/course-creation/page.tsx` (if exists)
- Delete `public/admin-docs/course-creation-guide-*.md` files

**Implementation**:
1. Remove `{ key: 'courseGuide', href: '/admin/docs/course-creation', icon: FileText }` from navigationItems
2. Delete the route file if it exists
3. Delete markdown files from public/admin-docs/

**Reference**: https://www.amanoba.com/hu/admin/docs/course-creation

---

### 2. Add Logout Option to Admin Sidebar Bottom

**What**: Add a logout button at the bottom of the admin sidebar.

**Why**: Users need an easy way to logout from the admin panel.

**Files to Modify**:
- `app/[locale]/admin/layout.tsx` - Add logout button in sidebar footer

**Implementation**:
1. Import `signOut` from `next-auth/react`
2. Add logout button in sidebar footer (after navigation items, before version)
3. Use `signOut()` function on click
4. Style consistently with other sidebar items

**UI Location**: Bottom of left sidebar, above version number

---

### 3. Rename "Players" to "Users" Everywhere

**What**: Change all references from "players" to "users" in admin interface and code.

**Why**: Better terminology - we're managing users, not players.

**Files to Modify**:
- `app/[locale]/admin/layout.tsx` - Change navigation item key from 'players' to 'users'
- `app/[locale]/admin/players/page.tsx` - Update page title, comments, translations
- All admin pages that reference "players" - Update text and comments
- Translation files (`messages/en.json`, `messages/hu.json`) - Update translation keys

**Implementation**:
1. Update navigation item: `{ key: 'users', href: '/admin/players', icon: Users }`
2. Update page titles and headings
3. Update translation keys (if needed)
4. Update code comments
5. Keep route path as `/admin/players` (no need to change URL)

**Note**: Database model and API routes can keep "Player" naming (internal), but UI should say "Users"

---

### 4. Show Actual User Name in Top Right Corner

**What**: Replace "Admin User" text with the actual logged-in user's name.

**Why**: Personalization - show who is actually logged in.

**Files to Modify**:
- `app/[locale]/admin/layout.tsx` - Update user display section

**Implementation**:
1. Get user session using `useSession()` from `next-auth/react`
2. Extract user name from `session.user.name` or `session.user.email`
3. Display user name instead of hardcoded "Admin User"
4. Fallback to "Admin User" if name not available

**Current Code** (line ~182):
```typescript
<div className="text-white text-sm font-medium">Admin User</div>
```

**New Code**:
```typescript
<div className="text-white text-sm font-medium">
  {session?.user?.name || session?.user?.email || 'Admin User'}
</div>
```

---

## Testing Checklist

- [ ] Admin docs menu item removed from sidebar
- [ ] Admin docs route returns 404 or redirects
- [ ] Logout button appears at bottom of sidebar
- [ ] Logout button works correctly
- [ ] "Players" changed to "Users" in all admin pages
- [ ] User name displays correctly in top right
- [ ] Fallback to "Admin User" works if name not available
- [ ] All translations updated (if applicable)

---

## Related Files

- `app/[locale]/admin/layout.tsx` - Main admin layout component
- `app/[locale]/admin/players/page.tsx` - Users management page
- `messages/en.json` - English translations
- `messages/hu.json` - Hungarian translations

---

## Notes

- Keep route paths unchanged (e.g., `/admin/players` stays the same)
- Only change UI text and labels
- Database models can keep "Player" naming internally
