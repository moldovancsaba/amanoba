## Objective

Align **MetricCard**, introduce **ProgressCard** where course progress fits, and unify **StateBlock** on `@gds/core`—with explicit API mapping from Amanoba locals.

## Unified Context

### API delta (must document in PR)

| Prop | Amanoba local `MetricCard` | GDS `@gds/core/MetricCard` |
| --- | --- | --- |
| label | `label` | `label` |
| value | `value` | `value` |
| detail | `detail` | `description` |
| progress bar | `progress?: number` | use `ProgressCard` |
| icon color | `color` on ThemeIcon | icon only (no color prop) — use `trend` badge or theme |
| secondary | — | `footer` |

| Prop | Amanoba `StateBlock` | GDS `StateBlock` |
| --- | --- | --- |
| kind | `kind` | `variant` |
| error UI | `Alert` for error | unified stack |
| secondary action | `secondaryAction` | map to `action` Group |

GDS variants add: `not-enough-data`, `disabled`, `info`.

## Problem

Admin/learner pages use local MetricCard with `color="amanobaYellow"`; swapping blindly breaks payments dashboard and stats grid.

## Goal

Single export path:

```ts
export { MetricCard, ProgressCard, StateBlock } from '@/app/components/patterns/gds/metrics';
```

Implementation = GDS + thin mapper functions.

## Scope

### In scope

- Create `app/components/patterns/gds/metric-adapters.tsx`:

```tsx
export function MetricCard(props: AmanobaMetricCardProps) {
  return (
    <GdsMetricCard
      label={props.label}
      value={props.value}
      description={props.detail}
      icon={props.icon ? <ThemeIcon color={props.color}>{props.icon}</ThemeIcon> : undefined}
    />
  );
}
```

- For `progress` prop usages → `ProgressCard` with `progress={p}`, `value`, `label`.
- StateBlock adapter: `kind` → `variant` map; preserve error `Alert` UX if GDS variant insufficient—document exception in inventory.
- Migrate: `dashboard`, `stats`, `admin/payments`, `admin/certificates`, `admin/rewards`, `admin/email-analytics`, `MemoryGame` metrics strip.

### Out of scope

- Profile page local `MetricCard` (current/best) — add TODO in inventory; optional `ProgressCard` partial fit
- Full ResponsiveDataView (child 6/9)

## Technical Notes

### Progress cardinality

For course progress \(p \in [0,100]\), display:

\[
\text{ProgressCard.value} = \text{lessonIndex}/\text{lessonTotal}, \quad \text{progress} = p
\]

### Pseudocode: StateBlock kind map

```ts
const kindToVariant = {
  loading: 'loading',
  empty: 'empty',
  error: 'error',
  permission: 'permission',
  success: 'success',
  info: 'info',
} as const;
```

## UX Instructions

- Metrics: number is visually dominant (`Title order={3}` hierarchy).
- States: compact inside cards/tables; full-page centered for route-level empty on catalog.
- Error states must include **next action** (retry link, sign-in) per COMPONENTS_AND_PATTERNS § State Blocks.

## Acceptance Checks

- [ ] All listed surfaces use GDS-backed MetricCard/ProgressCard/StateBlock
- [ ] No regression on payments 4-up metric grid
- [ ] Lesson quiz loading/error still readable
- [ ] `ui:check:mantine` allowlist updated for new paths

## Verification

- Full npm quality gates
- Screenshots: dashboard metrics, payments admin, quiz error state

## Dependencies

- Depends on: 2/9, 3/9
- Blocks: 7/9, 8/9

## Delivery Artifact

Adapter module + migrated imports + inventory update.
