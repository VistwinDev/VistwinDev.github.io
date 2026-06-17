---
name: rag-architect
description: Design and optimize RAG pipelines. Document chunking strategies, embedding model selection, vector database choices, retrieval strategies, query transformation, context optimization, evaluation frameworks.
source: claude-skills/engineering/skills/rag-architect/SKILL.md
audience: lab
status: experimental
imported: 2026-05-19
keywords: rag, retrieval, embeddings, vector-search, knowledge-systems
---

## 🇹🇼 中文摘要

**這個是什麼：** 設計 retrieval pipeline 的 skill — embedding 選型、chunking 策略、vector DB、re-ranking，搞出一套「私有資料能給 AI 查」的系統。

**何時用：**
- 要把私有資料變成 AI 可查的
- vault 知識庫升級、客戶 BIM 資料查詢
- 需要測評 retrieval 準確度
- 最佳化成本 vs. 延遲 vs. 品質

**核心步驟：**
- 選 embedding 模型（all-mpnet 推薦）
- 決定 chunking 策略（semantic / document-aware / recursive）
- 選 vector DB（pgvector for now）
- 做 query transformation（HyDE for vault）
- 評估準確度（faithfulness / precision / recall）

**VisTwin 對位：** 將來 vault → AI 問答、ontology → 結構化 query、客戶 BIM 資料 → 智慧檢索的技術支柱；triple scope = vault / BIM / safety rules 各有不同檢索策略。

---

> 完整英文內容如下 ↓

## VisTwin Context

RAG architecture applies to VisTwin's **triple knowledge scope**:

1. **Vault knowledge base** — internal documentation, API specs, architectural decisions
2. **Customer BIM ontology** — project-specific models, materials, spatial hierarchies (寶舖案 + future customers)
3. **Safety/Process metadata** — safety rules, construction constraints, compliance requirements

Each scope has different:
- **Document sources**: markdown files, JSON schemas, IFC data, unstructured notes
- **Retrieval patterns**: semantic search (find similar concepts), sparse search (exact keywords), spatial queries (find adjacent spaces)
- **Embedding requirements**: 512-768 dimensions (balanced for cost + quality)
- **User expectations**: Frncs needs precise architecture answers; customers need fast visual results

## When to Use

- **Designing vault knowledge retrieval** — how should the system answer "what is our current extension protocol design?"
- **Building customer search over BIM models** — "find all rooms on floor 3 with exposed concrete"
- **Ranking safety recommendations** — given a work order, retrieve 3-5 most relevant safety rules
- **Optimizing query latency** — < 200ms for dashboard search, < 500ms for batch similarity analysis
- **Evaluating retrieval quality** — measure precision@5 for customer BIM search; faithfulness for safety recommendations
- **Cost optimization** — we're paying for embeddings; decide if we should use cheaper/faster models

## Core Competencies

### 1. Document Processing & Chunking Strategies

#### Semantic Chunking (Recommended for VisTwin)
- **Topic modeling**: Use embeddings to detect topic shifts in documents
- **Heading-aware splitting**: Respect document hierarchy (H1, H2, H3)
- **Pros**: Maintains semantic coherence, respects document structure
- **Best for**: Technical documentation (AUTHORING.md, architecture specs, customer BIM metadata)

**VisTwin example**:
```
File: docs/extension-protocol.md
H1: Extension Protocol
  H2: Dashboard Integration
    [chunks: ~500 tokens each, respecting H2 boundaries]
  H2: 3 Dict Registration
    [chunks: ~500 tokens each]
  H2: IPC Messaging
    [chunks: ~500 tokens each]
```

#### Document-Aware Chunking
- **File type detection**: PDF pages, JSON structures, markdown sections
- **Metadata preservation**: Headers, footers, section titles
- **Best for**: Multi-format collections (vault markdown + customer BIM JSON + PDFs)

**VisTwin example**:
```
File: customer_models/model_home_v3.json
[Metadata: customer="寶舖案", date="2026-05-15"]
[Chunks preserve room boundaries: each room = 1 chunk with metadata]
```

#### Recursive Chunking
- **Hierarchical approach**: Try larger chunks first, recursively split if needed
- **Size optimization**: Minimize number of chunks while respecting size limits
- **Best for**: Mixed content (AUTHORING.md + API schemas + BIM specs)

