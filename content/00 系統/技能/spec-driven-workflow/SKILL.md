---
name: spec-driven-workflow
description: Write specifications BEFORE code. Define acceptance criteria, plan features with Given/When/Then format, generate tests from specs, follow spec-first development.
source: claude-skills/engineering/skills/spec-driven-workflow/SKILL.md
audience: lab
status: experimental
imported: 2026-05-19
keywords: specification, acceptance-criteria, tdd, requirements, scope-control
---

## 🇹🇼 中文摘要

**這個是什麼：** 開始寫 code 前**先寫 spec + acceptance criteria + test**，鎖 scope 避免飄，然後才實裝。

**何時用：**
- 每個有客戶交付物的 task（寶舖案 milestone）
- 模糊需求、scope creep 風險高時
- 跨團隊協作時（A 要等 B）
- API contract / DB schema 異動時

**核心步驟：**
- 蒐集需求 → 寫 spec.md（9 個 mandatory section）
- 列 acceptance criteria（Given/When/Then）
- 寫 test stub（全部先紅）
- **客戶 / 你自己 approve spec** ← 關鍵門檻
- 才 implement 讓 test pass

**VisTwin 對位：** 寶舖案每個 milestone、FDE deployment 標準流程、設計公司簽收門檻（Frncs approve → Agent A/B/C implement）。

---

> 完整英文內容如下 ↓

## VisTwin Context

Every new feature in VisTwin (寶舖案 integration, FDE deployment, ontology evolution, dashboard enhancement) MUST start with an approved spec document BEFORE any code is written.

**Key principle**: No code without an approved spec. No exceptions. No "quick prototypes." No "I'll document it later."

**Default stakeholders**:
- Frncs (spec approval)
- Agents A/B/C (implementation teams)
- Customer (for 寶舖案 features)

**Integration timeline**:
- Week 1: Write + validate spec
- Week 2: Generate tests from spec
- Week 3+: Implement to make tests pass

## When to Use

- **Starting a new feature** — no matter how "simple" it seems
- **Making API contract changes** — if external systems depend on this, spec it first
- **Changing database schema** — especially migrations affecting customer deployments
- **Cross-team coordination** — if Agent A needs Agent B's changes, specs must align first
- **Customer-facing features** — 寶舖案 work ALWAYS requires spec + customer approval
- **Performance or security work** — establish measurable goals upfront

## The Iron Law

```
NO CODE WITHOUT AN APPROVED SPEC.
NO EXCEPTIONS. NO "QUICK PROTOTYPES." NO "I'LL DOCUMENT IT LATER."
```

## The Spec Format

Every spec follows this mandatory structure. No sections are optional.

| # | Section | Key Rules |
|---|---------|-----------|
| 1 | **Title and Metadata** | Author, date, status (Draft/In Review/Approved/Superseded), reviewers |
| 2 | **Context** | Why this feature exists. 2-4 paragraphs with evidence (metrics, tickets). |
| 3 | **Functional Requirements** | RFC 2119 keywords (MUST/SHOULD/MAY). Numbered FR-N. Each is atomic and testable. |
| 4 | **Non-Functional Requirements** | Performance, security, accessibility, scalability, reliability — all with measurable thresholds. |
| 5 | **Acceptance Criteria** | Given/When/Then format. Every AC references at least one FR-* or NFR-*. |
| 6 | **Edge Cases** | Numbered EC-N. Cover failure modes for every external dependency. |
| 7 | **API Contracts** | TypeScript-style interfaces. Cover success and error responses. |
| 8 | **Data Models** | Table format with field, type, constraints. Every entity from requirements must have a model. |
| 9 | **Out of Scope** | Explicit exclusions with reasons. Prevents scope creep during implementation. |

### RFC 2119 Keywords

| Keyword | Meaning |
|---------|---------|
| **MUST** | Absolute requirement. Non-conformant without it. |
| **MUST NOT** | Absolute prohibition. |
| **SHOULD** | Recommended. Omit only with documented justification. |
| **MAY** | Optional. Implementer's discretion. |

### Example Scope Sections (VisTwin)

