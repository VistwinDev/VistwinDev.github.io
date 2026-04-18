// ── WebGL Soft Flow shader background ──────────────────────────────────────
const initShader = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, alpha: false })
  if (!gl) return null

  const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}`
  const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_speed;
uniform vec3 u_colA;
uniform vec3 u_colB;

vec3 mod289v3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289v2(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289v3(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;
  i=mod289v2(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;
  vec3 x2=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x2)-0.5;
  vec3 ox=floor(x2+0.5);
  vec3 a0=x2-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float fbm(vec2 p){
  float v=0.0,a=0.5;
  for(int i=0;i<5;i++){v+=a*snoise(p);p*=2.03;a*=0.5;}
  return v;
}
void main(){
  vec2 p=(gl_FragCoord.xy-0.5*u_res.xy)/min(u_res.x,u_res.y);
  float t=u_time*u_speed;
  vec2 flow=vec2(fbm(p*0.8+vec2(t,0.0)),fbm(p*0.8+vec2(0.0,t)+7.3));
  vec2 q=p+flow*0.4;
  float n=fbm(q*1.2+t*0.8);
  n+=0.3*fbm(q*2.5-t*0.4);
  n=smoothstep(-0.9,0.9,n);
  float nb=pow(clamp(n,0.0,1.0),0.9);
  vec3 col=mix(u_colA,u_colB,nb);
  col*=1.0-0.3*length(p);
  col=pow(max(col,0.0),vec3(0.88));
  gl_FragColor=vec4(col,1.0);
}`

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src); gl.compileShader(s)
    return s
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)

  const buf = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW)

  const loc = {
    a:     gl.getAttribLocation(prog, "a"),
    res:   gl.getUniformLocation(prog, "u_res"),
    time:  gl.getUniformLocation(prog, "u_time"),
    speed: gl.getUniformLocation(prog, "u_speed"),
    colA:  gl.getUniformLocation(prog, "u_colA"),
    colB:  gl.getUniformLocation(prog, "u_colB"),
  }

  // near-black → bright green, boosted for visibility
  const colA = [0.01, 0.02, 0.03]
  const colB = [0.55, 0.95, 0.02]
  const speed = 0.03
  const start = performance.now()
  let rafId = 0

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = Math.floor(canvas.offsetWidth * dpr)
    const h = Math.floor(canvas.offsetHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h
    }
  }

  const render = (now: number) => {
    resize()
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.enableVertexAttribArray(loc.a)
    gl.vertexAttribPointer(loc.a, 2, gl.FLOAT, false, 0, 0)
    gl.uniform2f(loc.res, canvas.width, canvas.height)
    gl.uniform1f(loc.time, (now - start) / 1000)
    gl.uniform1f(loc.speed, speed)
    gl.uniform3f(loc.colA, colA[0], colA[1], colA[2])
    gl.uniform3f(loc.colB, colB[0], colB[1], colB[2])
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    rafId = requestAnimationFrame(render)
  }

  return {
    start: () => { if (!rafId) rafId = requestAnimationFrame(render) },
    stop:  () => { cancelAnimationFrame(rafId); rafId = 0 },
  }
}

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

  // ── Mode toggle ────────────────────────────────────────────────────────────
  for (const btn of document.querySelectorAll<HTMLButtonElement>(".dna-ai-mode-btn")) {
    btn.addEventListener("click", () => {
      currentMode = (btn.dataset.mode ?? "researcher") as "researcher" | "manager"
      for (const b of document.querySelectorAll<HTMLButtonElement>(".dna-ai-mode-btn")) {
        const active = b.dataset.mode === currentMode
        b.classList.toggle("dna-ai-mode-btn--active", active)
        b.setAttribute("aria-pressed", String(active))
      }
    })
    window.addCleanup(() => btn.removeEventListener("click", () => {}))
  }

  // ── Shader background ─────────────────────────────────────────────────────
  const shaderCanvas = document.getElementById("dna-ai-canvas") as HTMLCanvasElement | null
  const shader = shaderCanvas ? initShader(shaderCanvas) : null

  // ── Panel open/close ───────────────────────────────────────────────────────

  const openPanel = () => {
    panel.classList.add("dna-open")
    input.focus()
    shader?.start()
    ensureIndex().catch(() => {})
  }
  const closePanel = () => {
    panel.classList.remove("dna-open")
    shader?.stop()
    abortCtrl?.abort()
  }

  fab.addEventListener("click", openPanel)
  closeBtn.addEventListener("click", closePanel)
  window.addCleanup(() => {
    fab.removeEventListener("click", openPanel)
    closeBtn.removeEventListener("click", closePanel)
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
        body: JSON.stringify({ query, chunks: topChunks, mode: currentMode }),
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