### 2. Embedding Model Selection

#### For VisTwin (Recommended)
- **Model**: sentence-transformers/all-mpnet-base-v2 (768 dimensions)
- **Why**: Balanced cost/quality, supports English + multilingual (supports Chinese for customer docs later)
- **Speed**: ~2.8k tokens/sec (acceptable for < 200ms query latency)
- **Cost**: Self-hosted free or OpenAI ada (0.1 USD per 1M tokens)

#### Alternative Considerations
- **Fast model** (all-MiniLM-L6-v2): 384 dim, faster, lower quality → use for real-time dashboard search
- **Quality model** (text-embedding-ada-002): 1536 dim, higher cost → use for critical vault searches
- **Domain-specific**: SciBERT for safety rule similarity (future optimization)

### 3. Vector Database Selection

#### For VisTwin
- **Primary**: pgvector (PostgreSQL) + vault schema
  - Why: We already have PostgreSQL; vault metadata is relational (ontology hierarchy, customer assignments)
  - ACID compliance: important for customer data integrity
  - Joins: can link embeddings to BIM entities, safety rules, architectural decisions
  
- **Secondary**: Chroma (local dev/testing)
  - Why: Easy local development, SQLite-based, zero ops
  - For: Prototyping new retrieval strategies before production

#### Production Setup (Future)
- Qdrant or Weaviate if retrieval volume scales beyond pgvector capacity
- Current scope: < 100K document chunks (well within pgvector range)

### 4. Retrieval Strategies (VisTwin)

#### Vault Knowledge (Semantic)
- **Strategy**: Dense retrieval (embeddings) + reranking for precision
- **Query transformation**: HyDE (generate hypothetical architecture doc, embed that instead of raw query)
- **Example**: Q: "How should the dashboard integrate with Omniverse?"
  - Generate hypothetical answer about extension protocol, 3 dicts, IPC messaging
  - Embed hypothetical answer
  - Retrieve top-10 chunks semantically similar to hypothetical doc
  - Rerank with cross-encoder
  - Return top-3 to user

#### Customer BIM Search (Hybrid)
- **Strategy**: Hybrid (dense + sparse)
- **Dense**: "find rooms with similar materials"
- **Sparse**: "find rooms with keyword 'concrete'"
- **Fusion**: Reciprocal Rank Fusion (RRF) to combine scores
- **Example**: Q: "Show all bathrooms on floor 3"
  - Dense: find chunks spatially/semantically similar to "bathroom floor 3"
  - Sparse: BM25 on "bathroom" + metadata filter on floor=3
  - Combine top results, deduplicate

#### Safety Rule Matching (Semantic + Ranking)
- **Strategy**: Dense retrieval + customer-specific reranking
- **Context**: Safety rules are small (< 200 tokens), customer constraints are sparse
- **Approach**: For a given work order, retrieve 5 most relevant safety rules by similarity, then rank by severity + customer scope
- **Example**: Work order "cut through external wall"
  - Retrieve safety rules similar to "structural integrity"
  - Filter to rules applicable to this customer (寶舖案 = residential, higher safety standards)
  - Rank by severity (fire/safety > structural > cosmetic)
  - Return top 3 in priority order

### 5. Query Transformation Techniques

#### HyDE (for vault)
```
User Query: "How should the dashboard integrate with Omniverse?"

Hypothetical Document Generated:
"The dashboard integrates with Omniverse through the extension protocol. 
This involves three dictionaries: manifest (define UI), config (define lifecycle), 
and lifecycle (handle events). Integration uses kit-bridge IPC messaging with JSON payloads. 
The protocol supports real-time updates and handles errors gracefully."

Embedding: [embed hypothetical doc, not raw query]
Retrieval: Find docs similar to hypothetical answer
Result: More precise than embedding raw query (which might emphasize "Omniverse" too heavily)
```

#### Multi-Query Generation (for customer BIM)
```
User Query: "bathrooms on floor 3"

Generated Variations:
1. "bathrooms floor 3"
2. "WC floor 3"  
3. "sanitary facilities level 3"
4. "rooms with plumbing floor 3"

Retrieval: Run dense search for each, merge results, deduplicate
Result: Higher recall (catches variations in BIM naming conventions)
```

