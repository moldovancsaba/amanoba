# Amanoba GDS Upstream Handoff Packet

**Generated**: 2026-08-05  
**From**: Amanoba GDS Readiness Program (#878)  
**GDS Version**: 3.14.17  
**Product Archetype**: `lms-game`

---

## Executive Summary

After completing a comprehensive local convergence program (issues #879-#888), Amanoba has identified **3 proven shared-system gaps** suitable for upstream GDS escalation. All other gaps have been resolved via local adapters, documented exceptions, or contract clarification.

This packet contains only remaining gaps that:
1. Are genuinely shared-system concerns (not Amanoba-specific)
2. Have proven local evidence and production use
3. Would benefit multiple GDS-consuming products
4. Cannot be adequately solved via local adapters without drift

---

## Upstream Gap #1: Learner App Shell (LMS-specific)

### Current State

**Local workaround**: `LearnerShellAdapter` (9 consuming routes)
- Implementation: `app/components/patterns/gds/LearnerShellAdapter.tsx`
- GDS backing: None (Mantine composition with session hooks)
- Status: Stable but product-local

**Routes**: Dashboard, courses, my-courses, saved, practice, stats, leaderboards, blog, news

### Gap Description

GDS does not currently provide an LMS-specific learner shell/header contract. Products building learner-facing education platforms must compose their own navigation, profile actions, and admin access patterns.

### Desired Upstream Contract

**Package**: `@sovereignsquad/gds-lms` (new) or extension in `@sovereignsquad/gds-core/client`

**Component**: `LearnerAppShell` or `LearnerHeader`

**Props**:
```typescript
type LearnerAppShellProps = {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  navigation: Array<{ href: string; label: string; icon: ReactNode }>;
  profileLink?: string;
  adminLink?: string;
  editorLink?: string;
  onSignOut?: () => void;
  onRefresh?: () => void;
  actions?: ReactNode;
  children: ReactNode;
};
```

**Required Features**:
- Sticky header with logo + title + subtitle
- Horizontal navigation (desktop) / hamburger menu (mobile)
- Profile/admin/editor conditional links
- Sign-out action
- Optional refresh button
- Custom action slot

**Accessibility**:
- Semantic `<header>` landmark
- Keyboard-navigable menu
- Mobile menu with aria-label
- Focus order: logo → title → actions → nav → menu

**Mobile Behavior**:
- Actions hidden below md breakpoint
- Navigation collapsed into hamburger menu
- Logo remains visible

### Evidence

- **9 learner routes** use this pattern consistently
- **Session-based navigation** (profile, admin, editor) is common LMS need
- **Mobile menu pattern** required for dense learner navigation
- **Admin/editor access** common in education platforms

### Non-Goals

- Generic admin shell (already solved by `@sovereignsquad/gds-admin`)
- Marketing shell (already solved by `PublicAppShell` local adapter)
- Course-specific navigation (product-local)

### Migration Path

If upstream ships `LearnerAppShell`, Amanoba will:
1. Map `LearnerShellAdapter` props to upstream contract
2. Replace local adapter with GDS primitive + thin brand wrapper
3. Maintain stable import path via re-export

### Priority

**Medium** - Local workaround is stable, but would benefit from upstream standardization across LMS products.

---

## Upstream Gap #2: Course/Product Card Variants

### Current State

**Local workaround**: `CourseCard` (3 consuming routes, 3 usage patterns)
- Implementation: `app/components/patterns/gds/CourseCard.tsx`
- GDS backing: `PublicProductCard` (single variant)
- Status: Stable but requires multiple composition patterns

**Routes**: Courses (catalog), my-courses (enrolled), dashboard (progress)

### Gap Description

GDS `PublicProductCard` provides a single product card variant. LMS and e-commerce products need distinct card behaviors for:
1. **Catalog variant**: Discovery (badges, metrics, "Enroll" CTA)
2. **Enrolled variant**: Progress tracking (progress bar, "Continue" CTA)
3. **Completed variant**: Achievement (certificate, "Review" CTA)

### Desired Upstream Contract

**Package**: `@sovereignsquad/gds-core/client` (extension of existing `PublicProductCard`)

**Component**: `PublicProductCard` with `variant` prop

**Props Enhancement**:
```typescript
type ProductCardVariant = 'catalog' | 'enrolled' | 'completed';

type PublicProductCardProps = {
  // Existing props...
  variant?: ProductCardVariant; // New
  progress?: {
    value: number; // 0-100
    label?: string;
    detail?: ReactNode;
  }; // New
  // ...
};
```

**Variant Behaviors**:
- **Catalog**: No progress bar, focus on discovery metadata
- **Enrolled**: Progress bar visible, "Continue" action emphasized
- **Completed**: Badge/icon for completion, optional certificate action

**Required Features**:
- Progress bar (0-100) for enrolled/completed variants
- Badge priority rules (status > commercial > metadata)
- Thumbnail fallback with icon + label
- Responsive card layout (grid → stack)

**Accessibility**:
- Progress bar has semantic role (progressbar)
- Progress text not color-only (includes label + percentage)
- Actions keyboard-navigable
- Badges readable by screen readers

**Mobile Behavior**:
- Responsive via existing GDS card layout
- Compact mode for dense grids

### Evidence

- **3 usage patterns** in production (catalog, enrolled, progress)
- **Progress tracking** common in LMS, e-learning, subscription products
- **Badge priority** needed for multi-state products (free/premium, enrolled/completed)
- **E-commerce adjacency**: Similar needs for product discovery vs purchase history

### Non-Goals

- Admin-specific product cards (solved by admin data tables)
- Game-specific cards (documented exception for game engine)
- Single-use custom cards (product-local)

### Migration Path

If upstream ships enhanced `PublicProductCard`:
1. Map `CourseCard` props to `variant` + `progress` props
2. Remove local progress rendering logic
3. Maintain stable import path via thin adapter

### Priority

**High** - Multi-state product cards are common across LMS, e-commerce, and subscription products. Would benefit from upstream standardization.

---

## Upstream Gap #3: Server Token Bridge for Non-CSS Contexts

### Current State

**Local workaround**: `color-tokens.ts` (server-safe raw literals)
- Implementation: `app/lib/constants/color-tokens.ts`
- GDS backing: None (local constants)
- Status: Stable but duplicates theme authority

**Contexts**: Emails, OG images, charts (Recharts), game personas

### Gap Description

GDS `extendGdsTheme` provides runtime theme authority for CSS/Mantine components, but non-CSS contexts (emails, OG images, charts) need raw color literals. Products must maintain a separate token bridge, duplicating theme authority.

### Desired Upstream Contract

**Package**: `@sovereignsquad/gds-theme/server` (extension)

**Export**: `extractTokenBridge` or `getServerTokens`

**API**:
```typescript
import { extendGdsTheme, extractTokenBridge } from '@sovereignsquad/gds-theme/server';

const theme = extendGdsTheme({ /* ... */ });

const tokens = extractTokenBridge(theme);
// Returns:
// {
//   brand: { black: '#111', white: '#f7f7f7', primary: '#fab908', ... },
//   semantic: { error: '#ef4444', success: '#22c55e', ... },
//   palette: { primary: [...], gray: [...], ... },
//   email: { ctaBg: '#fab908', ctaText: '#111', ... },
//   chart: { series: ['#...', '#...'], grid: '#...', ... },
// }
```

**Required Features**:
- Extract raw hex values from theme
- Support email-specific mappings (CTA bg/text, body text, borders)
- Support chart-specific mappings (series palette, grid/axis colors)
- Type-safe exports (const objects)

**Accessibility**:
- Token bridge must preserve semantic color meanings
- Contrast ratios must remain compliant

**Server Safety**:
- Must be server-safe (no browser-only APIs)
- Must work in Next.js ImageResponse (next/og)

### Evidence

- **4 non-CSS contexts** in production (email, OG, charts, games)
- **Email rendering** common in transactional/marketing platforms
- **OG images** common in content/social platforms
- **Charts** common in analytics/dashboard products
- **Duplication risk**: Local token bridge can drift from runtime theme

### Non-Goals

- Full server-side rendering of Mantine components (not needed)
- Chart library integration (Recharts, Victory, etc.) - products handle mapping
- Email template system (product-local)

### Migration Path

If upstream ships `extractTokenBridge`:
1. Replace `color-tokens.ts` exports with `extractTokenBridge(amanobaMantineTheme)`
2. Map returned tokens to email/OG/chart contexts
3. Remove duplicate palette definitions

### Priority

**Medium** - Local workaround is stable, but token duplication is a drift risk. Would benefit from upstream standardization across non-CSS rendering contexts.

---

## Resolved Gaps (Not Escalating)

The following gaps were initially considered but **resolved locally** via documented adapters or exceptions:

1. **Auth/Public/Article Shells** (#879) → Resolved via local brand-composition adapters
2. **Metrics/Progress/State Blocks** (#882) → Resolved via GDS primitives (no gap)
3. **Access Recovery** (#883) → Resolved via GDS `AccessRecoveryPanel` (no gap)
4. **Admin Data Views** (#885) → Resolved via GDS admin primitives (no gap)
5. **Rich Content Rendering** (#881) → Documented exception (Mantine `TypographyStylesProvider`)
6. **Interactive Learning Chrome** (#886) → Documented exception boundary (game engine internals)
7. **Token Governance** (#887) → Resolved via local workaround (pending Gap #3 resolution)
8. **GDS Compliance** (#888) → Resolved via enforcement tooling (no gap)

---

## Escalation Recommendation

**Upstream Issues to File**:
1. ✅ **High Priority**: Course/Product Card Variants (#2) - Common across LMS/e-commerce
2. ✅ **Medium Priority**: Learner App Shell (#1) - Benefits LMS archetype
3. ✅ **Medium Priority**: Server Token Bridge (#3) - Benefits non-CSS rendering

**Filing Location**: `sovereignsquad/general-design-system` (GDS monorepo)

**Issue Template**: Use production-grade structure from `general-design-system#81`

**Evidence Attachments**:
- This handoff packet
- `gds-adoption.json` (local adoption manifest)
- `PATTERN_CONTRACT_INVENTORY.md` (local adapter inventory)
- GDS readiness program HANDOVER entries (#879-#888)

---

## Contact

**Product**: Amanoba (unified flexible learning platform)  
**Owner**: amanoba-ui  
**GDS Version**: 3.14.17  
**Local Adoption**: Enforced (11 adapters, 5 exceptions)  
**Compliance**: ✅ Passing (11/11 checks)

**Questions**: Reference this packet and link to specific sections for clarification.
