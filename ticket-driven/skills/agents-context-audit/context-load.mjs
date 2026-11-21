#!/usr/bin/env node
// Measures what fills the context window in Claude Code sessions, for /agents-context-audit.
// Read-only: reads the session transcripts under <config>/projects/<project-slug>/; writes only
// into --out (meant for a scratch folder outside the project).
//
// Usage:
//   node context-load.mjs [--project <path>] [--sessions N] [--days D] [--session <id>]
//                         [--include-current] [--dir <transcript folder>] [--out <dir>]
//   node context-load.mjs render <dir>   (reads <dir>/data.json + <dir>/findings.json, writes <dir>/context-load.html)
//
// Context size per model call is exact (the API's usage: input + cache read + cache creation).
// What filled it is attributed by the characters added between two calls and converted to
// tokens with a ratio observed in these sessions; those figures are estimates and labeled "≈".
// The transcript format is internal to Claude Code and may change; every field is read defensively.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SHELL = new Set(['Bash', 'PowerShell']);
const DELEGATION = new Set(['Agent', 'Task', 'Workflow']);
const BIG_RESULT_CHARS = 15000;

const args = parseArgs(process.argv.slice(2));
if (args._[0] === 'render') {
  render(args._[1] || '.', 'page-template.html', 'context-load.html');
} else {
  main();
}

// ── session discovery (same in both audit skills) ──────────────────────────────────────────────

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (!t.startsWith('--')) { a._.push(t); continue; }
    const v = argv[i + 1];
    if (v === undefined || v.startsWith('--')) a[t.slice(2)] = true;
    else { a[t.slice(2)] = v; i++; }
  }
  return a;
}

function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}

// Claude Code names a project's transcript folder after its path, every non-alphanumeric
// character replaced by '-'. Drive letters may differ in case, so match case-insensitively.
function transcriptDirs(projectPath) {
  if (args.dir) return [path.resolve(args.dir)];
  const root = path.join(configDir(), 'projects');
  const want = path.resolve(projectPath).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  let entries = [];
  try { entries = fs.readdirSync(root); } catch { return []; }
  return entries.filter(d => d.toLowerCase() === want).map(d => path.join(root, d));
}

function selectSessions(dirs) {
  const all = [];
  for (const dir of dirs) {
    for (const f of safeReaddir(dir)) {
      if (!f.endsWith('.jsonl')) continue;
      const file = path.join(dir, f);
      const id = f.slice(0, -'.jsonl'.length);
      const subDir = path.join(dir, id, 'subagents');
      const subagents = safeReaddir(subDir).filter(s => s.endsWith('.jsonl')).map(s => path.join(subDir, s));
      all.push({ id, file, mtime: fs.statSync(file).mtimeMs, subagents });
    }
  }
  all.sort((x, y) => y.mtime - x.mtime);
  if (args.session) return { picked: all.filter(s => s.id.startsWith(String(args.session))), skipped: null, available: all.length };
  // The newest transcript is usually the session running this audit; it would measure itself.
  const skipped = !args['include-current'] && all.length > 1 ? all.shift() : null;
  let picked = all;
  if (args.days) picked = picked.filter(s => s.mtime >= Date.now() - Number(args.days) * 86400000);
  picked = picked.slice(0, Number(args.sessions) || 10);
  return { picked, skipped: skipped && skipped.id, available: all.length + (skipped ? 1 : 0) };
}

function safeReaddir(dir) {
  try { return fs.readdirSync(dir); } catch { return []; }
}

function readJsonl(file) {
  const out = [];
  let text = '';
  try { text = fs.readFileSync(file, 'utf8'); } catch { return out; }
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try { out.push(JSON.parse(line)); } catch { /* torn last line of a running session */ }
  }
  return out;
}

// ── helpers ────────────────────────────────────────────────────────────────────────────────────

function textOf(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.map(c => {
    if (!c) return '';
    if (typeof c.text === 'string') return c.text;
    if (typeof c.content === 'string') return c.content;
    if (c.type === 'image') return ' '.repeat(6000); // an image costs roughly 1.5k tokens; counted as its char equivalent
    return '';
  }).join('\n');
}

// Only attachments with rendered text reach the model; the rest (UI snapshots, queues) stay local.
function attachmentText(o) {
  if (!Array.isArray(o.rendered)) return '';
  return o.rendered.map(r => textOf(r && r.content !== undefined ? [r] : [])).join('\n');
}

