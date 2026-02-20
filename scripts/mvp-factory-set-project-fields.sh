#!/usr/bin/env bash
# Set MVP Factory Board project fields (Status, Agent, Product, Type, Priority) for an issue.
# Reads current state from the project first; only updates fields you explicitly pass (--flag or env).
# Other fields are left unchanged (no overwrite). Requires: gh (GitHub CLI) with project scope, jq.
# One-time: gh auth refresh -h github.com -s read:project,project
# Usage: ./scripts/mvp-factory-set-project-fields.sh ISSUE_NUMBER [--status STATUS] [--agent AGENT] [--product PRODUCT] [--type TYPE] [--priority PRIORITY]
# Env overrides (only for fields you pass): MVP_STATUS, MVP_AGENT, MVP_PRODUCT, MVP_TYPE, MVP_PRIORITY

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULTS_FILE="$SCRIPT_DIR/mvp-factory-defaults.env"
PROJECT_OWNER="${MVP_PROJECT_OWNER:-moldovancsaba}"
REPO_NAME="${MVP_REPO:-mvp-factory-control}"
PROJECT_NUM="${MVP_PROJECT_NUMBER:-1}"

# Overrides: only set when user passes --flag (or env for that field)
OVERRIDE_STATUS=""
OVERRIDE_AGENT=""
OVERRIDE_PRODUCT=""
OVERRIDE_TYPE=""
OVERRIDE_PRIORITY=""

# Parse args first (only flags set overrides)
ISSUE_NUM=""
while [ $# -gt 0 ]; do
  case "$1" in
    --status)   OVERRIDE_STATUS="$2";   shift 2 ;;
    --agent)    OVERRIDE_AGENT="$2";    shift 2 ;;
    --product)  OVERRIDE_PRODUCT="$2";  shift 2 ;;
    --type)     OVERRIDE_TYPE="$2";     shift 2 ;;
    --priority) OVERRIDE_PRIORITY="$2"; shift 2 ;;
    *)          ISSUE_NUM="$1"; shift ;;
  esac
done

# Env overrides (if set, count as explicit override so we don't overwrite with default)
[ -n "${MVP_STATUS:+x}" ]    && OVERRIDE_STATUS="${OVERRIDE_STATUS:-$MVP_STATUS}"
[ -n "${MVP_AGENT:+x}" ]     && OVERRIDE_AGENT="${OVERRIDE_AGENT:-$MVP_AGENT}"
[ -n "${MVP_PRODUCT:+x}" ]   && OVERRIDE_PRODUCT="${OVERRIDE_PRODUCT:-$MVP_PRODUCT}"
[ -n "${MVP_TYPE:+x}" ]      && OVERRIDE_TYPE="${OVERRIDE_TYPE:-$MVP_TYPE}"
[ -n "${MVP_PRIORITY:+x}" ]  && OVERRIDE_PRIORITY="${OVERRIDE_PRIORITY:-$MVP_PRIORITY}"

# Load defaults (used only when field has no override and no current value on the board)
if [ -f "$DEFAULTS_FILE" ]; then
  set -a
  # shellcheck source=./mvp-factory-defaults.env
  source "$DEFAULTS_FILE"
  set +a
fi
DEFAULT_STATUS="${MVP_STATUS:-Backlog}"
DEFAULT_AGENT="${MVP_AGENT:-Tribeca}"
DEFAULT_PRODUCT="${MVP_PRODUCT:-amanoba}"
DEFAULT_TYPE="${MVP_TYPE:-Feature}"
DEFAULT_PRIORITY="${MVP_PRIORITY:-P0}"

if [ -z "$ISSUE_NUM" ] || ! [ "$ISSUE_NUM" -eq "$ISSUE_NUM" ] 2>/dev/null; then
  echo "Usage: $0 ISSUE_NUMBER [--status STATUS] [--agent AGENT] [--product PRODUCT] [--type TYPE] [--priority PRIORITY]" >&2
  echo "Only passed fields are updated; others stay as on the board. Env: MVP_STATUS, MVP_AGENT, etc." >&2
  exit 1
fi

# Require project scope (one-time: see docs/MVP_FACTORY_PROJECT_SETUP.md)
if ! gh auth status 2>/dev/null | grep -q 'project\|read:project'; then
  echo "GitHub CLI needs project scope. Run once: gh auth refresh -h github.com -s read:project,project" >&2
  echo "See docs/MVP_FACTORY_PROJECT_SETUP.md" >&2
  exit 1
fi

# 1) Project ID (user project)
PROJECT_ID=$(gh api graphql -f query='
query($owner: String!, $num: Int!) {
  user(login: $owner) { projectV2(number: $num) { id } }
}' -f owner="$PROJECT_OWNER" -F num="$PROJECT_NUM" --jq '.data.user.projectV2.id')
if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "null" ]; then
  echo "Failed to get project ID (check project number and gh auth: need read:project scope)" >&2
  exit 1
fi

