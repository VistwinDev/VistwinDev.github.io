---
name: research-orchestrator
description: Lead parallel research teams with lead-agent + subagent framework. Break complex queries into depth-first or breadth-first multi-agent workflows, synthesize findings across teams.
source: anthropic-cookbook/patterns/agents/prompts (research_lead_agent + research_subagent)
audience: lab
status: experimental
imported: 2026-05-19
keywords: research, multi-agent, orchestration, subagents, synthesis
---

## 🇹🇼 中文摘要

**這個是什麼：** 觸發式 skill — 教 Claude「這個任務要走 lead + sub-agent 拆解模式」，平行派遣多個研究員，最後由 lead 合成結論。

**何時用：**
- 問題太大、研究面向多
- 需要結構化合成而非串接報告
- 3+ 個獨立視角需要同時探索
- 寶舖案複雜分析、ontology spec 起草、跟設計公司溝通前準備

**核心步驟：**
- 判斷要不要拆（simple / standard / complex / high complexity）
- 用 [[Research_Lead_Agent]] template 當 lead
- Spawn N 個 sub-agent，各自執行 [[Research_Subagent]]
- Lead 收結果，提取關鍵發現、識別衝突、補缺口
- 給最終綜合答案（不是 concatenation）

**VisTwin 對位：** Frncs = lead 主導，B/A/C = sub-agent；寶舖案複雜分析、ontology spec 起草、FDE 跟 Omniverse 集成方案時用。

---

> 完整英文內容如下 ↓

## VisTwin Context

**Lab lead role**: Frncs acts as the research orchestrator for complex architectural decisions (寶舖案、FDE deployment, ontology evolution).

**Sub-team composition**: 
- Agent A (API/service design)
- Agent B (Frontend + integration)
- Agent C (DevOps + safety systems)

**Default scope**: Each research task bounds itself to one or more milestones in the current project roadmap (vault v0.1 → v0.2 → deployment).

## When to Use

- **Complex multi-faceted questions** that require simultaneous exploration of 3+ different angles
  - Example: "Design the ontology structure for BIM + safety data integration" → parallel agents explore ontology patterns, BIM schema, customer requirements, FDE deployment constraints
  
- **Breadth-first research** when the answer depends on gathering data from many distinct sources
  - Example: "Compare RAG retrieval strategies for vault + ontology scope" → agents research semantic search, sparse/dense retrieval, cost models, latency tradeoffs

- **Depth-first research** when a single question needs multiple expert perspectives
  - Example: "How should the dashboard integrate with Omniverse?" → agents explore extension protocol, IPC messaging, customer UI expectations, performance constraints

- **When you're blocked waiting for subagent results** — use that time to refine the synthesis plan or identify what's still missing

## How to Deploy

### Step 1: Classify the Query Type

- **Straightforward** → 1 subagent (fact-finding, simple verification)
- **Standard complexity** → 2-3 subagents (multiple perspectives on same topic)
- **Medium complexity** → 3-5 subagents (multi-faceted question with distinct sub-problems)
- **High complexity** → 5-10 subagents (rare; very broad, multi-part queries)

### Step 2: Define Sub-Tasks with Extreme Clarity

Each subagent prompt MUST include:
- **One core objective** (not multiple goals mixed together)
- **Expected output format** (bullet list, report, decision matrix, etc.)
- **Background context** (why this research matters to the overall question)
- **Key questions** (3-5 specific things the agent should answer)
- **Source priorities** (what counts as a good source? what to avoid?)

Example for vault research:

