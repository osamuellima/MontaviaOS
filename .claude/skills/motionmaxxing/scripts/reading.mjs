#!/usr/bin/env node
// reading.mjs - reading-pace check: how many words per second does the viewer get, and is there a beat after the last word?
//
// Usage:  node reading.mjs <final.mp4 | final.mp4.events.json | events.json> [--max-wps 4.0] [--warn-wps 3.4] [--min-tail 1.0] [--json]
//
// Reads the events render.mjs writes (window.__events). M.words() marks every word with { host, i, n }, so a "sentence" is one
// M.words() call: first word onset -> last word onset. The sentence is readable until its end, found in this order:
//   an `exit` event whose label is the sentence's host (e.g. "#L2") or a `readend` mark you place yourself
//   (M.mark(frame, 'readend', '#host'), for text that stops being readable without an exit: a camera pull-back, a cover) ->
//   the next sentence on the SAME host -> a guess. In short: an `exit` of the host or a `readend` mark (earliest) -> the next sentence on the SAME host -> a guess (the next `cut`, else
//   the last event). The source is printed in the "by" column; guesses carry a hint. Add a `readend` mark when the text lives inside an
//   object the camera leaves (tickets, cards) and nothing replaces it.
//
//   w/s    words / (readable_until - first onset)      > --warn-wps WARN (tight), > --max-wps FAIL (too fast)
//   tail   readable_until - last word onset            < --min-tail  WARN (no beat to finish reading; a word needs ~0.4 s to land)
// Defaults are starting values, not law: 3.4 w/s ~ 200 wpm, 4.0 w/s ~ 240 wpm (fast adult silent reading); a 1-3 word line is never
// flagged for speed. Exit: 0 PASS/WARN, 1 FAIL, 2 bad usage. Not a gate: a lead about reading time, taste decides.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(args.length ? 0 : 2); }
const opt = { 'max-wps': 4.0, 'warn-wps': 3.4, 'min-tail': 1.0 }; let json = false, src = null;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--json') json = true;
  else if (a.startsWith('--') && a.slice(2) in opt) { const v = Number(args[++i]); if (!Number.isFinite(v) || v <= 0) { console.error(`error: ${a} needs a positive number`); process.exit(2); } opt[a.slice(2)] = v; }
  else if (!src) src = a; else { console.error('error: unexpected argument ' + a); process.exit(2); }
}
const file = fs.existsSync(src) && /\.json$/.test(src) ? src : (fs.existsSync(src + '.events.json') ? src + '.events.json' : null);
if (!file) { console.error(`error: no events file for ${src} (looked for ${src}.events.json); render with scripts/render.mjs first`); process.exit(2); }
const ev = JSON.parse(fs.readFileSync(file, 'utf8')).sort((a, b) => a.frame - b.frame);
const fps = ev.find((e) => e.t > 0 && e.frame > 0) ? Math.round(ev.find((e) => e.t > 0 && e.frame > 0).frame / ev.find((e) => e.t > 0 && e.frame > 0).t) : 30;
const words = ev.filter((e) => e.type === 'word');
if (!words.length) { console.error('error: no word events (the film does not use M.words)'); process.exit(2); }