**For 寶舖案 features**:
```
## Context
The model home (樣品屋) renovation project requires real-time visualization updates 
when construction changes are made in Revit. This spec defines how changes flow from 
Revit → Omniverse → Dashboard in < 2 seconds.

**Why now?**: Customer acceptance milestone on 2026-06-15. Without this, they cannot 
see changes live during on-site demos.

## Functional Requirements
- FR-1: MUST sync Revit camera position to Omniverse within 500ms
- FR-2: MUST display BIM metadata (room names, renovation status) in dashboard cards
- FR-3: SHOULD warn of conflicts (two rooms with same ID) in UI
- FR-4: MAY support rollback to previous Revit version

## Out of Scope
- FR-5 (animation of construction sequences) — deferred to Phase 2
- Performance optimization for >500K entities — deferred until scaling required
```

## Workflow — 6 Phases

### Phase 1: Gather Requirements

**Goal**: Understand what needs to be built and why.

1. **Interview the stakeholder** (Frncs, agent, or customer)
   - What problem does this solve?
   - Who are the users?
   - What does success look like?
   - What explicitly should NOT be built?

2. **Read existing code** — understand current system before proposing changes

3. **Identify constraints**
   - Performance budgets (< 500ms Revit → dashboard latency?)
   - Security requirements (customer data handling?)
   - Backward compatibility (breaking changes OK?)

4. **List unknowns** — every unknown is a risk. Surface now, not during implementation.

**Exit criteria**: You can explain the feature to someone unfamiliar with the project in 2 minutes.

### Phase 2: Write Spec

**Goal**: Produce a complete spec document following The Spec Format above.

1. Fill every section of the template. No section left blank.
2. Number all requirements (FR-*, NFR-*, AC-*, EC-*, OS-*)
3. Use RFC 2119 keywords precisely
4. Write acceptance criteria in **Given/When/Then** format
5. Define API contracts with TypeScript-style types
6. List explicit exclusions in Out of Scope

**Example Acceptance Criteria**:
```gherkin
## Acceptance Criteria

AC-1: Real-time camera sync (FR-1)
Given a Revit model is open in Composer with a camera at (10, 20, 30)
When the camera moves to (10, 25, 35) in Revit
Then the Omniverse viewer displays the new position within 500ms
And no latency spike occurs in kit-bridge IPC

AC-2: Conflict detection (FR-3)
Given two rooms have identical BIM IDs
When the user opens the dashboard
Then a warning card appears: "Duplicate room ID detected: fix in Revit"
And the dashboard does NOT crash
```

**Exit criteria**: The spec can be handed to a developer who was not in the requirements meeting, and they can implement without asking clarifying questions.

### Phase 3: Validate Spec

**Goal**: Verify the spec is complete, consistent, and implementable.

Manual validation checklist:
- [ ] Every functional requirement has at least one acceptance criterion
- [ ] Every acceptance criterion is testable (no subjective language like "should be fast")
- [ ] API contracts cover all endpoints mentioned in requirements
- [ ] Data models cover all entities mentioned in requirements
- [ ] Edge cases cover failure modes for every external dependency
- [ ] Out of scope is explicit about what was considered and rejected
- [ ] Non-functional requirements have measurable thresholds (< 500ms, not "fast")

**Exit criteria**: All manual checklist items pass.

### Phase 4: Generate Tests

**Goal**: Extract test cases from acceptance criteria before writing implementation code.

1. Each acceptance criterion becomes one or more test cases
2. Each edge case becomes a test case
3. Tests are stubs — they define the assertion but not the implementation
4. All tests MUST fail initially (red phase of TDD)

Example test stub (pytest):
```python
def test_camera_sync_latency():
    """AC-1: Camera moves in Revit, Omniverse updates within 500ms"""
    revit_camera = Camera(position=(10, 20, 30))
    start_time = time.time()
    
    # Trigger camera move via IPC (not implemented yet)
    response = kit_bridge.move_camera(Camera(position=(10, 25, 35)))
    elapsed = time.time() - start_time
    
    assert elapsed < 0.5, f"Latency {elapsed}ms exceeds 500ms threshold"
    assert response.status == "success"
    # Test will fail here with "not implemented"
```

**Exit criteria**: You have a test file where every test fails with "not implemented" or equivalent.

### Phase 5: Implement

**Goal**: Write code that makes failing tests pass, one acceptance criterion at a time.

1. Pick one AC (start with the simplest)
2. Make its test(s) pass with minimal code
3. Run the full test suite — no regressions
4. Commit
5. Pick the next AC. Repeat.

**Rules**:
- Do NOT implement anything not in the spec
- Do NOT optimize before all acceptance criteria pass
- Do NOT refactor before all acceptance criteria pass
- If you discover a missing requirement, STOP and update the spec first

