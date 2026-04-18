// metaarchetech knowledge-base AI proxy
// Deploy to Cloudflare Workers. Set GROQ_API_KEY as a secret:
//   npx wrangler secret put GROQ_API_KEY

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

// In-memory rate limiter: max 20 req/min per IP (resets on cold start)
const rateLimiter = new Map()
function checkRate(ip) {
  const now = Date.now()
  const entry = rateLimiter.get(ip)
  if (!entry || now > entry.reset) {
    rateLimiter.set(ip, { count: 1, reset: now + 60_000 })
    return true
  }
  if (entry.count >= 20) return false
  entry.count++
  return true
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS })
    if (request.method !== "POST")
      return new Response("Method Not Allowed", { status: 405, headers: CORS })

    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown"
    if (!checkRate(ip))
      return new Response("Rate limit exceeded. Try again in a minute.", { status: 429, headers: CORS })

    let query, chunks, mode
    try {
      ;({ query, chunks, mode } = await request.json())
    } catch {
      return new Response("Invalid JSON", { status: 400, headers: CORS })
    }

    if (!query?.trim())
      return new Response("Missing query", { status: 400, headers: CORS })

    const context = (chunks ?? [])
      .map((c, i) => `[${i + 1}] **${c.title}**\n${c.text}`)
      .join("\n\n---\n\n")

    const modeInstructions = mode === "manager"
      ? `You are in MANAGER mode. Be concise and executive.
- Lead with a 1-2 sentence TL;DR
- Use bullet points for key takeaways
- Highlight action items or decisions if relevant
- Skip academic detail; focus on what matters and why`
      : `You are in RESEARCHER mode. Be thorough and analytical.
- Explore connections between ideas
- Use Markdown headings (##) to structure longer answers
- Provide context and background
- Note nuances, caveats, or open questions`

    const systemPrompt = context
      ? `You are a knowledge assistant for a personal Obsidian vault published as a digital garden.
${modeInstructions}
Cite sources with [N] notation matching the context numbers.
If the context doesn't contain relevant information, say so honestly.

Context notes:
${context}`
      : `You are a knowledge assistant for a personal digital garden. The query didn't match any notes. Tell the user to try different keywords.`

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-r1-distill-llama-70b",
        stream: true,
        max_tokens: 1500,
        temperature: 0.6,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
      }),
    })

    if (!groqRes.ok) {
      const text = await groqRes.text()
      return new Response(`Groq error: ${text}`, { status: 502, headers: CORS })
    }

    return new Response(groqRes.body, {
      headers: {
        ...CORS,
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    })
  },
}
