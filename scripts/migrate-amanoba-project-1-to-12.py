#!/usr/bin/env python3
"""Move canonical Amanoba issues from GitHub Project 1 to Project 12.

Criteria: mvp-factory-control issues matching `amanoba in:title,body`, excluding
`amanoba_courses:` titles. Preserves Status from Project 1 and removes cards from
Project 1 after adding to Project 12.

Usage:
  python3 scripts/migrate-amanoba-project-1-to-12.py
  python3 scripts/migrate-amanoba-project-1-to-12.py --dry-run
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time

OWNER = "moldovancsaba"
REPO = "mvp-factory-control"
P1_NUM = 1
P12_NUM = 12
REQUEST_DELAY_SEC = 0.75


def run(cmd: list[str]) -> str:
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\n{result.stderr}")
    return result.stdout


def gh_graphql(query: str, variables: dict | None = None, retries: int = 8) -> dict:
    for attempt in range(retries):
        cmd = ["gh", "api", "graphql", "-f", f"query={query}"]
        if variables:
            for key, value in variables.items():
                if isinstance(value, int):
                    cmd.extend(["-F", f"{key}={value}"])
                else:
                    cmd.extend(["-f", f"{key}={value}"])
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            if "rate limit" in result.stderr.lower() and attempt < retries - 1:
                wait = min(60 * (attempt + 1), 300)
                print(f"Rate limited; sleeping {wait}s...", file=sys.stderr)
                time.sleep(wait)
                continue
            raise RuntimeError(result.stderr)
        data = json.loads(result.stdout)
        if data.get("errors"):
            message = json.dumps(data["errors"], indent=2)
            if "rate limit" in message.lower() and attempt < retries - 1:
                wait = min(60 * (attempt + 1), 300)
                print(f"Rate limited; sleeping {wait}s...", file=sys.stderr)
                time.sleep(wait)
                continue
            raise RuntimeError(message)
        time.sleep(REQUEST_DELAY_SEC)
        return data
    raise RuntimeError("GraphQL retries exhausted")


def fetch_project_items(project_num: int) -> tuple[dict, list[dict]]:
    query = """
    query($num: Int!, $cursor: String) {
      user(login: "moldovancsaba") {
        projectV2(number: $num) {
          id
          title
          fields(first: 30) {
            nodes {
              ... on ProjectV2SingleSelectField { id name options { id name } }
            }
          }
          items(first: 100, after: $cursor) {
            nodes {
              id
              fieldValues(first: 20) {
                nodes {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                    field { ... on ProjectV2FieldCommon { name } }
                  }
                }
              }
              content {
                ... on Issue {
                  id
                  number
                  title
                  repository { nameWithOwner }
                }
              }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
      }
    }
    """
    items: list[dict] = []
    cursor: str | None = None
    meta: dict | None = None
    while True:
        data = gh_graphql(query, {"num": project_num, "cursor": cursor or ""})
        project = data["data"]["user"]["projectV2"]
        if meta is None:
            meta = {
                "id": project["id"],
                "title": project["title"],
                "fields": project["fields"]["nodes"],
            }
        items.extend(project["items"]["nodes"])
        page_info = project["items"]["pageInfo"]
        if not page_info["hasNextPage"]:
            break
        cursor = page_info["endCursor"]
    assert meta is not None
    return meta, items


def get_field_values(item: dict) -> dict[str, str]:
    values: dict[str, str] = {}
    for field_value in item.get("fieldValues", {}).get("nodes", []):
        if field_value and field_value.get("field") and field_value.get("name"):
            values[field_value["field"]["name"]] = field_value["name"]
    return values


def get_status_field(meta: dict) -> dict | None:
    for field in meta["fields"]:
        if field.get("name") == "Status":
            return field
    return None


def option_id(status_field: dict, status_name: str | None) -> str | None:
    if not status_name:
        return None
    for option in status_field.get("options", []):
        if option["name"].lower() == status_name.lower():
            return option["id"]
    return None


def canonical_amanoba_issue_numbers() -> set[int]:
    search_out = run(
        [
            "gh",
            "issue",
            "list",
            "--repo",
            f"{OWNER}/{REPO}",
            "--state",
            "all",
            "--search",
            "amanoba in:title,body",
            "--limit",
            "200",
            "--json",
            "number,title",
        ]
    )
    numbers: set[int] = set()
    for item in json.loads(search_out):
        if item["title"].lower().startswith("amanoba_courses:"):
            continue
        numbers.add(item["number"])
    return numbers


ADD_MUTATION = """
mutation($projectId: ID!, $contentId: ID!) {
  addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
    item { id }
  }
}
"""

SET_STATUS = """
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
  updateProjectV2ItemFieldValue(input: {
    projectId: $projectId, itemId: $itemId, fieldId: $fieldId,
    value: { singleSelectOptionId: $optionId }
  }) { projectV2Item { id } }
}
"""

DELETE_ITEM = """
mutation($projectId: ID!, $itemId: ID!) {
  deleteProjectV2Item(input: { projectId: $projectId, itemId: $itemId }) {
    deletedItemId
  }
}
"""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    canonical = canonical_amanoba_issue_numbers()
    print(f"Canonical Amanoba issues: {len(canonical)}")

    p1_meta, p1_items = fetch_project_items(P1_NUM)
    p12_meta, p12_items = fetch_project_items(P12_NUM)
    print(f"Project 1: {p1_meta['title']} ({len(p1_items)} items)")
    print(f"Project 12: {p12_meta['title']} ({len(p12_items)} items)")

    p1_by_num: dict[int, dict] = {}
    for item in p1_items:
        content = item.get("content") or {}
        if (
            content.get("number")
            and content.get("repository", {}).get("nameWithOwner") == f"{OWNER}/{REPO}"
        ):
            p1_by_num[content["number"]] = item

    p12_nums = {
        (item.get("content") or {}).get("number")
        for item in p12_items
        if (item.get("content") or {}).get("number")
    }

    to_migrate = []
    for number in sorted(canonical):
        if number not in p1_by_num:
            continue
        item = p1_by_num[number]
        fields = get_field_values(item)
        to_migrate.append(
            {
                "number": number,
                "issue_id": item["content"]["id"],
                "p1_item_id": item["id"],
                "title": item["content"]["title"],
                "status": fields.get("Status"),
                "already_on_p12": number in p12_nums,
            }
        )

    print(f"Remaining on Project 1 to migrate: {len(to_migrate)}")
    if args.dry_run:
        for entry in to_migrate:
            action = "ensure on P12" if entry["already_on_p12"] else "add to P12"
            print(f"  #{entry['number']}: {action}, remove from P1, status={entry['status']}")
        return 0

    status_field = get_status_field(p12_meta)
    if not status_field:
        print("Status field not found on Project 12", file=sys.stderr)
        return 1

    added = 0
    removed = 0
    errors: list[str] = []

    for entry in to_migrate:
        number = entry["number"]
        try:
            if entry["already_on_p12"]:
                p12_item_id = next(
                    item["id"]
                    for item in p12_items
                    if (item.get("content") or {}).get("number") == number
                )
            else:
                data = gh_graphql(
                    ADD_MUTATION,
                    {"projectId": p12_meta["id"], "contentId": entry["issue_id"]},
                )
                p12_item_id = data["data"]["addProjectV2ItemById"]["item"]["id"]
                added += 1
                print(f"ADD #{number} -> P12")

            status = entry["status"]
            if status:
                option = option_id(status_field, status)
                if option:
                    gh_graphql(
                        SET_STATUS,
                        {
                            "projectId": p12_meta["id"],
                            "itemId": p12_item_id,
                            "fieldId": status_field["id"],
                            "optionId": option,
                        },
                    )
                else:
                    errors.append(f"#{number}: unknown status '{status}' on P12")

            gh_graphql(
                DELETE_ITEM,
                {"projectId": p1_meta["id"], "itemId": entry["p1_item_id"]},
            )
            removed += 1
            print(f"REMOVE #{number} from P1")
        except Exception as exc:  # noqa: BLE001 - operational script
            errors.append(f"#{number}: {exc}")
            print(f"ERROR #{number}: {exc}", file=sys.stderr)

    print("\n=== SUMMARY ===")
    print(f"Added to Project 12: {added}")
    print(f"Removed from Project 1: {removed}")
    print(f"Errors: {len(errors)}")
    for error in errors:
        print(f"  - {error}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