**Exit criteria**: All tests pass. All acceptance criteria satisfied.

### Phase 6: Self-Review

**Goal**: Verify implementation matches spec before marking done.

Before marking any implementation as done, verify ALL of the following:

- [ ] **Every acceptance criterion has a passing test.** No exceptions.
- [ ] **Every edge case has a test.** EC-1 through EC-N all have corresponding test cases.
- [ ] **No scope creep.** The implementation does not include features not in the spec.
- [ ] **API contracts match implementation.** Request/response shapes match the spec exactly.
- [ ] **Error scenarios tested.** Every error response defined in the spec has a test.
- [ ] **Non-functional requirements verified.** If the spec says < 500ms, you have evidence (benchmark, profiling).
- [ ] **Data model matches.** Database schema matches the spec. No extra columns, no missing constraints.
- [ ] **Out-of-scope items not built.** Nothing from the Out of Scope section leaked into the implementation.

## Bounded Autonomy Rules

These define when an agent MUST stop and ask for guidance vs. when they can proceed.

### STOP and Ask When:

1. **Scope creep detected** — The implementation requires something not in the spec.
2. **Ambiguity exceeds 30%** — You cannot determine correct behavior for >30% of a requirement.
3. **Breaking changes required** — Change to API contract, DB schema, or public interface.
4. **Security implications** — Anything touching authentication, authorization, encryption, or PII.
5. **Performance characteristics unknown** — Spec says "< 500ms" but no way to measure.
6. **Cross-team dependencies** — Spec requires coordination with another team.

### Continue Autonomously When:

1. **Spec is clear and unambiguous** for the current task
2. **All acceptance criteria have passing tests** and you are refactoring internals
3. **Changes are non-breaking** — no public API, schema, or behavior changes
4. **Implementation is a direct translation** of a well-defined acceptance criterion
5. **Error handling follows established patterns** documented in codebase

### Escalation Protocol

When you must stop, provide:

```markdown
## Escalation: [Brief Title]

**Blocked on:** [requirement ID, e.g., FR-3]
**Question:** [Specific, answerable question]
**Options considered:**
  A. [Option] — Pros: [...] Cons: [...]
  B. [Option] — Pros: [...] Cons: [...]
**My recommendation:** [A or B, with reasoning]
**Impact of waiting:** [What is blocked until resolved?]
```

Never escalate without a recommendation. Always give options.

## VisTwin Integration

**For 寶舖案 features**:
- Spec review includes customer sign-off
- Each acceptance criterion tied to demo milestone
- Customer can see all acceptance criteria before implementation starts

**For FDE deployment**:
- Specs chain across phases (Phase 1 spec drives Phase 2 work)
- Break specs by Roadmap milestone, not by agent
- Cross-reference shared resource specs (vault, ontology, dashboard)

**Handoff to code review**:
- After implementation complete, use [[pr-review-expert]] to verify PR matches spec
- Flag any acceptance criteria NOT covered in the PR

**Handoff to testing**:
- QA uses acceptance criteria as test cases
- Each AC-* becomes a test case in the test plan

## Anti-Patterns to Avoid

1. **Coding before spec approval** — Don't start coding while the spec is being reviewed
2. **Vague acceptance criteria** — "Should work well" is untestable. Use measurable criteria.
3. **Missing edge cases** — Happy path alone is not enough. Specify error paths.
4. **Spec as post-hoc documentation** — If written after code, it's not a spec, it's documentation.
5. **Gold-plating beyond spec** — If it's not in the spec, it doesn't get built.
6. **Acceptance criteria without traceability** — Every AC-* MUST reference at least one FR-* or NFR-*
7. **Skipping validation** — Always validate before implementation. Fix warnings.

## Best Practices

1. **Start simple** — write 2-3 sentences per requirement, not essays
2. **Use Given/When/Then** — this format is testable and unambiguous
3. **Number everything** — FR-N, NFR-N, AC-N, EC-N, OS-N. Makes cross-referencing easy.
4. **Involve stakeholders early** — get buy-in during Phase 1, not after code is written
5. **Measure, don't estimate** — "fast" is subjective; "< 500ms" is measurable
6. **Document assumptions** — "Assume Omniverse server is always available" is an assumption to list

## Related Skills

- [[research-orchestrator]] — if spec research involves complex multi-faceted questions
- [[pr-review-expert]] — verify implementation matches spec
- [[rag-architect]] — if feature involves retrieval system design
