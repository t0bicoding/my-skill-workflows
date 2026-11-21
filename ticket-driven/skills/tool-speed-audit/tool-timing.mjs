#!/usr/bin/env node
// Measures where tool-call time goes in Claude Code sessions, for /tool-speed-audit.
// Read-only: reads the session transcripts under <config>/projects/<project-slug>/ and the
// Claude Code settings files; writes only into --out (meant for a scratch folder outside the project).
//
// Usage:
//   node tool-timing.mjs [--project <path>] [--sessions N] [--days D] [--session <id>]
//                        [--include-current] [--dir <transcript folder>] [--out <dir>]
//   node tool-timing.mjs render <dir>   (reads <dir>/data.json + <dir>/findings.json, writes <dir>/tool-speed.html)
//
// The transcript format is internal to Claude Code and may change; every field is read defensively
// and a missing one shows up as a gap in the output, never as a crash.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DELEGATION = new Set(['Agent', 'Task', 'Workflow']);
const SHELL = new Set(['Bash', 'PowerShell']);
// Tools whose wall time is the human answering, not the machine working.
const HUMAN = new Set(['AskUserQuestion', 'ExitPlanMode', 'EnterPlanMode']);

const args = parseArgs(process.argv.slice(2));
if (args._[0] === 'render') {
  render(args._[1] || '.', 'page-template.html', 'tool-speed.html');
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
  return content.map(c => (c && typeof c.text === 'string' ? c.text : '')).join('\n');
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

function callKey(name, input) {
  if (SHELL.has(name)) return commandKey(input.command);
  if (DELEGATION.has(name)) return `${name}: ${input.subagent_type || input.name || 'default'}`;
  if (name.startsWith('mcp__')) return name.split('__').slice(0, 2).join('__') + '__*';
  return name;
}

function describeInput(name, input) {
  if (SHELL.has(name)) return redact(input.command);
  if (input.file_path) return redact(input.file_path);
  if (input.pattern) return redact(`${input.pattern}${input.path ? ' in ' + input.path : ''}`);
  if (input.url) return redact(input.url);
  if (input.description) return redact(input.description);
  return redact(JSON.stringify(input));
}

function pct(arr, p) {
  if (!arr.length) return 0;
  const s = [...arr].sort((x, y) => x - y);
  return s[Math.min(s.length - 1, Math.round(p * (s.length - 1)))];
}

function unionMs(intervals) {
  const s = intervals.filter(([a, b]) => b > a).sort((x, y) => x[0] - y[0]);
  let total = 0, cs = null, ce = null;
  for (const [a, b] of s) {
    if (cs === null || a > ce) { if (cs !== null) total += ce - cs; cs = a; ce = b; }
    else if (b > ce) ce = b;
  }
  if (cs !== null) total += ce - cs;
  return total;
}

function fmtMs(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m${String(Math.round(s % 60)).padStart(2, '0')}s`;
  return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}m`;
}

// ── analysis ───────────────────────────────────────────────────────────────────────────────────

function analyzeTranscript(file, scope, sessionId) {
  const lines = readJsonl(file);
  // Each content block of a reply is its own line; a tool starts once its reply is fully written,
  // so the clock starts at the reply's last line, not at the tool_use line (that would bill
  // generating the rest of the reply, e.g. a long Write input, to the tool).
  const replyEnd = new Map();
  for (const o of lines) {
    const id = o.type === 'assistant' && o.message && o.message.id;
    const ts = Date.parse(o.timestamp);
    if (id && !Number.isNaN(ts)) replyEnd.set(id, Math.max(replyEnd.get(id) || 0, ts));
  }
  const uses = new Map();
  const calls = [];
  const hooks = {};
  let modelMs = 0, prevTs = null, prevType = null, first = null, last = null, costState = null;

  for (const o of lines) {
    const ts = Date.parse(o.timestamp);
    if (o.type === 'cost-state') costState = o;
    if (o.type === 'attachment' && o.attachment && /^hook/i.test(o.attachment.type || '')) {
      const k = `${o.attachment.type}${o.attachment.hookName ? ' · ' + o.attachment.hookName : ''}`;
      hooks[k] = (hooks[k] || 0) + 1;
    }
    if ((o.type !== 'assistant' && o.type !== 'user') || Number.isNaN(ts)) continue;
    if (first === null) first = ts;
    last = ts;
    // Gap before an assistant line is generation time; before a tool result it is tool time
    // (measured per call below); before a typed prompt it is the human, not counted.
    if (o.type === 'assistant' && prevTs !== null && prevType !== null) modelMs += Math.max(0, ts - prevTs);
    prevTs = ts; prevType = o.type;

    const content = o.message && Array.isArray(o.message.content) ? o.message.content : [];
    if (o.type === 'assistant') {
      for (const c of content) {
        if (c && c.type === 'tool_use') uses.set(c.id, { name: c.name || '?', input: c.input || {}, start: Math.max(ts, replyEnd.get(o.message.id) || 0) });
      }
      continue;
    }
    for (const c of content) {
      if (!c || c.type !== 'tool_result') continue;
      const u = uses.get(c.tool_use_id);
      if (!u) continue;
      const r = o.toolUseResult && typeof o.toolUseResult === 'object' ? o.toolUseResult : {};
      const pd = o.permissionDecision || {};
      const text = textOf(c.content);
      const isError = c.is_error === true;
      calls.push({
        session: sessionId, scope, name: u.name, key: callKey(u.name, u.input), what: describeInput(u.name, u.input),
        start: u.start, end: ts, wallMs: Math.max(0, ts - u.start),
        reportedMs: typeof r.durationMs === 'number' ? r.durationMs : null,
        error: isError, interrupted: r.interrupted === true,
        timedOut: isError && /timed out|timeout/i.test(text.slice(0, 400)),
        human: HUMAN.has(u.name),
        prompted: typeof pd.source === 'string' && pd.source.startsWith('user') && !HUMAN.has(u.name),
        permission: pd.reasonType || pd.source || 'none',
        denied: pd.decision === 'reject' || pd.decision === 'deny',
        background: Boolean(r.backgroundTaskId || u.input.run_in_background),
        resultChars: text.length,
        sleep: SHELL.has(u.name) && /\b(sleep|Start-Sleep)\b|timeout\s+\/t/i.test(String(u.input.command || '')),
      });
    }
  }
  return { calls, hooks, modelMs, first, last, costState };
}

function isMachine(c) {
  return !DELEGATION.has(c.name) && !c.human;
}

function readSettings(projectPath) {
  const files = [
    path.join(configDir(), 'settings.json'),
    path.join(configDir(), 'settings.local.json'),
    path.join(projectPath, '.claude', 'settings.json'),
    path.join(projectPath, '.claude', 'settings.local.json'),
  ];
  const out = [];
  for (const file of files) {
    let json;
    try { json = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { continue; }
    const hooks = [];
    for (const [event, groups] of Object.entries(json.hooks || {})) {
      for (const g of Array.isArray(groups) ? groups : []) {
        for (const h of g.hooks || []) hooks.push({ event, matcher: g.matcher || '*', command: redact(h.command || h.url || h.type, 120), timeout: h.timeout ?? null, async: h.async === true });
      }
    }
    const p = json.permissions || {};
    out.push({
      file, hooks,
      statusLine: json.statusLine ? redact(json.statusLine.command || json.statusLine.type, 120) : null,
      allow: (p.allow || []).length, deny: (p.deny || []).length, ask: (p.ask || []).length,
      defaultMode: p.defaultMode || null,
    });
  }
  return out;
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

  const calls = [], sessions = [], hooksSeen = {};
  for (const s of picked) {
    const main = analyzeTranscript(s.file, 'main', s.id);
    calls.push(...main.calls);
    for (const [k, n] of Object.entries(main.hooks)) hooksSeen[k] = (hooksSeen[k] || 0) + n;
    let subCalls = 0;
    for (const f of s.subagents) {
      const sub = analyzeTranscript(f, 'subagent', s.id);
      calls.push(...sub.calls);
      subCalls += sub.calls.length;
      for (const [k, n] of Object.entries(sub.hooks)) hooksSeen[k] = (hooksSeen[k] || 0) + n;
    }
    const own = main.calls.filter(isMachine);
    const cs = main.costState;
    sessions.push({
      id: s.id, start: main.first, end: main.last, calls: main.calls.length, subagentCalls: subCalls,
      toolMs: unionMs(own.filter(c => !c.prompted).map(c => [c.start, c.end])),
      approvalMs: own.filter(c => c.prompted).reduce((t, c) => t + c.wallMs, 0),
      humanMs: main.calls.filter(c => c.human).reduce((t, c) => t + c.wallMs, 0),
      subagentMs: unionMs(main.calls.filter(c => DELEGATION.has(c.name)).map(c => [c.start, c.end])),
      modelMs: main.modelMs,
      reported: cs ? { toolMs: cs.totalToolDuration ?? null, apiMs: cs.totalAPIDuration ?? null, totalMs: cs.totalDuration ?? null } : null,
    });
  }

  // Groups: own tool work only; delegated agents run their own tools, counted under scope "subagent".
  const groups = new Map();
  for (const c of calls) {
    if (!isMachine(c)) continue;
    const g = groups.get(c.key) || { key: c.key, tool: c.name, n: 0, totalMs: 0, walls: [], errors: 0, prompts: 0, promptMs: 0, timeouts: 0, background: 0, subagent: 0, example: c.what };
    g.n++; g.totalMs += c.wallMs; g.walls.push(c.wallMs);
    if (c.error) g.errors++;
    if (c.prompted) { g.prompts++; g.promptMs += c.wallMs; }
    if (c.timedOut || c.interrupted) g.timeouts++;
    if (c.background) g.background++;
    if (c.scope === 'subagent') g.subagent++;
    groups.set(c.key, g);
  }
  const groupList = [...groups.values()].map(g => ({ ...g, medianMs: pct(g.walls, 0.5), p90Ms: pct(g.walls, 0.9), maxMs: Math.max(...g.walls), walls: undefined }))
    .sort((x, y) => y.totalMs - x.totalMs);

  const own = calls.filter(isMachine);
  const byPermission = {};
  for (const c of own) {
    const p = byPermission[c.permission] || { permission: c.permission, n: 0, walls: [] };
    p.n++; p.walls.push(c.wallMs);
    byPermission[c.permission] = p;
  }
  const slowest = [...own].sort((x, y) => y.wallMs - x.wallMs).slice(0, 20)
    .map(c => ({ session: c.session.slice(0, 8), scope: c.scope, key: c.key, what: c.what, wallMs: c.wallMs, reportedMs: c.reportedMs, error: c.error, prompted: c.prompted, timedOut: c.timedOut || c.interrupted }));

  // A retry: the same key again within the next three calls of the same transcript after a failure.
  const retries = new Map();
  const byTranscript = new Map();
  for (const c of own) {
    const k = `${c.session}|${c.scope}`;
    if (!byTranscript.has(k)) byTranscript.set(k, []);
    byTranscript.get(k).push(c);
  }
  for (const list of byTranscript.values()) {
    list.sort((x, y) => x.start - y.start);
    list.forEach((c, i) => {
      if (!c.error) return;
      if (!list.slice(i + 1, i + 4).some(n => n.key === c.key)) return;
      const r = retries.get(c.key) || { key: c.key, failedAttempts: 0, lostMs: 0, example: c.what };
      r.failedAttempts++; r.lostMs += c.wallMs;
      retries.set(c.key, r);
    });
  }

  const sleeps = own.filter(c => c.sleep);
  const delegated = calls.filter(c => DELEGATION.has(c.name));
  const data = {
    kind: 'tool-timing', generatedAt: new Date().toISOString(), project: path.basename(projectPath),
    transcriptDirs: dirs, sessionsAvailable: available, skippedCurrent: skipped,
    sessions,
    totals: {
      calls: own.length, mainCalls: own.filter(c => c.scope === 'main').length,
      wallMs: own.reduce((t, c) => t + c.wallMs, 0),
      errors: own.filter(c => c.error).length, prompts: own.filter(c => c.prompted).length,
      denied: own.filter(c => c.denied).length, timeouts: own.filter(c => c.timedOut || c.interrupted).length,
      sleepMs: sleeps.reduce((t, c) => t + c.wallMs, 0), sleeps: sleeps.length,
      humanCalls: calls.filter(c => c.human).length, humanMs: calls.filter(c => c.human).reduce((t, c) => t + c.wallMs, 0),
      delegatedCalls: delegated.length, delegatedWallMs: delegated.reduce((t, c) => t + c.wallMs, 0),
    },
    groups: groupList.slice(0, 40),
    byPermission: Object.values(byPermission).map(p => ({ permission: p.permission, n: p.n, medianMs: pct(p.walls, 0.5), p90Ms: pct(p.walls, 0.9) })).sort((x, y) => y.n - x.n),
    slowest,
    retries: [...retries.values()].sort((x, y) => y.lostMs - x.lostMs).slice(0, 15),
    sleeps: sleeps.sort((x, y) => y.wallMs - x.wallMs).slice(0, 10).map(c => ({ what: c.what, wallMs: c.wallMs })),
    hooksSeen,
    settings: readSettings(projectPath),
  };

  if (args.out) {
    fs.mkdirSync(args.out, { recursive: true });
    fs.writeFileSync(path.join(args.out, 'data.json'), JSON.stringify(data, null, 1));
  }
  printSummary(data);
}

function printSummary(d) {
  const t = d.totals;
  const sum = k => d.sessions.reduce((a, s) => a + s[k], 0);
  const days = d.sessions.map(s => s.start).filter(Boolean).sort();
  console.log(`# Tool timing — ${d.project}`);
  console.log(`sessions: ${d.sessions.length} of ${d.sessionsAvailable}${d.skippedCurrent ? ` (skipped current ${d.skippedCurrent.slice(0, 8)})` : ''}, ${days.length ? new Date(days[0]).toISOString().slice(0, 10) + ' … ' + new Date(days[days.length - 1]).toISOString().slice(0, 10) : ''}`);
  console.log(`time split, main chains: tools ${fmtMs(sum('toolMs'))} · approval waits ${fmtMs(sum('approvalMs'))} · your answers ${fmtMs(sum('humanMs'))} · subagents ${fmtMs(sum('subagentMs'))} · model ${fmtMs(sum('modelMs'))}`);
  console.log(`own tool calls: ${t.calls} (${t.mainCalls} main) · wall sum ${fmtMs(t.wallMs)} · errors ${t.errors} · prompts ${t.prompts} (denied ${t.denied}) · timeouts/interrupts ${t.timeouts} · sleeps ${t.sleeps} (${fmtMs(t.sleepMs)})`);
  console.log(`delegated: ${t.delegatedCalls} agent calls, ${fmtMs(t.delegatedWallMs)} wall · questions to you: ${t.humanCalls}, ${fmtMs(t.humanMs)}`);
  console.log(`by permission path (median / p90): ${d.byPermission.map(p => `${p.permission} ${p.n}× ${fmtMs(p.medianMs)}/${fmtMs(p.p90Ms)}`).join(' · ')}`);
  console.log('\n## Slowest groups (total wall)');
  console.log('   total     n  median     p90     max  err  ask  key');
  for (const g of d.groups.slice(0, 15)) {
    console.log(`${fmtMs(g.totalMs).padStart(8)} ${String(g.n).padStart(5)} ${fmtMs(g.medianMs).padStart(7)} ${fmtMs(g.p90Ms).padStart(7)} ${fmtMs(g.maxMs).padStart(7)} ${String(g.errors).padStart(4)} ${String(g.prompts).padStart(4)}  ${g.key}`);
  }
  console.log('\n## Slowest single calls');
  for (const c of d.slowest.slice(0, 10)) {
    console.log(`${fmtMs(c.wallMs).padStart(8)}  ${c.session} ${c.scope === 'subagent' ? 'sub ' : ''}${c.error ? 'ERR ' : ''}${c.prompted ? 'ASK ' : ''}${c.timedOut ? 'TIMEOUT ' : ''}${c.what}`);
  }
  if (d.retries.length) {
    console.log('\n## Failed attempts followed by a retry');
    for (const r of d.retries.slice(0, 8)) console.log(`${fmtMs(r.lostMs).padStart(8)}  ${r.failedAttempts}×  ${r.key}  (${r.example})`);
  }
  if (d.sleeps.length) {
    console.log('\n## Sleeps / polling');
    for (const s of d.sleeps.slice(0, 5)) console.log(`${fmtMs(s.wallMs).padStart(8)}  ${s.what}`);
  }
  console.log('\n## Hooks and settings');
  const seen = Object.entries(d.hooksSeen);
  console.log(`hook events in transcripts: ${seen.length ? seen.map(([k, n]) => `${k} ×${n}`).join(', ') : 'none'}`);
  for (const s of d.settings) {
    console.log(`${s.file}: allow ${s.allow}, deny ${s.deny}, ask ${s.ask}${s.defaultMode ? ', mode ' + s.defaultMode : ''}${s.statusLine ? ', statusLine: ' + s.statusLine : ''}`);
    for (const h of s.hooks) console.log(`  hook ${h.event} [${h.matcher}]${h.async ? ' async' : ''}${h.timeout ? ' timeout ' + h.timeout : ''}: ${h.command}`);
  }
  if (args.out) console.log(`\ndata written to ${path.join(args.out, 'data.json')}`);
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
    .replace('__TITLE__', esc(findings.title || `Tool speed ${data.project}`))
    .replace('__REPORT_DATA__', () => payload);
  const out = path.join(dir, outName);
  fs.writeFileSync(out, html);
  console.log(`written ${out}`);
}