### 6. Context Window Optimization

#### Dynamic Assembly
- **Relevance-based ordering**: Most relevant chunks first
- **Token budget**: For Claude Haiku context (assume 10K window), reserve 5K for user query + response, leaving 5K for context
- **Hierarchical inclusion**: Include summary chunks before detailed ones

**VisTwin example**: For vault search
```
Total budget: 5K tokens for context
1. Top-1 chunk: 1.5K tokens (highest relevance)
2. Top-2 chunk: 1.5K tokens (if relevant and not redundant)
3. Top-3 chunk: 0.5K tokens (supporting detail only if space allows)
4. Metadata: 0.5K tokens (document metadata, source attribution)
Result: < 5K tokens, preserves top signal
```

#### Context Compression
- **Selective inclusion**: Include only chunks with relevance score > 0.7
- **Summarization**: If a chunk is relevant but verbose, extract key points (trade: more control, more latency)
- **For safety rules**: Include full text (safety rule text must be precise, no paraphrasing)

### 7. Evaluation Frameworks (VisTwin)

#### For Vault Search
- **Faithfulness**: How well are answers grounded in vault docs?
  - Target: > 90% for critical architecture decisions
  - Measure: NLI model checks if answer entails from retrieved docs
  - Example: Q: "What is the extension protocol?" A: "3 dicts: manifest, config, lifecycle"
  - Check: Do retrieved docs mention all 3 dicts?

- **Relevance**: Are retrieved docs actually related to the query?
  - Target: Context relevance > 0.8 (on 0-1 scale)
  - Measure: Embedding similarity of query ↔ retrieved chunks
  - Current: We can measure this; implement RAGAS scores later

#### For Customer BIM Search
- **Precision@5**: Of top-5 results, how many are actually relevant rooms?
  - Target: > 0.8 (4 out of 5 correct)
  - Example: Q: "bathrooms on floor 3"
  - Measure: Manual inspection + user clicks on correct results
  
- **Recall@K**: Did we find all relevant rooms?
  - Target: > 0.7 (find at least 70% of actual bathrooms on floor 3)
  - Hard to measure automatically (requires ground truth), but observable from user queries

#### For Safety Rules
- **Completeness**: Did we retrieve all safety rules relevant to this work order?
  - Target: > 0.8
  - Example: Work order "cut external wall" should retrieve rules on: structural, fire safety, permits, customer constraints
  - Measure: Expert review (Frncs checks if any critical rules were missed)

### 8. Production Patterns

