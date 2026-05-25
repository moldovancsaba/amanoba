#!/usr/bin/env bash
# Create GDS 2.3.0 adoption epic + child issues on mvp-factory-control and add to Project 12.
set -euo pipefail
REPO="moldovancsaba/mvp-factory-control"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BODY_DIR="$ROOT/docs/handoff/feature_issues/gds-2.3-bodies"
mkdir -p "$BODY_DIR"

create_issue() {
  local title="$1"
  local body_file="$2"
  gh issue create --repo "$REPO" --title "$title" --body-file "$body_file"
}

add_to_board() {
  local num="$1"
  local status="${2:-Backlog (SOONER)}"
  MVP_PROJECT_NUMBER=12 "$ROOT/scripts/mvp-factory-set-project-fields.sh" "$num" --status "$status" || true
}

echo "Creating epic..."
EPIC_URL=$(create_issue "Amanoba: GDS 2.3.0 rock-solid adoption program (Mantine packages)" "$BODY_DIR/00-epic.md")
EPIC_NUM="${EPIC_URL##*/}"
echo "Epic: #$EPIC_NUM $EPIC_URL"
add_to_board "$EPIC_NUM" "Backlog (SOONER)"

CHILDREN=(
  "1|Amanoba GDS 2.3.0 1/9: adapter docs and contract inventory alignment|01-docs.md"
  "2|Amanoba GDS 2.3.0 2/9: install @gds packages and CI compatibility baseline|02-packages.md"
  "3|Amanoba GDS 2.3.0 3/9: migrate theme to extendGdsTheme (Amanoba brand)|03-theme.md"
  "4|Amanoba GDS 2.3.0 4/9: migrate Auth Public Article shells to @gds/core|04-shells.md"
  "5|Amanoba GDS 2.3.0 5/9: align MetricCard ProgressCard and StateBlock|05-metrics-states.md"
  "6|Amanoba GDS 2.3.0 6/9: migrate admin DataToolbar and ResponsiveDataView|06-admin-data.md"
  "7|Amanoba GDS 2.3.0 7/9: StateBlock rollout on remaining learner routes|07-state-rollout.md"
  "8|Amanoba GDS 2.3.0 8/9: retire duplicate local pattern modules and guardrails|08-retire-local.md"
  "9|Amanoba GDS 2.3.0 9/9: Phase 6 Tailwind and legacy CSS authority deletion|09-phase6-delete.md"
)

for entry in "${CHILDREN[@]}"; do
  IFS='|' read -r idx title file <<< "$entry"
  path="$BODY_DIR/$file"
  if [ ! -f "$path" ]; then
    echo "Missing body: $path" >&2
    exit 1
  fi
  # Inject parent link
  tmp=$(mktemp)
  {
    echo "## Parent"
    echo ""
    echo "Part of #$EPIC_NUM — GDS 2.3.0 rock-solid adoption program."
    echo ""
    cat "$path"
  } > "$tmp"
  echo "Creating $idx: $title"
  url=$(gh issue create --repo "$REPO" --title "Amanoba: $title" --body-file "$tmp")
  num="${url##*/}"
  echo "  -> #$num"
  add_to_board "$num" "Backlog (SOONER)"
  rm -f "$tmp"
done

echo "Done. Epic #$EPIC_NUM"