```
Subagent A — Ontology Patterns Research
Objective: Identify the best ontology structure for dual-scope integration (customer BIM + internal systems).

Output: Comparison matrix with 4 approaches (hierarchical, graph-based, semantic, hybrid).
For each: pros/cons, implementation complexity, query performance, scaling to 100K entities.

Background: VisTwin vault needs to support both customer BIM models and internal safety/process systems. 
Ontology design locks in major architectural decisions for Q3-Q4 2026.

Key questions:
1. How do successful BIM ontologies handle multi-tenant data (different customers)?
2. What are the query patterns for BIM? (spatial queries, hierarchical traversal, filtering by properties)
3. Can we use SPARQL + RDF or do we need a custom graph database?

Sources: W3C standards (RDF, OWL), BIM documentation (IFC, COBie), academic papers on ontology design (from the last 3 years).
Avoid: Vendor-specific docs, unvetted blog posts. Prioritize: Published standards and peer-reviewed work.
```

### Step 3: Deploy in Parallel

Use `run_blocking_subagent` to create multiple agents simultaneously (usually 3 agents for standard queries).

While waiting:
- Review what you already know about the problem
- Sketch out what the final synthesis should look like
- Identify potential gaps or conflicts in the research plan

### Step 4: Synthesize Findings

When subagent results arrive:
1. Extract key findings from each agent's report
2. Look for conflicts or corroborating signals
3. Identify gaps — is there anything critical that wasn't researched?
4. Sketch a coherent answer that draws on all three perspectives
5. If major gaps exist, deploy an additional agent to fill them (but stop research when diminishing returns appear)

### Step 5: Produce the Final Report

YOU (the orchestrator) write the final synthesis. Do NOT ask a subagent to write it.

Structure:
- **Executive Summary** (1 paragraph answering the core question)
- **Research Findings** (organized by sub-question, cross-referenced to source agents)
- **Recommendation** (if applicable — what should Frncs do next?)
- **Open Questions** (anything remaining to resolve)

## VisTwin Adaptation

**Pre-Research Checklist**:
- Is this question bounded by current project scope (寶舖案, FDE deployment, or ontology v0.1)?
- Which project milestone depends on the answer? (Roadmap Phase 1-3)
- Who needs the final synthesis? (Frncs, Agent A/B/C, or external stakeholder?)

**Subagent Scope Boundaries**:
- **Do NOT research** features outside the current roadmap phase
- **Do research** tradeoffs and dependencies affecting next phase
- **Always ground findings** in VisTwin's architecture (vault schema, extension protocol, IPC messaging)

**Integration with Other Skills**:
- [[spec-driven-workflow]] — after orchestrator produces findings, spec-driven-workflow converts them into an approved spec
- [[rag-architect]] — if research involves retrieval system design (vault + customer ontology)
- [[pr-review-expert]] — after implementation begins, verify changes against research findings

**Synthesis Formatting**:
- Use markdown with clear section headers
- Include metrics and data points (not just qualitative opinions)
- Link findings back to specific source agents
- Flag assumptions and confidence levels ("strong consensus across 2/3 agents" vs. "single source")

## Common Pitfalls

1. **Subagent task overlap** — multiple agents researching the same thing wastes budget. Define clear boundaries.
2. **Vague objectives** — "research the dashboard" is too broad. "Evaluate 3 extension protocol approaches for real-time metric updates" is better.
3. **Not synthesizing** — collecting 3 subagent reports and concatenating them is not synthesis. Extract insights, highlight conflicts, make judgments.
4. **Research creep** — keep total tool calls under 50 across all agents. Stop when you can answer the question.
5. **Ignoring quality** — check sources. A blog post from 2020 is weaker than an RFC or peer-reviewed paper from 2025.

## Best Practices

- **Start with 2-3 subagents, not 10.** If you need more, you can always deploy additional agents after seeing initial results.
- **Classify query type before writing subagent prompts.** Straightforward vs. standard vs. complex determines parallelization strategy.
- **Define explicit exit criteria.** When is research "done"? (e.g., "all 4 approaches compared on 5 dimensions")
- **Use internal tools first.** Before web research, check if the answer is already in vault, wiki, or project docs.
- **Reference the templates:** [[Research_Lead_Agent]] and [[Research_Subagent]] for prompts.
