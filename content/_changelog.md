---
tags: [meta, changelog, import]
created: 2026-05-19
updated: 2026-05-19
---

# Vault Changelog

## 2026-05-19 — External Resource Import

**Import batch**: 5 external resources (anthropic-cookbook + claude-skills)

### Templates Added
- `00 系統/Templates/Research_Lead_Agent.md` — lead-agent prompt template from anthropic-cookbook
- `00 系統/Templates/Research_Subagent.md` — subagent prompt template from anthropic-cookbook

### Skills Added
- `05 技能/research-orchestrator/SKILL.md` — multi-agent research orchestration (anthropic-cookbook)
- `05 技能/pr-review-expert/SKILL.md` — structured PR code review (claude-skills/engineering)
- `05 技能/spec-driven-workflow/SKILL.md` — spec-first development (claude-skills/engineering)
- `05 技能/rag-architect/SKILL.md` — RAG pipeline design & optimization (claude-skills/engineering)

### Knowledge Notes Added
- `04 知識/RAG_Patterns/contextual-embeddings.md` — contextual embeddings for RAG improvement

### Integration Points
- All 5 new skills include **VisTwin Context** section (寶舖案, FDE deployment, ontology evolution)
- All 5 new skills include **VisTwin Adaptation** section (specific checks, integrations with existing skills)
- research-orchestrator links to [[research-orchestrator]] templates
- pr-review-expert links to [[project_kit_bridge]], [[extension_protocol]], AUTHORING.md compliance
- spec-driven-workflow links to Roadmap phases (Phase 1-3)
- rag-architect links to triple-scope retrieval (vault, customer BIM, safety rules)

### Quality Notes
- No existing vault files modified (pure new additions)
- Dataview in _index.md auto-discovers new skills
- All SKILL.md files follow VisTwin frontmatter format (name, description, source, audience, status, imported, keywords)
- Markdown links use [[internal-reference]] format for cross-referencing

---

## 2026-05-19 — Chinese Summary Backfill

**Accessibility improvement**: Added 中文摘要 (Chinese summaries) section to all 7 imported files for faster vault reading.

### Files Updated
- `00 系統/Templates/Research_Lead_Agent.md` — 中文摘要 added (multi-agent research lead role)
- `00 系統/Templates/Research_Subagent.md` — 中文摘要 added (research execution agent)
- `05 技能/research-orchestrator/SKILL.md` — 中文摘要 added (multi-agent orchestration)
- `05 技能/pr-review-expert/SKILL.md` — 中文摘要 added (structured code review)
- `05 技能/spec-driven-workflow/SKILL.md` — 中文摘要 added (spec-first development)
- `05 技能/rag-architect/SKILL.md` — 中文摘要 added (RAG pipeline design)
- `04 知識/RAG_Patterns/contextual-embeddings.md` — 中文摘要 added (contextual embedding optimization)

### Summary Content Format
Each file now includes `## 🇹🇼 中文摘要` section right after frontmatter:
- **這個是什麼** (1-2 sentences)
- **何時用** (3-4 bullet points)
- **核心步驟** (3-5 key points)
- **VisTwin 對位** (1-2 sentences linking to寶舖案/FDE/ontology context)

Followed by `> 完整英文內容如下 ↓` divider, then original English content unchanged.

### Quality Notes
- English content 100% preserved (no translation, no modification)
- Summaries tailored to VisTwin team context
- All internal links use [[internal-reference]] format
- Frontmatter untouched (name, description, source, audience, status, imported, keywords)

---

## How to Reference This Import

Use in conversation:
- **For research tasks**: invoke [[research-orchestrator]] + deploy lead-agent ([[Research_Lead_Agent]]) + subagents ([[Research_Subagent]])
- **For code review**: invoke [[pr-review-expert]], run VisTwin-specific checks
- **For feature planning**: invoke [[spec-driven-workflow]], write spec first, then generate tests
- **For retrieval system design**: invoke [[rag-architect]], apply contextual-embeddings optimization
