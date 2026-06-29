# Morganise 🤖

> Making the world a better place, one commit at a time.

This package is a love letter to a good friend and colleague, Morgan. It enforces a strict, guided process for crafting Git commit messages that keep Morgan happy: a required issue/ticket reference, a concise commit title (validated against length limits), and a structured list of work items.

No more empty, lazy, or messy commit messages. Let's make Morgan proud!

---

## Why Descriptive Commits Matter

Writing good, descriptive git commit messages is not just about keeping Morgan happy—it's a critical engineering practice:

1. **Self-Documenting Codebase**: Well-structured commit messages explain *why* a change was made, which is often missing from the code itself. Months down the road, this history is invaluable for anyone running `git blame`.
2. **Effortless Debugging**: When debugging a regression, detailed commit histories make tools like `git bisect` incredibly powerful, letting you pinpoint precisely where and why a bug was introduced.
3. **Smoother Code Reviews**: Descriptive titles and lists of changes give reviewers context immediately before they even look at the diff, leading to faster approvals.
4. **Automated Release Notes**: Using structured prefixes and task references enables tools to parse your git history and automatically generate clean changelogs and release documentation.

---

## Features

- **Interactive Commit Wizard**: Run `morganise` to construct a perfect commit message step-by-step.
- **Git Hook Integration**: Run as a Git hook (e.g. `prepare-commit-msg`) to intercept commits and require Morganization.
- **Dynamic Git Remote Detection**: Automatically reads your git origin configuration to insert your actual repo name (`org/repo#issue`) in the commit body, defaulting to `your-org/your-repo` if not inside a git repo.
- **Copy & Commit Helpers**: Copy your newly Morganized message to the clipboard or directly commit it!
- **Local Configurations**: Customize character limits and default fallbacks.
- **Zero-Dependency**: Written entirely in native Node.js for lightning-fast installation and maximum security.

---

## Installation

### Globally (CLI use)
You can run it globally with `npx` (no installation required) or install it globally:
```bash
# Run instantly with npx
npx morganise

# Or install globally
npm install -g morganise
morganise
```

### Locally (in your project)
To include it in your project's dev dependencies:
```bash
npm install --save-dev morganise
```

---

## How it Works (Interactive Mode)

When you run `morganise`, it starts an interactive CLI wizard:

1. **Ticket/issue number**: Enforces entering a valid issue number (e.g., `402`).
2. **Commit title**: Prompt for a brief title. It must be non-empty and fits within the configured character limit (default is `30` characters, because Morgan says long titles make him sad).
3. **Work items**: Prompt you to specify work items one by one. Empty inputs are rejected. Type `done` to finish.

At the end, your commit message is formatted beautifully:
```text
Here is your Morganized commit message:
--------------------------------------

[Title]
Issue: org/repo#[IssueNumber]

- Work item 1
- Work item 2

--------------------------------------
Merci!
```
It finishes by showing a beautiful, colorized ASCII art of Morgan's face!

---

## Git Hook Setup

To force developers to use `morganise` before every commit, you can set it up as a Git commit hook.

### Using Husky (Recommended)
1. Install Husky in your project:
   ```bash
   npx husky-init && npm install
   ```
2. Add `morganise` to your `prepare-commit-msg` hook:
   ```bash
   npx husky add .husky/prepare-commit-msg 'exec < /dev/tty && npx morganise "$1"'
   ```
   *(Note: The `exec < /dev/tty` command redirects stdin to the terminal so you can answer the interactive prompts during a git commit).*

### Native Git Hook
Create a file named `prepare-commit-msg` in your `.git/hooks/` directory:
```bash
#!/bin/sh
exec < /dev/tty
npx morganise "$1"
```
Make it executable:
```bash
chmod +x .git/hooks/prepare-commit-msg
```

---

## Configuration

You can configure `morganise` by adding a `"morganise"` config block to your `package.json` or by creating a `.morganiserc` / `.morganiserc.json` in the root of your project:

### In `package.json`:
```json
{
  "name": "my-project",
  "morganise": {
    "repo": "my-org/my-repo",
    "limit": 50,
    "issueTemplate": "Issue: {repo}#{issue}",
    "issuePrompt": "Ticket ID"
  }
}
```

### In `.morganiserc.json`:
```json
{
  "repo": "my-org/my-repo",
  "limit": 50,
  "issueTemplate": "Issue: {repo}#{issue}",
  "issuePrompt": "Ticket ID"
}
```

- **`repo`** (string): Fallback repository path if not auto-detected by Git config. (Default: `your-org/your-repo`)
- **`limit`** (number): Character limit for the commit title. (Default: `30`)
- **`issueTemplate`** (string): Template for rendering the issue/ticket reference line in the commit message. You can use placeholder tags `{repo}` and `{issue}` which will be replaced with the current project repository and user-entered issue number. (Default: `"Issue: {repo}#{issue}"`)
- **`issuePrompt`** (string): The label displayed in the interactive prompt when asking for the issue/ticket reference. (Default: `"Ticket/issue number"`)

---

## License

This project is licensed under the MIT License.
