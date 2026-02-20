# MVP Factory Project — one-time setup (grant project scope)

To allow scripts and agents to **set project fields** (Status, Agent, Product, Type, Priority) on the [MVP Factory Board](https://github.com/users/moldovancsaba/projects/1) from this repo, the GitHub CLI token must include **project** scope.

## One-time step

Run in a terminal (you will need to complete the browser step):

```bash
gh auth refresh -h github.com -s read:project,project
```

- Follow the prompt: copy the one-time code, open the URL in your browser, enter the code, and approve the scopes.
- After that, `gh` will use the new token and scripts in this repo can read/update the project.

## Verify

```bash
gh auth status
```

You should see `project` (or at least `read:project`) in **Token scopes**.

## What uses this

- **scripts/mvp-factory-set-project-fields.sh** — sets Status, Agent, Product, Type, Priority on a project item (issue).
- Any future automation that adds issues to the project or updates card fields via `gh api graphql`.

You only need to run the refresh once per machine (or when the token is rotated).
