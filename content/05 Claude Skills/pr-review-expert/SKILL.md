---
name: pr-review-expert
description: Structured code review for PRs/MRs. Blast radius analysis, security scanning, breaking change detection, test coverage delta, performance impact assessment. Produces a 30+ item review checklist.
source: claude-skills/engineering/skills/pr-review-expert/SKILL.md
audience: lab
status: experimental
imported: 2026-05-19
keywords: code-review, security, qa, blast-radius, testing
---

## 🇹🇼 中文摘要

**這個是什麼：** AI 當資深工程師 review 你 PR / diff，找 bug / security / 風格問題，產出 30+ 項 checklist。

**何時用：**
- 合 PR 前、自己 commit 前自查
- 給 lab 4 人 review 學習
- 大 PR（>200 行）需結構化檢視
- 摸到 vault / extension protocol / kit-bridge 時必過

**核心步驟：**
- 讀 diff → 拆解衝擊面（blast radius）
- 多視角 check（安全 / 風格 / 測試 / edge case）
- 檢查 DNA 一致性、AUTHORING.md 格式、extension protocol 完整性
- 給具體 actionable comment

**VisTwin 對位：** 一人公司沒人 review，AI 補位；外加檢查 AUTHORING.md / DNA 一致 / vault schema / extension protocol 完整性。

---

> 完整英文內容如下 ↓

## VisTwin Context

Every PR touching VisTwin codebase must verify:
1. **DNA system consistency** — does this change align with existing GlassCard patterns, Lifecycle metadata, or environment abstractions?
2. **AUTHORING.md compliance** — does the commit message follow VisTwin conventions? Are file structure changes documented?
3. **Extension protocol integrity** — if dashboard-related, verify _window + _open_window + 3 dicts registration still works
4. **IPC messaging contract** — if kit-bridge related, verify file IPC paths and message shape match [[project_kit_bridge]]

Default check scope: before merging ANY PR to `main` or `develop`.

## When to Use

- **Before merging any PR/MR that touches**:
  - Shared libraries (vault schema, ontology patterns)
  - APIs or contracts (dashboard extension protocol, kit-bridge messaging)
  - Database schema or migrations
  - Authentication, authorization, or security-sensitive paths
  
- **When a PR is large** (>200 lines changed) and needs structured review
- **Onboarding new contributors** whose PRs need thorough feedback
- **After an incident** — review similar PRs proactively
- **VisTwin-specific**: Before deploying to customer environments (寶舖案 integration)

## Fetching the Diff

### GitHub (gh CLI)
```bash
# View diff in terminal
gh pr diff <PR_NUMBER>

# Get PR metadata
gh pr view <PR_NUMBER> --json title,body,labels,assignees,milestone

# List files changed
gh pr diff <PR_NUMBER> --name-only

# Check CI status
gh pr checks <PR_NUMBER>

# Download diff to file
gh pr diff <PR_NUMBER> > /tmp/pr-<PR_NUMBER>.diff
```

### GitLab (glab CLI)
```bash
# View MR diff
glab mr diff <MR_IID>

# MR details as JSON
glab mr view <MR_IID> --output json

# List changed files
glab mr diff <MR_IID> --name-only

# Download diff
glab mr diff <MR_IID> > /tmp/mr-<MR_IID>.diff
```

## Workflow

### Step 1 — Fetch Context

```bash
PR=123
gh pr view $PR --json title,body,labels,milestone,assignees | jq .
gh pr diff $PR --name-only
gh pr diff $PR > /tmp/pr-$PR.diff
```

### Step 2 — Blast Radius Analysis

For each changed file, identify:

1. **Direct dependents** — who imports this file?
```bash
# Find all files importing a changed module
grep -r "from ['\"].*changed-module['\"]" src/ --include="*.ts" -l
grep -r "require(['\"].*changed-module" src/ --include="*.js" -l
```

2. **Service boundaries** — does this change cross services?
```bash
# Check if changed files span multiple services
gh pr diff $PR --name-only | cut -d/ -f1-2 | sort -u
```

3. **Shared contracts** — types, interfaces, schemas
```bash
gh pr diff $PR --name-only | grep -E "types/|interfaces/|schemas/|models/"
```

**VisTwin-specific blast radius checks**:
- Does this change the [[extension_protocol]]? (If so, verify all 3 dicts still register)
- Does this change vault schema? (If so, migration plan + rollback tested?)
- Does this change kit-app-template IPC? (If so, verify [[project_kit_bridge]] paths still resolve)

**Blast radius severity**:
- **CRITICAL** — shared library, DB model, auth middleware, API contract, extension protocol
- **HIGH** — service used by >3 others, shared config, env vars, vault schema
- **MEDIUM** — single service internal change, utility function
- **LOW** — UI component, test file, docs

### Step 3 — Security Scan

```bash
DIFF=/tmp/pr-$PR.diff

# SQL Injection
grep -n "query\|execute\|raw(" $DIFF | grep -E '\$\{|f"|%s|format\('

# Hardcoded secrets
grep -nE "(password|secret|api_key|token|private_key)\s*=\s*['\"][^'\"]{8,}" $DIFF

# XSS vectors
grep -n "dangerouslySetInnerHTML\|innerHTML\s*=" $DIFF

# Auth bypass patterns
grep -n "bypass\|skip.*auth\|noauth\|TODO.*auth" $DIFF

# Insecure hash algorithms
grep -nE "md5\(|sha1\(|createHash\(['\"]md5|createHash\(['\"]sha1" $DIFF
```