function redact(s, max = 140) {
  const clean = String(s || '')
    .replace(/(Bearer\s+)\S+/gi, '$1***')
    .replace(/((?:token|password|passwd|secret|api[_-]?key)\s*[=:]\s*)\S+/gi, '$1***')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > max ? clean.slice(0, max - 1) + '…' : clean;
}

// "cd x && npm --prefix frontend test -- --run" → "npm test"; "pwsh scripts/build.ps1" → "pwsh build.ps1"
function commandKey(cmd) {
  const segments = String(cmd || '').trim().split(/\s*(?:&&|\|\||;|\r?\n)\s*/).filter(Boolean);
  const isSetup = p => /^(cd|Set-Location|pushd|popd|export|set|source|echo|Write-Host)\b/i.test(p)
    || /^\$[\w:]+\s*=/.test(p)
    || /^[A-Za-z_]\w*=("[^"]*"|'[^']*'|\S*)\s*$/.test(p);
  const seg = (segments.find(p => !isSetup(p)) || segments[0] || '').split(/\s\|\s/)[0].replace(/^[(&\s]+/, '');
  const toks = seg.replace(/^([A-Za-z_]\w*=("[^"]*"|'[^']*'|\S+)\s+)+/, '')
    .replace(/^(timeout\s+\d+|time|nice)\s+/, '')
    .split(/\s+/).filter(t => t && !/^(\d?>|<|\|)/.test(t));
  const exe = (toks[0] || '?').replace(/^[&"']+|["']$/g, '').split(/[\\/]/).pop().replace(/\.(exe|cmd|bat)$/i, '');
  for (let i = 1; i < toks.length; i++) {
    const t = toks[i].replace(/^["']|["']$/g, '');
    if (t.startsWith('-')) {
      if (/^--?(prefix|manifest-path|project|C|cwd)$/i.test(t)) i++;
      continue;
    }
    if (/\.(ps1|sh|bash|mjs|cjs|js|ts|py)$/i.test(t)) return `${exe} ${t.split(/[\\/]/).pop()}`;
    if (/[\\/]/.test(t) || /\.\w+$/.test(t)) continue;
    return `${exe} ${t}`;
  }
  return exe;
}

function toolLabel(name, input) {
  if (SHELL.has(name)) return { group: `${name}: ${commandKey(input.command)}`, detail: redact(input.command) };
  if (DELEGATION.has(name)) return { group: `${name} result: ${input.subagent_type || 'default'}`, detail: redact(input.description || '') };
  if (name === 'Skill') return { group: `Skill: ${input.skill || '?'}`, detail: redact(input.skill || '') };
  if (input.file_path) return { group: name, detail: redact(input.file_path, 200), file: input.file_path };
  if (input.pattern) return { group: name, detail: redact(`${input.pattern}${input.path ? ' in ' + input.path : ''}`) };
  if (input.url) return { group: name, detail: redact(input.url) };
  if (name.startsWith('mcp__')) return { group: name.split('__').slice(0, 2).join('__') + '__*', detail: name };
  return { group: name, detail: redact(JSON.stringify(input)) };
}

function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((x, y) => x - y);
  return s[Math.floor((s.length - 1) / 2)];
}

function fmtK(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : String(Math.round(n));
}

function downsample(points, max) {
  if (points.length <= max) return points;
  const step = points.length / max;
  const out = [];
  for (let i = 0; i < max; i++) out.push(points[Math.floor(i * step)]);
  out.push(points[points.length - 1]);
  return out;
}

// ── analysis ───────────────────────────────────────────────────────────────────────────────────

function modelCalls(lines) {
  // One reply spans several lines (one per content block) sharing message.id and usage.
  const byId = new Map();
  lines.forEach((o, i) => {
    const m = o.type === 'assistant' && o.message;
    if (!m || !m.id || !m.usage) return;
    const e = byId.get(m.id) || { first: i, ts: o.timestamp };
    e.last = i; e.usage = m.usage;
    byId.set(m.id, e);
  });
  return [...byId.values()].map(e => {
    const u = e.usage;
    const read = u.cache_read_input_tokens || 0, created = u.cache_creation_input_tokens || 0;
    return { first: e.first, ts: e.ts, ctx: (u.input_tokens || 0) + read + created, read, created, out: u.output_tokens || 0 };
  }).filter(c => c.ctx > 0).sort((x, y) => x.first - y.first);
}

function analyzeSession(file, id) {
  const lines = readJsonl(file);
  const calls = modelCalls(lines);
  const uses = new Map();
  for (const o of lines) {
    if (o.type !== 'assistant' || !o.message || !Array.isArray(o.message.content)) continue;
    for (const c of o.message.content) if (c && c.type === 'tool_use') uses.set(c.id, { name: c.name || '?', input: c.input || {} });
  }

  // Everything a non-assistant line adds to the conversation, as items with a category. The
  // assistant's own share is taken exactly from output_tokens per call, not from its lines.
  const itemsOf = o => {
    const items = [];
    const content = o.message && o.message.content;
    if (o.type === 'attachment') {
      const chars = attachmentText(o).length;
      if (chars) items.push({ cat: `attachment: ${(o.attachment && o.attachment.type) || '?'}`, chars });
    } else if (o.type === 'user') {
      if (typeof content === 'string') items.push({ cat: o.isMeta ? 'injected: skill/command text' : 'user: messages', chars: content.length });
      else if (Array.isArray(content)) {
        for (const c of content) {
          if (!c) continue;
          if (c.type === 'tool_result') {
            const u = uses.get(c.tool_use_id) || { name: '?', input: {} };
            const l = toolLabel(u.name, u.input);
            const r = o.toolUseResult && typeof o.toolUseResult === 'object' ? o.toolUseResult : {};
            items.push({ cat: `tool: ${u.name}`, group: l.group, detail: l.detail, file: l.file, chars: textOf(c.content).length, tool: u.name, persisted: Boolean(r.persistedOutputPath) });
          } else if (c.type === 'text') {
            items.push({ cat: o.isMeta ? 'injected: skill/command text' : 'user: messages', chars: (c.text || '').length });
          } else if (c.type === 'image') {
            items.push({ cat: 'user: images', chars: 6000 });
          }
        }
      }
    }
    return items;
  };

  const windows = [];
  for (let k = 0; k < calls.length; k++) {
    const from = calls[k].first, to = k + 1 < calls.length ? calls[k + 1].first : lines.length;
    const items = [];
    let compactMarker = false;
    for (let i = from; i < to; i++) {
      const o = lines[i];
      if (o.isCompactSummary || (o.type === 'system' && /compact/i.test(o.subtype || ''))) compactMarker = true;
      items.push(...itemsOf(o));
    }
    if (calls[k].out) items.push({ cat: 'assistant: output (text, tool calls, thinking)', chars: 0, tokens: calls[k].out, own: true });
    windows.push({ k, items, compactMarker, delta: k + 1 < calls.length ? calls[k + 1].ctx - calls[k].ctx : null });
  }
  // Items before the first call belong to the first request (prompt, attachments, instructions).
  const initial = [];
  for (let i = 0; i < (calls[0] ? calls[0].first : lines.length); i++) initial.push(...itemsOf(lines[i]));

  const compactions = [], rebuilds = [];
  windows.forEach(w => {
    if (w.delta === null) return;
    const before = calls[w.k].ctx, after = calls[w.k + 1].ctx;
    if (w.compactMarker || (before > 20000 && after < before * 0.7)) compactions.push({ at: w.k + 1, before, after, marker: w.compactMarker });
  });
  calls.forEach((c, k) => {
    if (k > 0 && c.created > c.ctx * 0.5 && c.ctx > 20000) {
      const gapMin = (Date.parse(c.ts) - Date.parse(calls[k - 1].ts)) / 60000;
      rebuilds.push({ at: k, tokens: c.created, gapMin: Math.round(gapMin) });
    }
  });

  return {
    id, calls, windows, initial, compactions, rebuilds,
    static: staticSources(lines),
  };
}

function staticSources(lines) {
  // Listings and instructions as they were first injected in this session.
  const first = {};
  for (const o of lines) {
    if (o.type !== 'attachment' || !o.attachment) continue;
    const t = o.attachment.type;
    if (first[t] || !['skill_listing', 'agent_listing_delta', 'instructions', 'mcp_instructions_delta', 'deferred_tools_delta', 'nested_memory', 'environment', 'auto_mode', 'session_context'].includes(t)) continue;
    first[t] = o;
  }
  const out = { items: [], skills: [], agents: [], files: [] };
  for (const [t, o] of Object.entries(first)) out.items.push({ source: t, chars: attachmentText(o).length });
  const sl = first.skill_listing && first.skill_listing.attachment;
  if (sl && typeof sl.content === 'string') {
    out.skillCount = sl.skillCount || null;
    for (const line of sl.content.split('\n')) {
      const m = /^- (\S+?):\s/.exec(line);
      if (m) out.skills.push({ name: m[1], chars: line.length });
    }
  }
  const al = first.agent_listing_delta && first.agent_listing_delta.attachment;
  if (al && Array.isArray(al.addedLines)) {
    for (const line of al.addedLines) {
      const m = /^- (\S+?):\s/.exec(line);
      if (m) out.agents.push({ name: m[1], chars: line.length });
    }
  }
  const ins = first.instructions && first.instructions.attachment;
  if (ins && Array.isArray(ins.files)) {
    for (const f of ins.files) out.files.push({ path: f.path, type: f.type || null, chars: (f.content || '').length });
  }
  return out;
}

function classifySkill(name, projectPath) {
  if (name.includes(':')) return 'plugin';
  if (fs.existsSync(path.join(projectPath, '.claude', 'skills', name))) return 'project';
  if (fs.existsSync(path.join(configDir(), 'skills', name))) return 'user';
  return 'built-in';
}

function classifyAgent(name, projectPath) {
  if (fs.existsSync(path.join(projectPath, '.claude', 'agents', `${name}.md`))) return 'project';
  if (fs.existsSync(path.join(configDir(), 'agents', `${name}.md`))) return 'user';
  return name.includes(':') ? 'plugin' : 'built-in';
}

function main() {
  const projectPath = path.resolve(args.project || process.cwd());
  const dirs = transcriptDirs(projectPath);
  if (!dirs.length) {
    console.log(`No transcript folder found for ${projectPath} under ${path.join(configDir(), 'projects')}.`);
    console.log('Pass --dir <folder> if Claude Code stores this project elsewhere.');
    process.exit(1);
  }
  const { picked, skipped, available } = selectSessions(dirs);
  if (!picked.length) { console.log('No sessions match the selection.'); process.exit(1); }

  const analyzed = picked.map(s => ({ ...analyzeSession(s.file, s.id), mtime: s.mtime, subagentFiles: s.subagents }))
    .filter(a => a.calls.length);
  if (!analyzed.length) { console.log('The selected sessions hold no model calls with usage data.'); process.exit(1); }

  // Observed tokens per character: per window, growth minus the exact assistant output over the
  // characters added in between; the median over windows, so reminders the transcript doesn't
  // show can't skew it. Compaction windows left out. Falls back to 1 token ≈ 4 chars.
  const ratios = [];
  for (const a of analyzed) for (const w of a.windows) {
    if (w.delta === null || w.delta <= 0 || w.compactMarker) continue;
    const chars = w.items.reduce((t, i) => t + i.chars, 0);
    const input = w.delta - w.items.filter(i => i.own).reduce((t, i) => t + i.tokens, 0);
    if (chars > 2000 && input > 0) ratios.push(input / chars);
  }
  const ratio = ratios.length >= 10 ? Math.min(0.45, Math.max(0.18, median(ratios))) : 0.25;
  const tok = chars => Math.round(chars * ratio);
  for (const a of analyzed) {
    for (const i of a.initial) i.tokens = tok(i.chars);
    for (const w of a.windows) {
      for (const i of w.items) if (i.tokens === undefined) i.tokens = tok(i.chars);
      // Growth no line explains: harness reminders without rendered text, thinking kept for the turn, estimate error.
      const rest = w.delta === null ? 0 : w.delta - w.items.reduce((t, i) => t + i.tokens, 0);
      if (rest > 500 && !w.compactMarker) w.items.push({ cat: 'not attributable', chars: 0, tokens: rest });
    }
  }

  const categories = {}, groups = {}, reads = {}, big = [], steps = [];
  let persisted = 0;
  for (const a of analyzed) {
    const all = [...a.initial.map(i => ({ ...i, k: -1 })), ...a.windows.flatMap(w => w.items.map(i => ({ ...i, k: w.k })))];
    for (const i of all) {
      categories[i.cat] = (categories[i.cat] || 0) + i.tokens;
      if (i.group) {
        const g = groups[i.group] || { group: i.group, n: 0, chars: 0, max: 0 };
        g.n++; g.chars += i.chars; g.max = Math.max(g.max, i.chars);
        groups[i.group] = g;
      }
      if (i.tool === 'Read' && i.file) {
        const key = `${a.id}|${i.file}`;
        const r = reads[key] || { session: a.id.slice(0, 8), file: i.file, n: 0, chars: 0 };
        r.n++; r.chars += i.chars;
        reads[key] = r;
      }
      if (i.persisted) persisted++;
      if (i.chars >= BIG_RESULT_CHARS && i.cat.startsWith('tool:')) big.push({ session: a.id.slice(0, 8), what: i.group, detail: i.detail, chars: i.chars, tokens: tok(i.chars) });
    }
    for (const w of a.windows) {
      if (w.delta === null || w.delta <= 0) continue;
      const top = [...w.items].sort((x, y) => y.tokens - x.tokens).slice(0, 3)
        .map(i => ({ label: i.group || i.cat, detail: i.detail || '', tokens: i.tokens }));
      steps.push({ session: a.id.slice(0, 8), at: w.k + 1, delta: w.delta, ctxAfter: a.calls[w.k + 1].ctx, top });
    }
  }

  const sessions = analyzed.sort((x, y) => x.mtime - y.mtime).map(a => {
    const ctxs = a.calls.map(c => c.ctx);
    const subagents = a.subagentFiles.map(f => {
      const c = modelCalls(readJsonl(f));
      return { file: path.basename(f), calls: c.length, peak: c.length ? Math.max(...c.map(x => x.ctx)) : 0 };
    });
    return {
      id: a.id, start: a.calls[0].ts, end: a.calls[a.calls.length - 1].ts, calls: a.calls.length,
      first: ctxs[0], peak: Math.max(...ctxs), final: ctxs[ctxs.length - 1],
      processed: ctxs.reduce((t, c) => t + c, 0), output: a.calls.reduce((t, c) => t + c.out, 0),
      cacheCreated: a.calls.reduce((t, c) => t + c.created, 0),
      compactions: a.compactions, rebuilds: a.rebuilds,
      timeline: downsample(a.calls.map((c, i) => ({ i, ctx: c.ctx })), 400),
      subagents,
    };
  });

  const newest = analyzed.reduce((x, y) => (y.mtime > x.mtime ? y : x));
  const st = newest.static;
  const data = {
    kind: 'context-load', generatedAt: new Date().toISOString(), project: path.basename(projectPath),
    transcriptDirs: dirs, sessionsAvailable: available, skippedCurrent: skipped,
    tokensPerChar: Number(ratio.toFixed(3)), ratioObserved: ratios.length >= 10,
    sessions,
    baseline: { medianFirstCall: median(sessions.map(s => s.first)), fromSession: newest.id },
    static: {
      items: st.items.map(i => ({ ...i, tokens: tok(i.chars) })).sort((x, y) => y.chars - x.chars),
      skillCount: st.skillCount ?? st.skills.length,
      skills: st.skills.map(s => ({ ...s, tokens: tok(s.chars), origin: classifySkill(s.name, projectPath) })).sort((x, y) => y.chars - x.chars),
      agents: st.agents.map(s => ({ ...s, tokens: tok(s.chars), origin: classifyAgent(s.name, projectPath) })).sort((x, y) => y.chars - x.chars),
      files: st.files.map(f => ({ ...f, tokens: tok(f.chars) })),
    },
    categories: Object.entries(categories).map(([cat, tokens]) => ({ cat, tokens })).sort((x, y) => y.tokens - x.tokens),
    groups: Object.values(groups).map(g => ({ ...g, tokens: tok(g.chars), maxTokens: tok(g.max) })).sort((x, y) => y.chars - x.chars).slice(0, 30),
    steps: steps.sort((x, y) => y.delta - x.delta).slice(0, 20),
    repeatedReads: Object.values(reads).filter(r => r.n > 1).map(r => ({ ...r, file: redact(r.file, 200), tokens: tok(r.chars) })).sort((x, y) => y.chars - x.chars).slice(0, 20),
    bigResults: big.sort((x, y) => y.chars - x.chars).slice(0, 20),
    persistedOutputs: persisted,
  };

  if (args.out) {
    fs.mkdirSync(args.out, { recursive: true });
    fs.writeFileSync(path.join(args.out, 'data.json'), JSON.stringify(data, null, 1));
  }
  printSummary(data);
}

function printSummary(d) {
  console.log(`# Context load — ${d.project}`);
  console.log(`sessions: ${d.sessions.length} of ${d.sessionsAvailable}${d.skippedCurrent ? ` (skipped current ${d.skippedCurrent.slice(0, 8)})` : ''} · tokens per char ${d.tokensPerChar}${d.ratioObserved ? ' (observed)' : ' (default)'}`);
  console.log('\n## Sessions (tokens; exact from API usage)');
  console.log('session   calls  first   peak  final  processed  compactions  cache rebuilds');
  for (const s of d.sessions) {
    console.log(`${s.id.slice(0, 8)} ${String(s.calls).padStart(6)} ${fmtK(s.first).padStart(6)} ${fmtK(s.peak).padStart(6)} ${fmtK(s.final).padStart(6)} ${fmtK(s.processed).padStart(10)} ${String(s.compactions.length).padStart(12)} ${String(s.rebuilds.length).padStart(15)}`);
    for (const sub of s.subagents.filter(x => x.peak > 50000)) console.log(`   subagent ${sub.file}: ${sub.calls} calls, peak ${fmtK(sub.peak)}`);
  }
  console.log(`baseline (median first call): ${fmtK(d.baseline.medianFirstCall)}`);
  console.log(`\n## Static load, session ${d.baseline.fromSession.slice(0, 8)} (≈ tokens)`);
  for (const i of d.static.items) console.log(`${fmtK(i.tokens).padStart(7)}  ${i.source}`);
  for (const f of d.static.files) console.log(`${fmtK(f.tokens).padStart(7)}    instructions file: ${f.path}${f.type ? ' (' + f.type + ')' : ''}`);
  console.log(`skills listed: ${d.static.skillCount}; longest descriptions:`);
  for (const s of d.static.skills.slice(0, 8)) console.log(`${fmtK(s.tokens).padStart(7)}    ${s.name} [${s.origin}]`);
  console.log(`agents listed: ${d.static.agents.length}; longest:`);
  for (const s of d.static.agents.slice(0, 5)) console.log(`${fmtK(s.tokens).padStart(7)}    ${s.name} [${s.origin}]`);
  console.log('\n## What filled the context, all sessions (≈ tokens)');
  for (const c of d.categories.slice(0, 14)) console.log(`${fmtK(c.tokens).padStart(7)}  ${c.cat}`);
  console.log('\n## Tool results by group (≈ tokens; n; largest)');
  for (const g of d.groups.slice(0, 12)) console.log(`${fmtK(g.tokens).padStart(7)} ${String(g.n).padStart(5)} ${fmtK(g.maxTokens).padStart(7)}  ${g.group}`);
  console.log('\n## Biggest growth steps (exact delta; top causes ≈)');
  for (const s of d.steps.slice(0, 10)) console.log(`+${fmtK(s.delta).padStart(6)} → ${fmtK(s.ctxAfter).padStart(6)}  ${s.session}#${s.at}  ${s.top.map(t => `${t.label} ${fmtK(t.tokens)}${t.detail ? ' (' + t.detail.slice(0, 70) + ')' : ''}`).join('; ')}`);
  if (d.repeatedReads.length) {
    console.log('\n## Files read more than once in a session');
    for (const r of d.repeatedReads.slice(0, 10)) console.log(`${fmtK(r.tokens).padStart(7)} ${r.n}×  ${r.session} ${r.file}`);
  }
  if (d.bigResults.length) {
    console.log(`\n## Single tool results over ${BIG_RESULT_CHARS} chars`);
    for (const b of d.bigResults.slice(0, 10)) console.log(`${fmtK(b.tokens).padStart(7)}  ${b.session} ${b.what}  ${b.detail}`);
  }
  console.log(`\noutputs persisted to file instead of context: ${d.persistedOutputs}`);
  if (args.out) console.log(`data written to ${path.join(args.out, 'data.json')}`);
}

// ── render (same in both audit skills) ─────────────────────────────────────────────────────────

function render(dir, templateName, outName) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, 'data.json'), 'utf8'));
  let findings = {};
  try { findings = JSON.parse(fs.readFileSync(path.join(dir, 'findings.json'), 'utf8')); }
  catch { console.log('findings.json missing or invalid — rendering the measurements only.'); }
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const payload = JSON.stringify({ data, findings }).replace(/</g, '\\u003c');
  const html = fs.readFileSync(path.join(HERE, templateName), 'utf8')
    .replace('__TITLE__', esc(findings.title || `Context load ${data.project}`))
    .replace('__REPORT_DATA__', () => payload);
  const out = path.join(dir, outName);
  fs.writeFileSync(out, html);
  console.log(`written ${out}`);
}