# 2) Project fields (id, name, single-select options)
FIELDS_JSON=$(gh api graphql -f query='
query($projectId: ID!) {
  node(id: $projectId) {
    ... on ProjectV2 {
      fields(first: 20) {
        nodes {
          ... on ProjectV2Field { id name }
          ... on ProjectV2SingleSelectField { id name options { id name } }
        }
      }
    }
  }
}' -f projectId="$PROJECT_ID" --jq '.data.node.fields.nodes')

# 3) Issue node ID
ISSUE_NODE_ID=$(gh api graphql -f query='
query($owner: String!, $repo: String!, $num: Int!) {
  repository(owner: $owner, name: $repo) { issue(number: $num) { id } }
}' -f owner="$PROJECT_OWNER" -f repo="$REPO_NAME" -F num="$ISSUE_NUM" --jq '.data.repository.issue.id')
if [ -z "$ISSUE_NODE_ID" ] || [ "$ISSUE_NODE_ID" = "null" ]; then
  echo "Failed to get issue node ID for $REPO_NAME #$ISSUE_NUM" >&2
  exit 1
fi

# 4) Add issue to project (returns existing item ID if already added)
ITEM_ID=$(gh api graphql -f query='
mutation($projectId: ID!, $contentId: ID!) {
  addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) { item { id } }
}' -f projectId="$PROJECT_ID" -f contentId="$ISSUE_NODE_ID" --jq '.data.addProjectV2ItemById.item.id')

# 5) Get current field values for this item (so we don't overwrite what other agents set)
CURRENT_VALUES_JSON=$(gh api graphql -f query='
query($itemId: ID!) {
  node(id: $itemId) {
    ... on ProjectV2Item {
      fieldValues(first: 20) {
        nodes {
          ... on ProjectV2ItemFieldSingleSelectValue {
            name
            field { ... on ProjectV2FieldCommon { name } }
          }
        }
      }
    }
  }
}' -f itemId="$ITEM_ID" --jq '.data.node.fieldValues.nodes')

# Helper: get current option name for a field from the item's current values
get_current_value() {
  local field_name="$1"
  echo "$CURRENT_VALUES_JSON" | jq -r --arg fn "$field_name" '
    .[] | select(.field.name == $fn) | .name // empty
  ' | head -1 | tr -d '\n\r'
}

# Resolve each field: override > current on board > default
STATUS="${OVERRIDE_STATUS:-$(get_current_value "Status")}"
STATUS="${STATUS:-$DEFAULT_STATUS}"
AGENT="${OVERRIDE_AGENT:-$(get_current_value "Agent")}"
AGENT="${AGENT:-$DEFAULT_AGENT}"
PRODUCT="${OVERRIDE_PRODUCT:-$(get_current_value "Product")}"
PRODUCT="${PRODUCT:-$DEFAULT_PRODUCT}"
TYPE="${OVERRIDE_TYPE:-$(get_current_value "Type")}"
TYPE="${TYPE:-$DEFAULT_TYPE}"
PRIORITY="${OVERRIDE_PRIORITY:-$(get_current_value "Priority")}"
PRIORITY="${PRIORITY:-$DEFAULT_PRIORITY}"

echo "Issue: $REPO_NAME #$ISSUE_NUM -> Status=$STATUS, Agent=$AGENT, Product=$PRODUCT, Type=$TYPE, Priority=$PRIORITY"

# Helper: get option ID for a field by option name (case-insensitive); output trimmed (no newline)
get_option_id() {
  local field_name="$1"
  local option_name="$2"
  echo "$FIELDS_JSON" | jq -r --arg fn "$field_name" --arg on "$option_name" '
    .[] | select(.name == $fn) | .options // [] | .[] | select(.name | ascii_downcase == ($on | ascii_downcase)) | .id
  ' | head -1 | tr -d '\n\r'
}

# Helper: get field ID by name
get_field_id() {
  local field_name="$1"
  echo "$FIELDS_JSON" | jq -r --arg fn "$field_name" '.[] | select(.name == $fn) | .id' | head -1 | tr -d '\n\r'
}

# Helper: set single-select field
set_single_select() {
  local field_name="$1"
  local option_name="$2"
  local fid oid
  fid=$(get_field_id "$field_name")
  oid=$(get_option_id "$field_name" "$option_name")
  if [ -z "$fid" ]; then
    echo "Field not found: $field_name" >&2
    return 1
  fi
  if [ -z "$oid" ]; then
    echo "Option not found for $field_name: $option_name" >&2
    return 1
  fi
  gh api graphql -f projectId="$PROJECT_ID" -f itemId="$ITEM_ID" -f fieldId="$fid" -f optionId="$oid" -f query='
  mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
    updateProjectV2ItemFieldValue(input: { projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: { singleSelectOptionId: $optionId } }) {
      projectV2Item { id }
    }
  }' --jq '.data.updateProjectV2ItemFieldValue.projectV2Item.id' >/dev/null
  echo "Set $field_name = $option_name"
}

# 6) Set each field to resolved value (override > current > default). Skip if unchanged.
set_if_changed() {
  local field_name="$1"
  local resolved_value="$2"
  local current_value
  current_value=$(get_current_value "$field_name")
  if [ "$resolved_value" = "$current_value" ]; then
    echo "Keep $field_name = $resolved_value (unchanged)"
  else
    set_single_select "$field_name" "$resolved_value"
  fi
}
set_if_changed "Status"   "$STATUS"
set_if_changed "Agent"    "$AGENT"
set_if_changed "Product" "$PRODUCT"
set_if_changed "Type"     "$TYPE"
set_if_changed "Priority" "$PRIORITY"

echo "Done. Board: https://github.com/users/$PROJECT_OWNER/projects/$PROJECT_NUM"