### Step 4 — Test Coverage Delta

```bash
# Count source vs test files changed
CHANGED_SRC=$(gh pr diff $PR --name-only | grep -vE "\.test\.|\.spec\.|__tests__")
CHANGED_TESTS=$(gh pr diff $PR --name-only | grep -E "\.test\.|\.spec\.|__tests__")

echo "Source files changed: $(echo "$CHANGED_SRC" | wc -w)"
echo "Test files changed:   $(echo "$CHANGED_TESTS" | wc -w)"

# Run coverage
npm test -- --coverage --changedSince=main 2>/dev/null | tail -20
```

**Coverage rules**:
- New function without tests → flag
- Deleted tests without deleted code → flag
- Coverage drop >5% → block merge
- Auth/payments paths → require 100% coverage

### Step 5 — Breaking Change Detection

#### API Contract Changes
```bash
# Route removals or renames
grep "^-" /tmp/pr-$PR.diff | grep -E "router\.(get|post|put|delete|patch)\("

# TypeScript interface removals
grep "^-" /tmp/pr-$PR.diff | grep -E "^-\s*(export\s+)?(interface|type) "
```

#### DB Schema Changes
```bash
# Migration files added
gh pr diff $PR --name-only | grep -E "migrations?/|alembic/"

# Destructive operations
grep -E "DROP TABLE|DROP COLUMN|ALTER.*NOT NULL|TRUNCATE" /tmp/pr-$PR.diff
```

#### Config / Env Var Changes
```bash
# New env vars
grep "^+" /tmp/pr-$PR.diff | grep -oE "process\.env\.[A-Z_]+" | sort -u

# Removed env vars
grep "^-" /tmp/pr-$PR.diff | grep -oE "process\.env\.[A-Z_]+" | sort -u
```

### Step 6 — VisTwin-Specific Checks

#### AUTHORING.md Compliance
- Commit message format: `<type>(<scope>): <subject>`
- Scope examples: `vault`, `dashboard`, `extension-protocol`, `kit-bridge`
- Breaking changes marked with `!` or explicit in body

#### DNA System Consistency
- GlassCard theme variables used correctly?
- Lifecycle metadata pattern preserved?
- Live Environment card state management aligned?

#### Extension Protocol Integrity
- If dashboard-related: verify `_window` + `_open_window` still callable
- Verify all 3 dicts (manifest, config, lifecycle) properly registered
- Check IPC message shapes match specification

#### Kit Bridge IPC
- If kit-app-template touched: verify paths resolve correctly (`kit-app-template/_repl/...`)
- Message shape (request/response) validated?
- Error handling for IPC failures present?

### Complete Review Checklist

```markdown
## Code Review Checklist

### Scope & Context
- [ ] PR title accurately describes the change
- [ ] PR description explains WHY, not just WHAT
- [ ] Linked Jira/Linear ticket exists and matches scope
- [ ] No unrelated changes (scope creep)
- [ ] Breaking changes documented in PR body

### Blast Radius (VisTwin-specific)
- [ ] If touching vault: migration plan documented
- [ ] If touching extension protocol: 3 dicts still register
- [ ] If touching kit-bridge: IPC paths verified
- [ ] Identified all files importing changed modules
- [ ] Cross-service dependencies checked
- [ ] New env vars documented in .env.example

### Security
- [ ] No hardcoded secrets or API keys
- [ ] SQL queries use parameterized inputs
- [ ] User inputs validated/sanitized
- [ ] Auth/authorization checks on all new endpoints
- [ ] No XSS vectors
- [ ] New dependencies checked for known CVEs

### Testing
- [ ] New public functions have unit tests
- [ ] Edge cases covered
- [ ] Error paths tested
- [ ] Integration tests for API endpoint changes
- [ ] No tests deleted without clear reason

### Breaking Changes
- [ ] No API endpoints removed without deprecation
- [ ] No required fields added to existing API responses
- [ ] No DB columns removed without two-phase migration
- [ ] No env vars removed that may be set in production

### Code Quality
- [ ] No dead code or unused imports
- [ ] Error handling present (no bare empty catch blocks)
- [ ] Consistent with existing patterns and conventions
- [ ] Complex logic has explanatory comments
```

## VisTwin Adaptation

**Additional checks before approving**:
- [ ] Commit message follows AUTHORING.md format
- [ ] DNA system patterns (GlassCard, Lifecycle) preserved
- [ ] If extension protocol touched: test via [[extension_protocol]] integration
- [ ] If vault touched: schema change reversible + rollback tested?
- [ ] If kit-bridge touched: IPC paths match [[project_kit_bridge]]

**Integration with other skills**:
- [[spec-driven-workflow]] — verify implementation matches approved spec
- [[rag-architect]] — if PR adds retrieval logic (vault knowledge system)

## Common Pitfalls

- **Reviewing style over substance** — let the linter handle style
- **Missing blast radius** — a 5-line change in a shared utility can break 20 services
- **Approving untested happy paths** — always verify error paths have coverage
- **Ignoring migration risk** — NOT NULL additions need a default or two-phase migration
- **Skipping large PRs** — if a PR is too large to review, request it be split

## Best Practices

1. Read the linked ticket before looking at code
2. Check CI status before reviewing
3. Prioritize blast radius and security over style
4. Reproduce locally for non-trivial auth or performance changes
5. Batch all comments in one review round
6. Acknowledge good patterns, not just problems
