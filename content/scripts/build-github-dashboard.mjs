#!/usr/bin/env node
// Generates two dashboard markdown files from GitHub data.
// - "00 System/Dashboard.md"           (public repos only — published via Quartz)
// - "private/GitHub Dashboard (full).md" (all repos — kept inside vault, ignored by Quartz)
//
// Also writes ".dashboard-fingerprint" so the workflow can skip commits
// when no underlying repo data changed (only the timestamp would differ).

import { spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createHash } from "node:crypto";

const QUERY = `
{
  viewer {
    repositories(first: 100, orderBy: {field: PUSHED_AT, direction: DESC}, ownerAffiliations: OWNER) {
      nodes {
        name
        nameWithOwner
        description
        url
        visibility
        isArchived
        isFork
        stargazerCount
        pushedAt
        primaryLanguage { name }
        defaultBranchRef { name }
        pullRequests(states: OPEN) { totalCount }
        issues(states: OPEN) { totalCount }
      }
    }
  }
}
`;

function gh(query) {
  const r = spawnSync("gh", ["api", "graphql", "-f", `query=${query}`], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
  if (r.status !== 0) {
    console.error("gh api failed:", r.stderr);
    process.exit(1);
  }
  return JSON.parse(r.stdout);
}

const data = gh(QUERY);
const repos = data.data.viewer.repositories.nodes;

const now = new Date();
const nowIso = now.toISOString().replace(/\.\d+Z$/, "Z");
const today = nowIso.slice(0, 10);
const daysSince = (d) => Math.floor((Date.now() - new Date(d).getTime()) / 86400000);

const partition = (rs) => {
  const active = [], stale = [], archived = [];
  for (const r of rs) {
    if (r.isArchived) archived.push(r);
    else if (daysSince(r.pushedAt) <= 30) active.push(r);
    else stale.push(r);
  }
  return { active, stale, archived };
};

const esc = (s) => (s ?? "—").replace(/\|/g, "\\|").replace(/\n/g, " ");

function tablePublic(rs) {
  if (!rs.length) return "_(none)_\n";
  const head = "| Repo | Description | Language | ★ | Last push | Open PRs |";
  const sep =  "|---|---|---|---|---|---|";
  const rows = rs.map((r) => {
    const pr = r.pullRequests.totalCount;
    const prCell = pr > 0 ? `**${pr}** 🟢` : "0";
    return `| [${r.name}](${r.url}) | ${esc(r.description)} | ${r.primaryLanguage?.name || "—"} | ${r.stargazerCount} | ${r.pushedAt.slice(0, 10)} | ${prCell} |`;
  });
  return [head, sep, ...rows].join("\n") + "\n";
}

function tableFull(rs) {
  if (!rs.length) return "_(none)_\n";
  const head = "| Repo | Visibility | Description | Language | ★ | Default | Last push | Open PRs | Open Issues |";
  const sep =  "|---|---|---|---|---|---|---|---|---|";
  const rows = rs.map((r) => {
    const pr = r.pullRequests.totalCount;
    const prCell = pr > 0 ? `**${pr}** 🟢` : "0";
    return `| [${r.name}](${r.url}) | ${r.visibility.toLowerCase()} | ${esc(r.description)} | ${r.primaryLanguage?.name || "—"} | ${r.stargazerCount} | ${r.defaultBranchRef?.name || "—"} | ${r.pushedAt.slice(0, 10)} | ${prCell} | ${r.issues.totalCount} |`;
  });
  return [head, sep, ...rows].join("\n") + "\n";
}

// Public dashboard (only public, non-archived, non-fork)
const pub = repos.filter((r) => r.visibility === "PUBLIC" && !r.isArchived && !r.isFork);
const pubP = partition(pub);

const publicMd = `---
title: GitHub Projects
created: ${today}
last_updated: ${nowIso}
tags: [dashboard, auto-generated]
---

# GitHub Projects

> Auto-updated hourly from GitHub. Last updated: \`${nowIso}\`.

## Active

${tablePublic(pubP.active)}
${pubP.stale.length ? `## Stale (>30 days)\n\n${tablePublic(pubP.stale)}` : ""}
`;

// Full dashboard (everything except forks)
const all = repos.filter((r) => !r.isFork);
const allP = partition(all);

const fullMd = `---
title: GitHub Dashboard (full)
created: ${today}
last_updated: ${nowIso}
tags: [dashboard, auto-generated, private]
---

# GitHub Dashboard (full)

> Auto-updated hourly. Includes private repos. Last updated: \`${nowIso}\`.

**Totals**: ${all.length} repos · ${all.filter((r) => r.visibility === "PUBLIC").length} public · ${all.filter((r) => r.visibility === "PRIVATE").length} private · ${allP.archived.length} archived

## Active (last push within 30 days)

${tableFull(allP.active)}

## Stale (>30 days)

${tableFull(allP.stale)}
${allP.archived.length ? `\n## Archived\n\n${tableFull(allP.archived)}` : ""}
`;

// Fingerprint = hash of repo data (no timestamps) so we can detect "no real change".
const fingerprintInput = repos.map((r) => ({
  name: r.name,
  visibility: r.visibility,
  description: r.description,
  isArchived: r.isArchived,
  isFork: r.isFork,
  stargazerCount: r.stargazerCount,
  pushedAt: r.pushedAt,
  primaryLanguage: r.primaryLanguage?.name || null,
  defaultBranch: r.defaultBranchRef?.name || null,
  openPRs: r.pullRequests.totalCount,
  openIssues: r.issues.totalCount,
}));
const fingerprint = createHash("sha256")
  .update(JSON.stringify(fingerprintInput))
  .digest("hex")
  .slice(0, 16);

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

write("00 System/Dashboard.md", publicMd);
write("private/GitHub Dashboard (full).md", fullMd);
write(".dashboard-fingerprint", fingerprint + "\n");

console.log(`✓ Wrote dashboard files. Fingerprint: ${fingerprint}`);
console.log(`  Total: ${all.length} repos (${pub.length} public)`);
