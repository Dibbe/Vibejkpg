// Kontrollerar att playbooken följer konventionerna i CONTRIBUTING.md.
// Kör: node scripts/kontrollera.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const IGNORERADE_MAPPAR = new Set(['.git', '.obsidian', '.superpowers', '.trash', 'node_modules']);
const CALLOUTS = new Set(['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION']);
const NYCKLAR = ['titel', 'typ', 'niva', 'tags', 'forfattare', 'senast-uppdaterad'];
const FILNAMN = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;

const blanka = (m) => m.replace(/[^\n]/g, ' ');

export function rensaKod(text) {
  return text
    .replace(/~~~[\s\S]*?~~~/g, blanka)
    .replace(/```[\s\S]*?```/g, blanka)
    .replace(/<!--[\s\S]*?-->/g, blanka)
    .replace(/`[^`\n]*`/g, blanka);
}

export function hittaLankar(text) {
  const re = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  return [...rensaKod(text).matchAll(re)].map((m) => m[1]);
}

// existsSync ignorerar skiftläge på Windows och macOS, men GitHub gör det inte.
function finnsExakt(rot, mal) {
  if (!existsSync(mal)) return false;
  const rel = relative(rot, mal);
  if (rel.startsWith('..')) return true;
  let mapp = rot;
  for (const del of rel.split(sep).filter(Boolean)) {
    if (!readdirSync(mapp).includes(del)) return false;
    mapp = join(mapp, del);
  }
  return true;
}

function arExtern(lank) {
  return /^[a-z][a-z0-9+.-]*:/i.test(lank) || lank.startsWith('#');
}

export function kontrolleraFil(absVag, text, rot) {
  const fel = [];
  for (const lank of hittaLankar(text)) {
    if (arExtern(lank)) continue;
    let vag;
    try {
      vag = decodeURIComponent(lank.split('#')[0]);
    } catch {
      fel.push(`Ogiltig länk: ${lank}`);
      continue;
    }
    const mal = vag.startsWith('/') ? join(rot, vag) : resolve(dirname(absVag), vag);
    if (!finnsExakt(rot, mal)) fel.push(`Trasig länk: ${lank}`);
  }
  const ren = rensaKod(text);
  if (/\[\[[^\]]+\]\]/.test(ren)) fel.push('Wikilink hittad – använd en vanlig Markdown-länk');
  for (const m of ren.matchAll(/^>\s*\[!([A-Za-z]+)\]/gm)) {
    if (!CALLOUTS.has(m[1].toUpperCase())) fel.push(`Callout-typ som GitHub inte stöder: ${m[1]}`);
  }
  return fel;
}

function arInnehall(relVag) {
  const forsta = relVag.split('/')[0];
  return /^0\d-/.test(forsta) || forsta === 'mallar';
}

export function kontrolleraFilnamn(relVag) {
  if (!arInnehall(relVag)) return [];
  const namn = relVag.split('/').at(-1);
  if (namn === 'README.md' || FILNAMN.test(namn)) return [];
  return [`Filnamnet ska vara gemener, siffror och bindestreck (t.ex. mitt-tips.md): ${namn}`];
}

export function kontrolleraFrontmatter(relVag, text) {
  if (!arInnehall(relVag) || relVag.endsWith('/README.md')) return [];
  const m = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return ['Frontmatter saknas'];
  const nycklar = new Set(m[1].split('\n').map((rad) => rad.split(':')[0].trim()));
  return NYCKLAR.filter((n) => !nycklar.has(n)).map((n) => `Frontmatter saknar nyckel: ${n}`);
}

function markdownFiler(mapp) {
  return readdirSync(mapp, { withFileTypes: true }).flatMap((d) => {
    const ignorera = IGNORERADE_MAPPAR.has(d.name) || (d.name === 'superpowers' && mapp.endsWith('docs'));
    if (d.isDirectory()) return ignorera ? [] : markdownFiler(join(mapp, d.name));
    return d.name.endsWith('.md') ? [join(mapp, d.name)] : [];
  });
}

function main() {
  const rot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const filer = markdownFiler(rot);
  let antalFel = 0;
  for (const absVag of filer) {
    const relVag = relative(rot, absVag).split(sep).join('/');
    const text = readFileSync(absVag, 'utf8');
    const fel = [
      ...kontrolleraFilnamn(relVag),
      ...kontrolleraFrontmatter(relVag, text),
      ...kontrolleraFil(absVag, text, rot),
    ];
    for (const f of fel) console.log(`${relVag}: ${f}`);
    antalFel += fel.length;
  }
  if (antalFel > 0) {
    console.log(`\n${antalFel} fel hittades.`);
    process.exit(1);
  }
  console.log(`OK: ${filer.length} filer kontrollerade`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