// ---- group words into sentences: one M.words() call per host (i === 0 starts a new one); old runtimes (no host) fall back to 0.8 s gaps
const groups = []; const open = new Map(); let legacy = false;
for (const w of words) {
  if (w.host === undefined) {
    legacy = true; const g = open.get('') ;
    if (!g || w.frame - g.last > 0.8 * fps) { const ng = { host: '', words: [], first: w.frame, last: w.frame }; groups.push(ng); open.set('', ng); }
    const cur = open.get(''); cur.words.push(w.label); cur.last = w.frame; continue;
  }
  let g = open.get(w.host);
  if (!g || w.i === 0) { g = { host: w.host, words: [], first: w.frame, last: w.frame, n: w.n }; groups.push(g); open.set(w.host, g); }
  g.words.push(w.label); g.last = w.frame;
}
// the film may schedule hides after its own end: cap the "last event" at the real duration when the video sits next to the events file
let lastFrame = ev[ev.length - 1].frame;
try {
  const vid = file.replace(/\.events\.json$/, '');
  if (vid !== file && fs.existsSync(vid)) { const d = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', vid], { encoding: 'utf8' })); if (d > 0) lastFrame = Math.min(lastFrame, Math.round(d * fps)); }
} catch (e) { /* no ffprobe: keep the last event */ }
groups.sort((a, b) => a.first - b.first);
for (let k = 0; k < groups.length; k++) {
  const g = groups[k];
  // the next sentence on the SAME host replaces this one (tickets sharing a class, a caption line, ...): explicit ends must come before it
  const nextSame = groups.slice(k + 1).find((x) => x.host === g.host && x.first > g.last);
  const limit = nextSame ? nextSame.first : Infinity, c = [];
  const rd = ev.find((e) => e.type === 'readend' && e.frame >= g.last && e.frame <= limit && (!e.label || !g.host || e.label === g.host || e.label.startsWith(g.host)));
  if (rd) c.push({ f: rd.frame, by: 'readend' });
  const ex = ev.find((e) => e.type === 'exit' && g.host && e.label === g.host && e.frame >= g.last && e.frame <= limit);
  if (ex) c.push({ f: ex.frame, by: 'exit' });
  if (!c.length && nextSame) c.push({ f: nextSame.first, by: 'next on same host' });
  if (!c.length) {                                               // nothing explicit: a guess, printed as one (other texts may share the screen)
    const ct = ev.find((e) => e.type === 'cut' && e.frame > g.last);
    c.push(ct ? { f: ct.frame, by: 'cut (guess)' } : { f: lastFrame, by: 'last event (guess)' });
  }
  c.sort((a, b) => a.f - b.f); g.end = c[0].f; g.by = c[0].by;
}
// ---- metrics + verdicts
const rows = groups.map((g) => {
  const n = g.words.length, vis = (g.end - g.first) / fps, span = (g.last - g.first) / fps, tail = (g.end - g.last) / fps, wps = vis > 0 ? n / vis : Infinity;
  const flags = [];
  if (n > 3 && wps > opt['max-wps']) flags.push(['FAIL', `too fast: ${wps.toFixed(1)} w/s (max ${opt['max-wps']})`]);
  else if (n > 3 && wps > opt['warn-wps']) flags.push(['WARN', `tight: ${wps.toFixed(1)} w/s (warn above ${opt['warn-wps']})`]);
  if (n > 1 && tail < opt['min-tail']) flags.push(['WARN', `only ${tail.toFixed(2)} s after the last word starts (min ${opt['min-tail']} s)`]);
  return { t0: +(g.first / fps).toFixed(2), host: g.host, words: n, span: +span.toFixed(2), until: +(g.end / fps).toFixed(2), by: g.by, visible: +vis.toFixed(2), wps: +wps.toFixed(2), tail: +tail.toFixed(2), text: g.words.join(' '), flags };
});
const status = rows.some((r) => r.flags.some((f) => f[0] === 'FAIL')) ? 'FAIL' : rows.some((r) => r.flags.length) ? 'WARN' : 'PASS';
const totW = rows.reduce((s, r) => s + r.words, 0), totT = rows.reduce((s, r) => s + r.visible, 0);
if (json) { console.log(JSON.stringify({ file, fps, thresholds: opt, status, words: totW, meanWps: +(totW / totT).toFixed(2), sentences: rows }, null, 1)); }
else {
  console.log(`reading.mjs ${file}  ${rows.length} sentences, ${totW} words${legacy ? '  (old runtime: no host marks, sentences guessed by 0.8 s gaps)' : ''}`);
  console.log('t0     words  span   until   by                    vis    w/s   tail   text');
  for (const r of rows) {
    console.log(`${String(r.t0.toFixed(2)).padStart(5)}  ${String(r.words).padStart(4)}  ${r.span.toFixed(2).padStart(5)}  ${r.until.toFixed(2).padStart(6)}  ${r.by.padEnd(20)}  ${r.visible.toFixed(2).padStart(5)}  ${(r.words > 1 ? r.wps.toFixed(1) : '-').padStart(4)}  ${r.tail.toFixed(2).padStart(5)}  ${r.text.slice(0, 58)}${r.text.length > 58 ? '...' : ''}`);
    for (const [sev, msg] of r.flags) console.log(`       ${sev}: ${msg}${r.by.includes('guess') ? '  (end is a guess: add M.mark(frame, "readend", "' + (r.host || '#host') + '") if the text is readable for a shorter or longer time)' : ''}`);
  }
  console.log(`READING: ${status}   mean ${(totW / totT).toFixed(1)} w/s over the time sentences are readable   (a lead about reading time, not a gate)`);
}
process.exit(status === 'FAIL' ? 1 : 0);
