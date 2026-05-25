## Objective

Migrate admin **DataToolbar** to `@gds/core` and **ResponsiveDataView** to `@gds/admin` with a **compatibility adapter** so existing column definitions and `md` breakpoint behavior are preserved.

## Unified Context

### Structural difference (critical)

**Amanoba** `ResponsiveDataView`:

- Input: `rows`, `columns: ResponsiveColumn<T>[]` with `cell(row)`, `mobileLabel`
- Breakpoint: Mantine `visibleFrom="md"` table; cards below
- Features: `getRowStyle`, `minTableWidth`, custom `loadingState`

**GDS** `@gds/admin/ResponsiveDataView`:

- Input: `data`, `columns: DataTableColumn<T>[]`, `renderCard(item)`
- Breakpoint: `useMediaQuery('(max-width: 48em)')`
- Built-in `StateBlock` for empty/error

## Problem

Direct swap breaks ~15 admin pages wired to Amanoba column type.

## Goal

Provide adapter:

\[
\text{AmanobaResponsiveDataView} = f(\text{GDS ResponsiveDataView}, \text{translateColumns})
\]

OR keep local implementation as **documented fork** re-exporting GDS when parity achieved—decision recorded in PR description.

## Scope

### In scope

- Implement `app/components/patterns/gds/ResponsiveDataView.tsx`:

```tsx
// Pseudocode: translate Amanoba API → GDS internals
function toGdsColumns(cols: ResponsiveColumn<T>[]): DataTableColumn<T>[] {
  return cols.filter(c => !c.hideOnMobile).map(c => ({
    key: c.key,
    header: c.header,
    cell: (row) => c.cell(row),
  }));
}
function renderCard(row, cols) {
  return (
    <Card>
      {cols.map(c => (
        <Group key={c.key}>
          <Text size="sm" c="dimmed">{c.mobileLabel ?? c.header}</Text>
          {c.cell(row)}
        </Group>
      ))}
    </Card>
  );
}
```

- Migrate **one pilot page** first: `admin/votes` or `admin/players`
- Then batch: payments, certificates, rewards, games, analytics, email-analytics, surveys, questions
- DataToolbar: compare GDS `DataToolbar` slots vs local `title` + `layout: 'inline'|'stack'`; adapter if needed

### Out of scope

- Learner tables (none)
- Course editor markdown (separate)

## Technical Notes

### Mobile card density UX

Per GDS COMPONENTS § Mobile Action Density: **one primary action** visible per card; overflow in `Menu`.

### Pagination invariant

For page \(p\), page size \(k\), total \(N\):

\[
\text{visible} = \min(k, N - (p-1)k)
\]

Pagination component unchanged—only row container migrates.

## UX Instructions

- Filters remain in `DataToolbar` above grid; active filters visible.
- Loading: use `StateBlock` variant loading, not naked `Loader` only.
- Empty: title + description + optional create CTA.

## Acceptance Checks

- [ ] Pilot admin page on GDS-backed data view
- [ ] All admin list pages in inventory migrated OR explicit exception list in PR
- [ ] Mobile card layout shows labeled fields
- [ ] Desktop table horizontal scroll when `minTableWidth` exceeded
- [ ] Row highlight/opacity (`getRowStyle`) preserved for questions page

## Verification

- Quality gates + manual admin players/payments/questions at 390px and 1280px

## Dependencies

- Depends on: 2/9, 5/9 (StateBlock)
- Blocks: 8/9

## Risks

- GDS DataTable column API may lack `align`—extend adapter.

## Delivery Artifact

Adapter + migrated admin pages + HANDOVER.
