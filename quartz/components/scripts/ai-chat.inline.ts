interface Chunk {
  text: string
  slug: string
  title: string
}

class BM25 {
  private k1 = 1.5
  private b = 0.75
  private idf = new Map<string, number>()
  private avgDl: number

  constructor(private docs: Chunk[]) {
    const lengths = docs.map((d) => this.tok(d.text).length)
    this.avgDl = lengths.reduce((s, l) => s + l, 0) / (lengths.length || 1)
    const N = docs.length
    const df = new Map<string, number>()
    for (const doc of docs)
      for (const t of new Set(this.tok(doc.text))) df.set(t, (df.get(t) ?? 0) + 1)
    for (const [t, f] of df)
      this.idf.set(t, Math.log((N - f + 0.5) / (f + 0.5) + 1))
  }

  private tok(text: string): string[] {
    // ASCII words + individual CJK characters (Chinese has no spaces)
    const ascii = text.toLowerCase().match(/[a-z0-9]+/g) ?? []
    const cjk = text.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g) ?? []
    return [...ascii, ...cjk]
  }

  search(query: string, k = 5): Chunk[] {
    const qTerms = this.tok(query)
    const scored = this.docs.map((doc) => {
      const tokens = this.tok(doc.text)
      const dl = tokens.length
      const tf = new Map<string, number>()
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1)
      let score = 0
      for (const q of qTerms) {
        const idf = this.idf.get(q) ?? 0
        const f = tf.get(q) ?? 0
        score +=
          (idf * (f * (this.k1 + 1))) /
          (f + this.k1 * (1 - this.b + (this.b * dl) / this.avgDl))
      }
      return { doc, score }
    })
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .filter((s) => s.score > 0)
      .map((s) => s.doc)
  }
}