#### Caching Strategies
- **Query-level**: Cache results for identical queries (low cost, high hit rate for repeated work)
- **Semantic caching**: Cache for semantically similar queries (higher complexity, medium ROI)
- **Chunk-level**: Cache embeddings (avoid re-embedding when vault docs don't change)
- **For VisTwin**: Implement query-level + chunk-level first (80/20 rule)

#### Streaming Retrieval
- **For dashboard**: Stream top-5 results as they're ready (< 200ms latency for first result)
- **For batch analysis**: Retrieve in parallel, return sorted by relevance score
- **Not needed initially**: Single query < 500ms is acceptable for vault + safety rules

#### Fallback Mechanisms
- **Primary fails**: Fall back to simpler retrieval (e.g., BM25 if embedding service down)
- **No results**: Return "no matching documents found" + suggest related queries
- **Low confidence**: Flag results < 0.6 relevance as "might not be accurate"

### 9. Cost Optimization

#### Embedding Cost (Current)
- Estimate: 100K chunks × 512 avg tokens = 51M tokens
- Cost: 51M tokens / 1M × $0.02 (all-mpnet) = $1/month (self-hosted free)
- OR: 51M / 1M × $0.10 (OpenAI ada) = $5/month
- Action: Self-host all-mpnet; upgrade to ada only if quality issues

#### Vector Database Cost
- PostgreSQL: existing infrastructure, no incremental cost
- Storage: 100K chunks × 768 dim × 4 bytes (float32) = 300MB (negligible)
- Indexing: HNSW index adds ~1-2x storage (assume 1GB total)
- Action: Current PostgreSQL can handle 10x this scale

#### Query Optimization
- **Query routing**: Simple queries (exact keyword matches) → BM25; complex queries → dense retrieval
- **Batch processing**: Process 10 queries together rather than individually (smaller request overhead)
- **Smart filtering**: Use metadata filters (customer, floor, room_type) before dense search

### 10. Guardrails & Safety (VisTwin)

#### PII in BIM
- **Issue**: Customer BIM models may contain names, project locations, budget info
- **Solution**: Strip PII from chunks before embedding; store separately with access controls
- **Implementation**: Mask person names, project costs; retain geometry + material specs

#### Source Attribution
- **For vault**: Always include document source + section title
- **For customer BIM**: Include room ID, floor, customer name
- **For safety rules**: Include rule ID + revision date
- **Example response**:
  ```
  [From extension-protocol.md > 3 Dict Registration]
  The three dicts are: manifest (UI definition), config (static config), lifecycle (runtime state).
  ```

#### Confidence Scoring
- Include relevance score in response (0-1 scale)
- Flag results < 0.6 as "uncertain"
- Example:
  ```
  Top result (0.89 relevance): "extension protocol uses 3 dicts..."
  Related (0.62 relevance): "dashboard integration...
  ```

## VisTwin Adaptation

**Triple scope in action**:

| Scope | Documents | Retrieval | Embedding | Chunks | Eval Metric |
|-------|-----------|-----------|-----------|--------|-------------|
| **Vault** | AUTHORING.md, architecture docs, API specs | Semantic (HyDE) | all-mpnet-base-v2 (768) | ~500 chunks | Faithfulness > 0.9 |
| **Customer BIM** | IFC data, project PDFs, room specs | Hybrid (dense + sparse) | all-mpnet-base-v2 (768) | ~10K chunks per project | Precision@5 > 0.8 |
| **Safety Rules** | JSON rules, compliance docs | Semantic (dense) + ranking | all-mpnet-base-v2 (768) | ~200 chunks | Expert review > 0.8 |

**Integration with other skills**:
- [[spec-driven-workflow]] — spec RAG requirements (what queries must work? what latency budget?)
- [[pr-review-expert]] — code review for retrieval pipeline changes
- [[research-orchestrator]] — research RAG optimization tradeoffs (cost vs latency vs quality)

**Implementation checklist**:
- [ ] Define retrieval scope (vault / BIM / safety / all three?)
- [ ] Choose chunking strategy (semantic, document-aware, or recursive?)
- [ ] Select embedding model (all-mpnet-base-v2 recommended)
- [ ] Pick vector database (pgvector for now)
- [ ] Implement query transformation (HyDE for vault, multi-query for BIM)
- [ ] Set evaluation targets (faithfulness > 0.9, precision@5 > 0.8, etc.)
- [ ] Test with real queries (ask Frncs + Agent A/B/C for test queries)
- [ ] Measure baseline metrics before optimization
- [ ] Deploy with monitoring (track query latency, retrieval quality scores)

## Common Pitfalls

1. **Poor chunking** → Chunks break mid-sentence or lose context → Fix: Use boundary-aware chunking with 10-20% overlap
2. **Wrong embedding model** → Model doesn't capture domain concepts → Fix: Test all-mpnet for vault first
3. **No evaluation** → Deploy retrieval system with no quality metrics → Fix: Implement RAGAS scores + user feedback loop
4. **Ignoring latency** → Retrieval takes 2 seconds → unacceptable for dashboard → Fix: Implement caching + optimize indexing
5. **Consistency across scopes** → Customer BIM search uses different model than vault → Fix: Use same embedding model everywhere

## Best Practices

1. **Start simple**: All-mpnet + pgvector + semantic chunking. Optimize only after measuring baseline.
2. **Test with real queries**: Ask users (Frncs, Agents A/B/C, customers) what they actually search for.
3. **Measure before optimizing**: Record baseline latency, precision, faithfulness before tuning.
4. **Document retrieval strategy**: Why did you choose semantic over hybrid? Keep design decisions in vault.
5. **Plan for scale**: Architecture should handle 10x current document size without redesign.