document.addEventListener("nav", () => {
  const root = document.getElementById("dna-ai-chat") as HTMLElement | null
  if (!root) return

  const workerUrl = root.dataset.workerUrl ?? ""
  const fab = document.getElementById("dna-ai-fab") as HTMLButtonElement
  const panel = document.getElementById("dna-ai-panel") as HTMLElement
  const closeBtn = document.getElementById("dna-ai-close") as HTMLButtonElement
  const msgContainer = document.getElementById("dna-ai-messages") as HTMLElement
  const input = document.getElementById("dna-ai-input") as HTMLInputElement
  const sendBtn = document.getElementById("dna-ai-send") as HTMLButtonElement

  let bm25: BM25 | null = null
  let isStreaming = false
  let abortCtrl: AbortController | null = null
  let currentMode: "researcher" | "manager" = "researcher"

  // ── Model catalogue ────────────────────────────────────────────────────────
  const MODELS: Record<string, { value: string; label: string }[]> = {
    researcher: [
      { value: "llama-3.3-70b-versatile",  label: "Llama 3.3 70B  ·  深度分析 / 長文研究（預設）" },
      { value: "llama-3.1-70b-versatile",  label: "Llama 3.1 70B  ·  多語言 / 邏輯推理" },
      { value: "gemma2-9b-it",             label: "Gemma 2 9B     ·  Google 模型 / 快速研究" },
    ],
    manager: [
      { value: "llama-3.1-8b-instant",     label: "Llama 3.1 8B Instant  ·  超快速摘要（預設）" },
      { value: "gemma2-9b-it",             label: "Gemma 2 9B            ·  結構化輸出" },
      { value: "llama-3.3-70b-versatile",  label: "Llama 3.3 70B         ·  高品質摘要" },
    ],
  }
  let currentModel = MODELS.researcher[0].value

  // ── Starter chips ──────────────────────────────────────────────────────────
  const STARTER_CHIPS: Record<string, string[]> = {
    researcher: [
      "Visustwin 最新進展是什麼？",
      "DNA 設計系統的 Do / Don't 有哪些？",
      "WebController 跟 welltek 的分工邏輯為何？",
      "120 年 OTA 這個概念怎麼對應到數據層？",
    ],
    manager: [
      "今天在做什麼？",
      "哪些任務 blocked？",
      "還沒 merge 的 PR 清單",
      "Sprint 2026-04-18 的 Doing 項目",
    ],
  }

  const chipsEl = document.getElementById("dna-ai-chips") as HTMLElement | null

  const populateChips = (mode: string) => {
    if (!chipsEl) return
    const list = STARTER_CHIPS[mode] ?? []
    chipsEl.innerHTML = ""
    chipsEl.classList.remove("dna-chips-hidden")
    for (const text of list) {
      const btn = document.createElement("button")
      btn.className = "dna-ai-chip-starter"
      btn.textContent = text
      btn.addEventListener("click", () => {
        if (isStreaming) return
        input.value = text
        chipsEl.classList.add("dna-chips-hidden")
        send()
      })
      chipsEl.appendChild(btn)
    }
  }
  populateChips("researcher")

  // ── Restore saved panel size ───────────────────────────────────────────────
  const savedPanelW = localStorage.getItem("dna-ai-panel-width")
  const savedPanelH = localStorage.getItem("dna-ai-panel-height")
  if (savedPanelW) panel.style.width = savedPanelW
  if (savedPanelH) panel.style.height = savedPanelH

  // ── Panel resize (left edge + top edge) ────────────────────────────────────
  const makeDragger = (
    handle: HTMLElement,
    axis: "x" | "y",
  ) => {
    let startPos = 0
    let startSize = 0

    const onMove = (e: PointerEvent) => {
      if (axis === "x") {
        // left handle: drag left = wider (panel is right-anchored)
        const delta = startPos - e.clientX
        const newW = Math.max(320, Math.min(700, startSize + delta))
        panel.style.width = newW + "px"
      } else {
        // top handle: drag up = taller (panel is bottom-anchored)
        const delta = startPos - e.clientY
        const newH = Math.max(280, Math.min(800, startSize + delta))
        panel.style.height = newH + "px"
      }
    }

    const onUp = (e: PointerEvent) => {
      handle.classList.remove("dna-dragging")
      handle.releasePointerCapture(e.pointerId)
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerup", onUp)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
      if (axis === "x") localStorage.setItem("dna-ai-panel-width", panel.style.width)
      else localStorage.setItem("dna-ai-panel-height", panel.style.height)
    }

    const onDown = (e: PointerEvent) => {
      startPos = axis === "x" ? e.clientX : e.clientY
      startSize = axis === "x" ? panel.offsetWidth : panel.offsetHeight
      handle.classList.add("dna-dragging")
      handle.setPointerCapture(e.pointerId)
      document.addEventListener("pointermove", onMove)
      document.addEventListener("pointerup", onUp)
      document.body.style.userSelect = "none"
      document.body.style.cursor = axis === "x" ? "ew-resize" : "ns-resize"
      e.preventDefault()
    }

    handle.addEventListener("pointerdown", onDown)
    window.addCleanup(() => handle.removeEventListener("pointerdown", onDown))
  }

  const leftHandle = panel.querySelector(".dna-ai-resize-left") as HTMLElement | null
  const topHandle  = panel.querySelector(".dna-ai-resize-top")  as HTMLElement | null
  if (leftHandle) makeDragger(leftHandle, "x")
  if (topHandle)  makeDragger(topHandle,  "y")

  // ── Model toggles ──────────────────────────────────────────────────────────
  const modelToggles = document.getElementById("dna-ai-model-toggles") as HTMLElement | null

  const populateModels = (mode: string) => {
    if (!modelToggles) return
    const list = MODELS[mode] ?? []
    const defaultModel = list[0]?.value ?? ""
    currentModel = defaultModel
    modelToggles.innerHTML = ""
    for (const m of list) {
      const btn = document.createElement("button")
      btn.className = "dna-ai-model-btn" + (m.value === defaultModel ? " dna-ai-model-btn--active" : "")
      btn.dataset.model = m.value
      btn.title = m.label
      // Split label on · separator
      const parts = m.label.split("·")
      const nameEl = document.createElement("span")
      nameEl.className = "dna-ai-model-name"
      nameEl.textContent = (parts[0] ?? "").trim()
      const hintEl = document.createElement("span")
      hintEl.className = "dna-ai-model-hint"
      hintEl.textContent = (parts[1] ?? "").trim()
      btn.appendChild(nameEl)
      btn.appendChild(hintEl)
      btn.addEventListener("click", () => {
        currentModel = m.value
        for (const b of modelToggles.querySelectorAll<HTMLButtonElement>(".dna-ai-model-btn"))
          b.classList.toggle("dna-ai-model-btn--active", b.dataset.model === currentModel)
      })
      modelToggles.appendChild(btn)
    }
  }
  populateModels("researcher")

  // ── Mode toggle ────────────────────────────────────────────────────────────
  for (const btn of document.querySelectorAll<HTMLButtonElement>(".dna-ai-mode-btn")) {
    btn.addEventListener("click", () => {
      currentMode = (btn.dataset.mode ?? "researcher") as "researcher" | "manager"
      for (const b of document.querySelectorAll<HTMLButtonElement>(".dna-ai-mode-btn")) {
        const active = b.dataset.mode === currentMode
        b.classList.toggle("dna-ai-mode-btn--active", active)
        b.setAttribute("aria-pressed", String(active))
      }
      populateModels(currentMode)
      populateChips(currentMode)
    })
    window.addCleanup(() => btn.removeEventListener("click", () => {}))
  }

  // ── Panel open/close ───────────────────────────────────────────────────────

  const openPanel = () => {
    panel.classList.add("dna-open")
    input.focus()
    ensureIndex().catch(() => {})
  }
  const closePanel = () => {
    panel.classList.remove("dna-open")
    abortCtrl?.abort()
  }

  fab.addEventListener("click", () => {
    panel.classList.contains("dna-open") ? closePanel() : openPanel()
  })
  closeBtn.addEventListener("click", closePanel)
  window.addCleanup(() => {
    fab.removeEventListener("click", openPanel)
    closeBtn.removeEventListener("click", closePanel)
  })

  // ── Mobile: keyboard avoidance (Method A — visualViewport) ────────────────
  // On mobile the panel is position:absolute inside a position:fixed container.
  // When the soft keyboard opens the visual viewport shrinks but the fixed
  // container stays anchored at its CSS `bottom` value relative to the layout
  // viewport, which means the keyboard covers the input.  We lift the container
  // by exactly the keyboard height whenever the visual viewport resizes.
  const MOBILE_BP = 640
  const isMobile = () => window.innerWidth <= MOBILE_BP

  const adjustForKeyboard = () => {
    if (!isMobile() || !window.visualViewport) return
    const vv = window.visualViewport
    // keyboard height = layout-viewport height − (visual-viewport height + its top offset)
    const kbHeight = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop))
    const basePx = 16 // matches CSS bottom: 1rem on mobile
    root.style.bottom = (basePx + kbHeight) + "px"
  }

  const resetKeyboardOffset = () => {
    if (isMobile()) root.style.bottom = ""
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", adjustForKeyboard)
    window.visualViewport.addEventListener("scroll", adjustForKeyboard)
    window.addCleanup(() => {
      window.visualViewport?.removeEventListener("resize", adjustForKeyboard)
      window.visualViewport?.removeEventListener("scroll", adjustForKeyboard)
    })
  }

  // On focus: lift immediately (keyboard may not have fired resize yet) and
  // scroll the input into the visible area (critical on iOS Safari).
  const onInputFocus = () => {
    if (!isMobile()) return
    adjustForKeyboard()
    // Delay scroll until keyboard animation finishes (~350 ms)
    setTimeout(() => {
      input.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }, 350)
  }
  const onInputBlur = () => resetKeyboardOffset()

  input.addEventListener("focus", onInputFocus)
  input.addEventListener("blur",  onInputBlur)
  window.addCleanup(() => {
    input.removeEventListener("focus", onInputFocus)
    input.removeEventListener("blur",  onInputBlur)
  })

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && panel.classList.contains("dna-open")) closePanel()
  }
  document.addEventListener("keydown", onKey)
  window.addCleanup(() => document.removeEventListener("keydown", onKey))

  // ── Index loading ──────────────────────────────────────────────────────────

  const ensureIndex = async () => {
    if (bm25) return
    const res = await fetch("/search-chunks.json")
    if (!res.ok) throw new Error("search-chunks.json not found — run npm run build:search")
    const chunks: Chunk[] = await res.json()
    bm25 = new BM25(chunks)
  }

  // ── Message rendering ──────────────────────────────────────────────────────

  const addMessage = (role: "user" | "assistant") => {
    const wrap = document.createElement("div")
    wrap.className = `dna-ai-msg dna-ai-msg--${role}`
    const textEl = document.createElement("div")
    textEl.className = "dna-ai-bubble"
    wrap.appendChild(textEl)
    msgContainer.appendChild(wrap)
    msgContainer.scrollTop = msgContainer.scrollHeight
    return { wrap, textEl }
  }

  const appendSources = (wrap: HTMLElement, chunks: Chunk[]) => {
    if (!chunks.length) return
    const seen = new Set<string>()
    const row = document.createElement("div")
    row.className = "dna-ai-sources"
    for (const c of chunks) {
      if (seen.has(c.slug)) continue
      seen.add(c.slug)
      const a = document.createElement("a")
      a.href = `/${c.slug}`
      a.className = "dna-ai-chip"
      a.textContent = c.title
      row.appendChild(a)
    }
    wrap.appendChild(row)
  }

  // ── Markdown renderer (minimal, no deps) ──────────────────────────────────

  const renderMd = (raw: string): string => {
    // Strip DeepSeek-R1 <think>...</think> reasoning blocks
    let s = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trimStart()
    // Escape HTML
    s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // Bold **text**
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic *text*
    s = s.replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Headings ### ## #
    s = s.replace(/^### (.+)$/gm, "<h3>$1</h3>")
    s = s.replace(/^## (.+)$/gm, "<h2>$1</h2>")
    s = s.replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bullet lines
    s = s.replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    s = s.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    // Paragraphs (double newline)
    s = s.replace(/\n{2,}/g, "</p><p>")
    s = `<p>${s}</p>`
    // Clean up empty <p> tags around block elements
    s = s.replace(/<p>(<h[123]>)/g, "$1").replace(/(<\/h[123]>)<\/p>/g, "$1")
    s = s.replace(/<p>(<ul>)/g, "$1").replace(/(<\/ul>)<\/p>/g, "$1")
    // Single newlines → <br>
    s = s.replace(/\n/g, "<br>")
    return s
  }

  // ── Send ───────────────────────────────────────────────────────────────────

  const send = async () => {
    const query = input.value.trim()
    if (!query || isStreaming) return
    input.value = ""
    isStreaming = true
    sendBtn.disabled = true
    chipsEl?.classList.add("dna-chips-hidden")

    addMessage("user").textEl.textContent = query

    const { wrap: aiWrap, textEl } = addMessage("assistant")
    textEl.innerHTML = '<span class="dna-ai-cursor"></span>'
    msgContainer.scrollTop = msgContainer.scrollHeight

    try {
      await ensureIndex()
      const topChunks = bm25!.search(query, 8)

      abortCtrl = new AbortController()
      const res = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, chunks: topChunks, mode: currentMode, model: currentModel }),
        signal: abortCtrl.signal,
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg)
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buf = ""
      let full = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split("\n")
        buf = lines.pop()!
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6).trim()
          if (data === "[DONE]") continue
          try {
            const token = JSON.parse(data).choices?.[0]?.delta?.content
            if (token) {
              full += token
              // Show raw text while streaming (think tags still arriving)
              const visible = full.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/<think>[\s\S]*/g, "")
              textEl.textContent = visible
              msgContainer.scrollTop = msgContainer.scrollHeight
            }
          } catch {}
        }
      }

      textEl.innerHTML = renderMd(full) || "(no response)"
      appendSources(aiWrap, topChunks)
    } catch (err: unknown) {
      const isAbort = err instanceof Error && err.name === "AbortError"
      if (!isAbort) {
        textEl.textContent =
          err instanceof Error ? `⚠ ${err.message}` : "⚠ Unknown error"
      }
    } finally {
      isStreaming = false
      sendBtn.disabled = false
      msgContainer.scrollTop = msgContainer.scrollHeight
    }
  }

  sendBtn.addEventListener("click", send)
  const onEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }
  input.addEventListener("keydown", onEnter)
  window.addCleanup(() => {
    sendBtn.removeEventListener("click", send)
    input.removeEventListener("keydown", onEnter)
  })
})
