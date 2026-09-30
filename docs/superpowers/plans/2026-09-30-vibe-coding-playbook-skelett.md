# Vibe coding-playbook v1 (skelett och mallar) – implementationsplan

> **För agentiska arbetare:** OBLIGATORISK UNDERSKILL: Använd superpowers:subagent-driven-development (rekommenderas) eller superpowers:executing-plans för att genomföra planen uppgift för uppgift. Stegen använder kryssrutor (`- [ ]`) för uppföljning.

**Mål:** Bygga playbookens skelett: mappstruktur, navigation, mallar, bidragsflöde och Obsidian-konfiguration. Inget sakinnehåll ingår.

**Arkitektur:** Repot består av vanliga Markdown-filer ordnade efter läsarens resa (`00-`–`06-`), plus GitHub-konfiguration (`.github/`) och Obsidian-konfiguration (`.obsidian/`). Ett litet Node-skript utan beroenden (`scripts/kontrollera.mjs`) kontrollerar att repot följer konventionerna: länkar, filnamn, frontmatter och callouts. Skriptet är testet för alla innehållsuppgifter.

**Teknik:** Markdown, GitHub issue forms (YAML), Obsidian (kärnpluginet Templates), Node 24 (`node:test`, `node:fs`), `gh` CLI.

**Spec:** `docs/superpowers/specs/2026-09-30-vibe-coding-playbook-design.md`

## Globala krav

- Språk: svenska i all text riktad till läsare och bidragsgivare.
- Filnamn i `0X-*/` och `mallar/`: `^[a-z0-9]+(-[a-z0-9]+)*\.md$` eller `README.md`. Inga å, ä, ö och inga mellanslag.
- Länkar: bara vanliga Markdown-länkar med relativa sökvägar. Inga `[[wikilinks]]`, inga `![[embeds]]` och ingen Dataview.
- Callouts: bara `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` och `[!CAUTION]`.
- Frontmatter-nycklar (alla sidor i `0X-*/` utom `README.md`, samt alla mallar): `titel`, `typ`, `niva`, `tags`, `forfattare`, `senast-uppdaterad`.
- `typ`: `tips | verktygsguide | kapitel`. `niva`: `nyborjare | van | alla`.
- Repo: `Dibbe/Vibejkpg`. Formulärlänkar har formen `https://github.com/Dibbe/Vibejkpg/issues/new?template=<fil>.yml`.
- Etiketter: `tips`, `verktygsguide` och `rattelse`.
- Kontaktväg i uppförandekoden: bestäms av användaren före uppgift 5 (se Öppen fråga).
- Inga npm-beroenden.

## Öppen fråga (måste besvaras före uppgift 5)

- **KONTAKTVÄG:** Vart ska överträdelser av uppförandekoden rapporteras (till exempel en e-postadress eller en namngiven moderator i er chatt)? Värdet ersätter `KONTAKTVÄG` i uppgift 5, steg 2.

## Granskningsfokus

1. **Länk med ankare eller URL-kodning** (`../fil.md#rubrik`, `min%20fil.md`) ska räknas som giltig när filen finns. Testas i uppgift 1.
2. **Länk eller wikilink inuti kodblock, inline-kod eller HTML-kommentar** (mallarnas instruktioner och promptexempel) ska inte ge fel. Testas i uppgift 1.
3. **Filer sparade med CRLF på Windows** ska klara frontmatterkontrollen. Testas i uppgift 1.
4. **Länk till en mapp** (`02-verktyg/`) ska räknas som giltig när mappen finns. Testas i uppgift 1.
5. **Issue-formulär syns bara från standardgrenen.** Före merge ska det inte rapporteras som fel att formulären saknas på GitHub. Verifieras efter merge i uppgift 6.

---

## Filstruktur

| Fil | Ansvar |
|---|---|
| `scripts/kontrollera.mjs` | Konventionskontroll. CLI och exporterade funktioner |
| `scripts/kontrollera.test.mjs` | Tester för kontrollskriptet (`node --test`) |
| `mallar/tips.md`, `mallar/verktygsguide.md`, `mallar/kapitel.md` | Mallar |
| `.obsidian/app.json`, `.obsidian/templates.json` | Delade Obsidian-inställningar |
| `.gitignore` | Personliga Obsidian-filer |
| `bilder/.gitkeep` | Bildmapp |
| `0X-*/README.md` | Mappbeskrivning och innehållsförteckning |
| `00-borja-har/for-icke-programmerare.md`, `for-utvecklare.md` | Tomma spårsidor (kapitelmall) |
| `00-borja-har/obsidian.md` | Guide: öppna repot som vault |
| `.github/ISSUE_TEMPLATE/*.yml` | Tre formulär och `config.yml` |
| `.github/pull_request_template.md` | PR-checklista |
| `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `README.md` | Rotdokument |

---

### Uppgift 1: Kontrollskript

**Filer:**
- Skapa: `scripts/kontrollera.mjs`
- Test: `scripts/kontrollera.test.mjs`

**Gränssnitt:**
- Producerar: `node scripts/kontrollera.mjs` returnerar exit 0 och skriver `OK: <n> filer kontrollerade` när allt är rätt. Annars returneras exit 1 och en rad per fel i formatet `<relativ sökväg>: <felmeddelande>`. Senare uppgifter kör kommandot som test.
- Exporterar: `rensaKod(text) → string`, `hittaLankar(text) → string[]`, `kontrolleraFil(absVag, text, rot) → string[]`, `kontrolleraFilnamn(relVag) → string[]`, `kontrolleraFrontmatter(relVag, text) → string[]`.

- [ ] **Steg 1: Skriv de fallerande testerna**

`scripts/kontrollera.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  hittaLankar, kontrolleraFil, kontrolleraFilnamn, kontrolleraFrontmatter,
} from './kontrollera.mjs';

function skapaRot() {
  const rot = mkdtempSync(join(tmpdir(), 'playbook-'));
  mkdirSync(join(rot, '02-verktyg'));
  writeFileSync(join(rot, '02-verktyg', 'cursor.md'), '# Cursor\n');
  writeFileSync(join(rot, 'README.md'), '# Rot\n');
  return rot;
}

test('hittar vanliga länkar och bildlänkar', () => {
  assert.deepEqual(hittaLankar('[a](x.md) och ![b](bilder/y.png "titel")'), ['x.md', 'bilder/y.png']);
});

test('ignorerar länkar i kodblock, inline-kod och HTML-kommentarer', () => {
  const text = '```\n[a](finns-inte.md)\n```\n~~~\n[d](nej.md)\n~~~\n`[b](nej.md)`\n<!-- [c](nej.md) -->\n';
  assert.deepEqual(hittaLankar(text), []);
});

test('giltig relativ länk ger inga fel', () => {
  const rot = skapaRot();
  assert.deepEqual(kontrolleraFil(join(rot, 'README.md'), '[C](02-verktyg/cursor.md)', rot), []);
});

test('länk med ankare och URL-kodning räknas som giltig', () => {
  const rot = skapaRot();
  writeFileSync(join(rot, 'min fil.md'), '# x\n');
  const text = '[C](02-verktyg/cursor.md#kom-igang) [D](min%20fil.md)';
  assert.deepEqual(kontrolleraFil(join(rot, 'README.md'), text, rot), []);
});

test('länk till befintlig mapp är giltig', () => {
  const rot = skapaRot();
  assert.deepEqual(kontrolleraFil(join(rot, 'README.md'), '[V](02-verktyg/)', rot), []);
});

test('trasig länk rapporteras', () => {
  const rot = skapaRot();
  assert.deepEqual(kontrolleraFil(join(rot, 'README.md'), '[X](saknas.md)', rot), ['Trasig länk: saknas.md']);
});

test('externa länkar och ankare kontrolleras inte', () => {
  const rot = skapaRot();
  const text = '[a](https://example.com) [b](mailto:a@b.se) [c](#rubrik)';
  assert.deepEqual(kontrolleraFil(join(rot, 'README.md'), text, rot), []);
});

test('wikilink rapporteras men inte i kodblock', () => {
  const rot = skapaRot();
  const fil = join(rot, 'README.md');
  assert.equal(kontrolleraFil(fil, 'Se [[cursor]]', rot).length, 1);
  assert.deepEqual(kontrolleraFil(fil, '```\n[[cursor]]\n```', rot), []);
});

test('bara GitHub-callouts är tillåtna', () => {
  const rot = skapaRot();
  const fil = join(rot, 'README.md');
  assert.deepEqual(kontrolleraFil(fil, '> [!TIP]\n> bra', rot), []);
  assert.deepEqual(kontrolleraFil(fil, '> [!note]\n> ok', rot), []);
  assert.deepEqual(kontrolleraFil(fil, '> [!example]\n> nej', rot), ['Callout-typ som GitHub inte stöder: example']);
});

test('filnamn i innehållsmappar måste vara gemener med bindestreck', () => {
  assert.deepEqual(kontrolleraFilnamn('05-tips/borja-med-en-plan.md'), []);
  assert.deepEqual(kontrolleraFilnamn('05-tips/README.md'), []);
  assert.equal(kontrolleraFilnamn('05-tips/Börja med plan.md').length, 1);
  assert.equal(kontrolleraFilnamn('mallar/Tips.md').length, 1);
  assert.deepEqual(kontrolleraFilnamn('CONTRIBUTING.md'), []);
  assert.deepEqual(kontrolleraFilnamn('docs/superpowers/specs/2026-09-30-x.md'), []);
});

const FULL = '---\ntitel: X\ntyp: tips\nniva: alla\ntags: []\nforfattare: A\nsenast-uppdaterad: 2026-09-30\n---\n# X\n';

test('frontmatter med alla nycklar godkänns, även med CRLF', () => {
  assert.deepEqual(kontrolleraFrontmatter('05-tips/x.md', FULL), []);
  assert.deepEqual(kontrolleraFrontmatter('05-tips/x.md', FULL.replace(/\n/g, '\r\n')), []);
});

test('saknad frontmatter eller nyckel rapporteras', () => {
  assert.deepEqual(kontrolleraFrontmatter('05-tips/x.md', '# X\n'), ['Frontmatter saknas']);
  assert.deepEqual(
    kontrolleraFrontmatter('05-tips/x.md', FULL.replace('forfattare: A\n', '')),
    ['Frontmatter saknar nyckel: forfattare'],
  );
});

test('README och filer utanför innehållsmappar kräver ingen frontmatter', () => {
  assert.deepEqual(kontrolleraFrontmatter('05-tips/README.md', '# Tips\n'), []);
  assert.deepEqual(kontrolleraFrontmatter('CONTRIBUTING.md', '# Bidra\n'), []);
});

test('mallar kräver frontmatter', () => {
  assert.deepEqual(kontrolleraFrontmatter('mallar/tips.md', '# X\n'), ['Frontmatter saknas']);
});
```

- [ ] **Steg 2: Kör testerna och se att de fallerar**

Kör: `node --test scripts/`
Förväntat: FAIL med `Cannot find module ... kontrollera.mjs`.

- [ ] **Steg 3: Skriv implementationen**

`scripts/kontrollera.mjs`:

```js
// Kontrollerar att playbooken följer konventionerna i CONTRIBUTING.md.
// Kör: node scripts/kontrollera.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const IGNORERADE_MAPPAR = new Set(['.git', '.obsidian', '.trash', 'node_modules']);
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
    if (!existsSync(mal)) fel.push(`Trasig länk: ${lank}`);
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
```

- [ ] **Steg 4: Kör testerna och se att de går igenom**

Kör: `node --test scripts/`
Förväntat: alla tester PASS.

- [ ] **Steg 5: Kör skriptet på repot**

Kör: `node scripts/kontrollera.mjs`
Förväntat: `OK: 1 filer kontrollerade` och exit 0. Bara `README.md` räknas, eftersom `docs/superpowers/` (spec och plan, processdokument) hoppas över.

- [ ] **Steg 6: Commit**

```bash
git add scripts/
git commit -m "Lägg till kontrollskript för playbookens konventioner"
```

---

### Uppgift 2: Mallar och Obsidian-konfiguration

**Filer:**
- Skapa: `mallar/tips.md`, `mallar/verktygsguide.md`, `mallar/kapitel.md`
- Skapa: `.obsidian/app.json`, `.obsidian/templates.json`, `.gitignore`, `bilder/.gitkeep`

**Gränssnitt:**
- Förbrukar: `node scripts/kontrollera.mjs` (uppgift 1).
- Producerar: `mallar/kapitel.md` används som grund för spårsidorna i uppgift 3. Mallnamnen länkas från CONTRIBUTING i uppgift 5.

- [ ] **Steg 1: Skapa ett fallerande test**

Skapa `mallar/tips.md` med bara innehållet `# Tips` (utan frontmatter).
Kör: `node scripts/kontrollera.mjs`
Förväntat: exit 1 med `mallar/tips.md: Frontmatter saknas`.

- [ ] **Steg 2: Skriv `mallar/tips.md`**

~~~markdown
---
titel:
typ: tips
niva: alla
tags: []
forfattare:
senast-uppdaterad: YYYY-MM-DD
---

<!--
Så här använder du mallen:
1. Kopiera filen till 05-tips/ och döp den med gemener och bindestreck, t.ex. borja-med-en-plan.md
2. Fyll i frontmattern ovan. niva: nyborjare, van eller alla.
3. Skriv tipset under rubrikerna. Håll det kort – ett tips ska få plats på en skärm.
4. Lägg till tipset i listan i 05-tips/README.md.
5. Ta bort den här kommentaren.
-->

# Rubrik på tipset

## Problemet

<!-- Vilken situation eller vilket misstag hjälper tipset mot? -->

## Tipset

<!-- Själva tipset, i en eller några meningar. -->

## Exempel

<!-- Visa hur det ser ut i praktiken, gärna med en prompt i ett kodblock. -->

```text
Skriv din exempelprompt här
```

## Varför det fungerar

<!-- En kort förklaring. -->
~~~

- [ ] **Steg 3: Skriv `mallar/verktygsguide.md`**

~~~markdown
---
titel:
typ: verktygsguide
niva: nyborjare
tags: []
forfattare:
senast-uppdaterad: YYYY-MM-DD
verktyg:
webbplats:
kostnad:
kraver-kodvana: nej
---

<!--
Så här använder du mallen:
1. Kopiera filen till 02-verktyg/ och döp den efter verktyget, t.ex. claude-code.md
2. Fyll i frontmattern. kraver-kodvana: ja eller nej.
3. Skriv för någon som aldrig använt verktyget förut.
4. Lägg till guiden i listan i 02-verktyg/README.md.
5. Ta bort den här kommentaren.
-->

# Verktygets namn

## Vad det är och för vem

<!-- Vad gör verktyget? Passar det bäst för icke-programmerare, utvecklare eller båda? -->

## Kom igång steg för steg

<!-- Numrerade steg från konto/installation till att verktyget är redo. -->

1. 

## Första projektet

<!-- Ett litet projekt som läsaren kan bygga på 15–30 minuter, med exempelprompter. -->

## Styrkor och svagheter

<!-- Vad är verktyget bra på? Var kommer man till korta? -->

## Vanliga fällor

<!-- Misstag nybörjare ofta gör med just det här verktyget. -->

## Kostnad

<!-- Gratisnivå, priser och vad som kostar. Ange datum, t.ex. "Per 2026-09-30:". -->

> [!NOTE]
> Priser ändras ofta. Kontrollera alltid verktygets egen prissida.
~~~

- [ ] **Steg 4: Skriv `mallar/kapitel.md`**

~~~markdown
---
titel:
typ: kapitel
niva: alla
tags: []
forfattare:
senast-uppdaterad: YYYY-MM-DD
---

<!--
Så här använder du mallen:
1. Kopiera filen till rätt mapp (01-grunder/, 03-arbetsflode/ osv.) och döp den med gemener och bindestreck.
2. Fyll i frontmattern.
3. Lägg till sidan i listan i mappens README.md.
4. Ta bort den här kommentaren.
-->

# Kapitlets titel

## Sammanfattning

<!-- Två–tre meningar: vad läsaren får ut av sidan. -->

## Innehåll

<!-- Själva innehållet. Använd underrubriker (###) vid behov. -->

## Läs vidare

<!-- Länka till nästa naturliga steg, t.ex. [Välj ett verktyg](../02-verktyg/README.md). -->
~~~

- [ ] **Steg 5: Skriv Obsidian-konfigurationen och `.gitignore`**

`.obsidian/app.json`:

```json
{
  "useMarkdownLinks": true,
  "newLinkFormat": "relative",
  "attachmentFolderPath": "bilder",
  "userIgnoreFilters": ["docs/superpowers/", "scripts/"]
}
```

`.obsidian/templates.json`:

```json
{
  "folder": "mallar"
}
```

`.gitignore`:

```gitignore
# Personliga Obsidian-filer
.obsidian/workspace*.json
.obsidian/plugins/
.obsidian/themes/
.obsidian/snippets/
.obsidian/cache
.obsidian/graph.json
.obsidian/appearance.json
.obsidian/hotkeys.json
.obsidian/core-plugins*.json
.obsidian/community-plugins.json
.trash/
```

Skapa `bilder/.gitkeep` som en tom fil.

- [ ] **Steg 6: Kör kontrollen**

Kör: `node scripts/kontrollera.mjs && node -e "JSON.parse(require('fs').readFileSync('.obsidian/app.json'));JSON.parse(require('fs').readFileSync('.obsidian/templates.json'));console.log('JSON OK')"`
Förväntat: `OK: ...` och `JSON OK`.

- [ ] **Steg 7: Commit**

```bash
git add mallar/ .obsidian/ .gitignore bilder/.gitkeep
git commit -m "Lägg till mallar och delad Obsidian-konfiguration"
```

---

### Uppgift 3: Mappstruktur och navigation

**Filer:**
- Skapa: `00-borja-har/README.md`, `00-borja-har/for-icke-programmerare.md`, `00-borja-har/for-utvecklare.md`, `00-borja-har/obsidian.md`
- Skapa: `01-grunder/README.md`, `02-verktyg/README.md`, `03-arbetsflode/README.md`, `04-best-practices/README.md`, `05-tips/README.md`, `06-resurser/README.md`

**Gränssnitt:**
- Förbrukar: mallarna från uppgift 2 och kontrollskriptet från uppgift 1.
- Producerar: mappsökvägarna ovan, som länkas från rot-README och CONTRIBUTING i uppgift 5. Varje mapp-README länkar till `../CONTRIBUTING.md`, som skapas i uppgift 5. Därför fallerar kontrollen med exakt de länkarna tills uppgift 5 är klar. Det är förväntat.

- [ ] **Steg 1: Skriv mapparnas README-filer**

Alla sex följer samma form. Exakt innehåll:

`01-grunder/README.md`:

```markdown
# 01 – Grunder

Vad vibe coding är, hur AI-verktygen fungerar och vilket tankesätt som hjälper. Här hör ordlista, begrepp och grundprinciper hemma.

## Sidor

Inga sidor ännu – [bidra](../CONTRIBUTING.md)!
```

`02-verktyg/README.md`:

```markdown
# 02 – Verktyg

En guide per verktyg: hur du kommer igång, vad verktyget passar för och vad det kostar. Varje guide följer [verktygsguidemallen](../mallar/verktygsguide.md).

## Guider

Inga guider ännu – [bidra](../CONTRIBUTING.md)!
```

`03-arbetsflode/README.md`:

```markdown
# 03 – Arbetsflöde

Från idé till färdig app: planera, skriva prompter, iterera, felsöka och publicera.

## Sidor

Inga sidor ännu – [bidra](../CONTRIBUTING.md)!
```

`04-best-practices/README.md`:

```markdown
# 04 – Best practices

Det som skiljer ett hållbart projekt från ett som faller ihop: säkerhet, versionshantering med Git, testning och att hålla koll på kostnader.

## Sidor

Inga sidor ännu – [bidra](../CONTRIBUTING.md)!
```

`05-tips/README.md`:

```markdown
# 05 – Tips

Korta, fristående tips från communityn. Ett tips per fil, enligt [tipsmallen](../mallar/tips.md).

## Tips

Inga tips ännu – [bidra](../CONTRIBUTING.md)!
```

`06-resurser/README.md`:

```markdown
# 06 – Resurser

Länkar, kurser, communityer och träffar – bland annat Vibe Coders Jönköping.

## Sidor

Inga sidor ännu – [bidra](../CONTRIBUTING.md)!
```

`00-borja-har/README.md`:

```markdown
# 00 – Börja här

Ny på vibe coding? Välj det spår som passar dig bäst.

## Sidor

- [För dig som aldrig har programmerat](for-icke-programmerare.md)
- [För dig som kan koda men är ny på AI-verktyg](for-utvecklare.md)
- [Läsa och skriva playbooken i Obsidian](obsidian.md)
```

- [ ] **Steg 2: Skriv spårsidorna**

`00-borja-har/for-icke-programmerare.md`:

~~~markdown
---
titel: För dig som aldrig har programmerat
typ: kapitel
niva: nyborjare
tags: [spar]
forfattare: Vibe Coders Jönköping
senast-uppdaterad: 2026-09-30
---

# För dig som aldrig har programmerat

## Sammanfattning

Den här sidan ska guida dig från noll till ditt första lilla projekt. Den är inte skriven ännu – [bidra](../CONTRIBUTING.md)!

## Innehåll

## Läs vidare

- [Grunder](../01-grunder/README.md)
- [Välj ett verktyg](../02-verktyg/README.md)
~~~

`00-borja-har/for-utvecklare.md`:

~~~markdown
---
titel: För dig som kan koda men är ny på AI-verktyg
typ: kapitel
niva: van
tags: [spar]
forfattare: Vibe Coders Jönköping
senast-uppdaterad: 2026-09-30
---

# För dig som kan koda men är ny på AI-verktyg

## Sammanfattning

Den här sidan ska hjälpa dig att använda AI-verktyg i ditt vanliga utvecklingsarbete. Den är inte skriven ännu – [bidra](../CONTRIBUTING.md)!

## Innehåll

## Läs vidare

- [Arbetsflöde](../03-arbetsflode/README.md)
- [Best practices](../04-best-practices/README.md)
~~~

- [ ] **Steg 3: Skriv `00-borja-har/obsidian.md`**

~~~markdown
---
titel: Läsa och skriva playbooken i Obsidian
typ: kapitel
niva: alla
tags: [obsidian, bidra]
forfattare: Vibe Coders Jönköping
senast-uppdaterad: 2026-09-30
---

# Läsa och skriva playbooken i Obsidian

## Sammanfattning

Hela playbooken är vanliga Markdown-filer, så du kan öppna repot som ett vault i [Obsidian](https://obsidian.md). Inställningarna för länkar och mallar följer med, så du behöver inte ställa in något själv.

## Innehåll

### Öppna repot som vault

1. Klona repot (eller din fork) till din dator:
   ```bash
   git clone https://github.com/Dibbe/Vibejkpg.git
   ```
2. Öppna Obsidian och välj **Open folder as vault**.
3. Välj mappen `Vibejkpg`.

### Skapa en ny sida från en mall

1. Skapa en ny fil i rätt mapp, till exempel `05-tips/mitt-tips.md`.
2. Öppna kommandopaletten (`Ctrl/Cmd + P`) och välj **Templates: Insert template**.
3. Välj `tips`, `verktygsguide` eller `kapitel`.

> [!TIP]
> Filnamn skrivs med gemener och bindestreck, utan å, ä och ö – till exempel `borja-med-en-plan.md`. Den läsbara titeln skriver du i `titel` och som rubrik.

### Regler som gör att sidan ser rätt ut på GitHub

Playbooken läses främst på GitHub. Obsidian är redan inställt för det mesta, men tänk på det här:

- **Länkar:** Använd vanliga Markdown-länkar, `[Cursor](../02-verktyg/cursor.md)`. Obsidian skapar dem automatiskt när du länkar med `[[`, tack vare de delade inställningarna.
- **Inga embeds eller Dataview:** `![[...]]` och Dataview-frågor syns inte på GitHub.
- **Callouts:** Bara `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` och `[!CAUTION]`.
- **Bilder:** Hamnar automatiskt i `bilder/`.

### Skicka in dina ändringar

Obsidian sköter bara själva skrivandet. För att skicka in en ändring behöver du Git och en pull request – se spår 3 i [CONTRIBUTING](../CONTRIBUTING.md).

Innan du skickar in kan du kontrollera dina ändringar (kräver [Node.js](https://nodejs.org)):

```bash
node scripts/kontrollera.mjs
```

## Läs vidare

- [Så bidrar du](../CONTRIBUTING.md)
~~~

- [ ] **Steg 4: Kör kontrollen**

Kör: `node scripts/kontrollera.mjs`
Förväntat: exit 1. De enda felen ska vara `Trasig länk: ../CONTRIBUTING.md`, som CONTRIBUTING skapas i uppgift 5. Alla andra fel ska rättas.

- [ ] **Steg 5: Commit**

```bash
git add 00-borja-har/ 01-grunder/ 02-verktyg/ 03-arbetsflode/ 04-best-practices/ 05-tips/ 06-resurser/
git commit -m "Lägg till mappstruktur, navigation och Obsidian-guide"
```

---

### Uppgift 4: Issue-formulär och PR-mall

**Filer:**
- Skapa: `.github/ISSUE_TEMPLATE/config.yml`, `nytt-tips.yml`, `foresla-verktygsguide.yml`, `fel-eller-inaktuellt.yml`
- Skapa: `.github/pull_request_template.md`

**Gränssnitt:**
- Producerar: formulärfilnamnen `nytt-tips.yml`, `foresla-verktygsguide.yml` och `fel-eller-inaktuellt.yml`, som länkas från README och CONTRIBUTING i uppgift 5. Etiketterna `tips`, `verktygsguide` och `rattelse`.

- [ ] **Steg 1: Skriv ett fallerande YAML-test**

Kör: `npx --yes js-yaml .github/ISSUE_TEMPLATE/nytt-tips.yml`
Förväntat: fel, eftersom filen inte finns.

- [ ] **Steg 2: Skriv `config.yml` och formulären**

`.github/ISSUE_TEMPLATE/config.yml`:

```yaml
blank_issues_enabled: false
```

`.github/ISSUE_TEMPLATE/nytt-tips.yml`:

```yaml
name: "💡 Nytt tips"
description: Dela ett tips om vibe coding. Du behöver inte kunna Git.
title: "[Tips]: "
labels: ["tips"]
body:
  - type: markdown
    attributes:
      value: |
        Tack för att du delar med dig! Fyll i fälten nedan. En moderator gör om tipset till en sida i playbooken och nämner dig som författare.
  - type: input
    id: rubrik
    attributes:
      label: Rubrik
      description: En kort rubrik som sammanfattar tipset.
      placeholder: Be AI:n om en plan innan den skriver kod
    validations:
      required: true
  - type: textarea
    id: problem
    attributes:
      label: Vilket problem löser det?
      description: Vilken situation eller vilket misstag hjälper tipset mot?
    validations:
      required: true
  - type: textarea
    id: tipset
    attributes:
      label: Tipset
    validations:
      required: true
  - type: textarea
    id: exempel
    attributes:
      label: Exempel eller prompt
      description: Valfritt. Visa gärna en prompt du använt.
    validations:
      required: false
  - type: dropdown
    id: niva
    attributes:
      label: Nivå
      options:
        - Nybörjare
        - Van
        - Alla
    validations:
      required: true
  - type: dropdown
    id: verktyg
    attributes:
      label: Verktyg
      options:
        - Verktygsoberoende
        - Claude Code
        - Cursor
        - Lovable
        - Bolt
        - v0
        - Annat
    validations:
      required: true
```

`.github/ISSUE_TEMPLATE/foresla-verktygsguide.yml`:

```yaml
name: "🧰 Föreslå en verktygsguide"
description: Tipsa om ett verktyg som borde ha en guide i playbooken.
title: "[Verktygsguide]: "
labels: ["verktygsguide"]
body:
  - type: input
    id: verktyg
    attributes:
      label: Verktyg
      placeholder: Till exempel Replit
    validations:
      required: true
  - type: input
    id: webbplats
    attributes:
      label: Webbplats
      placeholder: https://
    validations:
      required: true
  - type: textarea
    id: varfor
    attributes:
      label: Varför behövs en guide?
      description: Vem passar verktyget för, och vad gör det bättre eller annorlunda?
    validations:
      required: true
  - type: checkboxes
    id: skriva
    attributes:
      label: Vill du skriva guiden själv?
      options:
        - label: Ja, jag kan skriva den (vi hjälper dig med mallen)
```

`.github/ISSUE_TEMPLATE/fel-eller-inaktuellt.yml`:

```yaml
name: "🛠️ Något är fel eller inaktuellt"
description: Rapportera fel, trasiga länkar eller innehåll som är inaktuellt.
title: "[Rättelse]: "
labels: ["rattelse"]
body:
  - type: input
    id: sida
    attributes:
      label: Vilken sida?
      description: Klistra in länken till sidan.
    validations:
      required: true
  - type: textarea
    id: fel
    attributes:
      label: Vad är fel?
    validations:
      required: true
  - type: textarea
    id: forslag
    attributes:
      label: Förslag på rättelse
      description: Valfritt.
    validations:
      required: false
```

- [ ] **Steg 3: Skriv `.github/pull_request_template.md`**

```markdown
## Vad har du ändrat?

<!-- En kort beskrivning. Länka gärna till ett issue, t.ex. "Stänger #12". -->

## Checklista

- [ ] Jag har använt rätt mall från `mallar/`
- [ ] Frontmattern är ifylld
- [ ] Filnamnet är skrivet med gemener och bindestreck (t.ex. `mitt-tips.md`)
- [ ] Länkar är vanliga, relativa Markdown-länkar
- [ ] Mappens `README.md` är uppdaterad med den nya sidan
- [ ] Inget innehåll är kopierat utan att källan anges
```

- [ ] **Steg 4: Validera YAML**

Kör: `for f in .github/ISSUE_TEMPLATE/*.yml; do npx --yes js-yaml "$f" > /dev/null && echo "OK $f"; done`
Förväntat: fyra rader `OK ...`.

- [ ] **Steg 5: Commit**

```bash
git add .github/
git commit -m "Lägg till issue-formulär och PR-mall"
```

---

### Uppgift 5: Rotdokument

**Filer:**
- Skapa: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- Ändra: `README.md` (ersätt hela innehållet)

**Gränssnitt:**
- Förbrukar: mappar (uppgift 3), mallar (uppgift 2), formulärfilnamn (uppgift 4) och KONTAKTVÄG (öppen fråga).

- [ ] **Steg 1: Skriv `CONTRIBUTING.md`**

~~~markdown
# Så bidrar du

Playbooken skrivs av communityn. Allt från ett kort tips till en hel verktygsguide är välkommet. Välj det sätt som passar dig:

| Spår | Passar dig som | Kräver |
|---|---|---|
| [1. Fyll i ett formulär](#1-fyll-i-ett-formulär) | vill dela ett tips snabbt | GitHub-konto (gratis) |
| [2. Redigera i webbläsaren](#2-redigera-i-webbläsaren) | vill skriva en hel sida | GitHub-konto |
| [3. Lokalt eller i Obsidian](#3-lokalt-eller-i-obsidian) | är van vid Git | Git, gärna Obsidian |

Genom att bidra godkänner du vår [uppförandekod](CODE_OF_CONDUCT.md).

## 1. Fyll i ett formulär

Du behöver inte kunna Git. Välj formulär, fyll i och skicka. En moderator gör om bidraget till en sida.

- [💡 Skicka in ett tips](https://github.com/Dibbe/Vibejkpg/issues/new?template=nytt-tips.yml)
- [🧰 Föreslå en verktygsguide](https://github.com/Dibbe/Vibejkpg/issues/new?template=foresla-verktygsguide.yml)
- [🛠️ Rapportera något som är fel eller inaktuellt](https://github.com/Dibbe/Vibejkpg/issues/new?template=fel-eller-inaktuellt.yml)

Har du inget GitHub-konto? Skapa ett gratis på [github.com/signup](https://github.com/signup).

## 2. Redigera i webbläsaren

1. Öppna rätt mall i [`mallar/`](mallar/) och kopiera allt innehåll (knappen **Copy raw file**).
2. Gå till mappen där sidan ska ligga, till exempel [`05-tips/`](05-tips/).
3. Klicka på **Add file → Create new file**.
4. Skriv ett filnamn med gemener och bindestreck, till exempel `borja-med-en-plan.md`.
5. Klistra in mallen och fyll i den.
6. Klicka på **Commit changes…**. GitHub skapar automatiskt en egen kopia (fork) åt dig.
7. Klicka på **Propose changes** och sedan **Create pull request**.
8. Gå igenom checklistan i pull requesten. En moderator granskar och återkommer.

Glöm inte att lägga till din sida i mappens `README.md` – det kan du göra på samma sätt med pennikonen (**Edit this file**).

## 3. Lokalt eller i Obsidian

1. Forka repot och klona din fork.
2. Skapa en gren: `git checkout -b mitt-tips`.
3. Skriv med valfri editor eller öppna repot i Obsidian – se [Läsa och skriva playbooken i Obsidian](00-borja-har/obsidian.md).
4. Kontrollera dina ändringar (kräver [Node.js](https://nodejs.org)):
   ```bash
   node scripts/kontrollera.mjs
   ```
5. Pusha och öppna en pull request mot `main`.

## Var hör mitt bidrag hemma?

| Jag vill skriva om… | Mapp | Mall |
|---|---|---|
| Ett kort, fristående tips | [`05-tips/`](05-tips/) | [tips](mallar/tips.md) |
| Hur man kommer igång med ett verktyg | [`02-verktyg/`](02-verktyg/) | [verktygsguide](mallar/verktygsguide.md) |
| Begrepp och grundprinciper | [`01-grunder/`](01-grunder/) | [kapitel](mallar/kapitel.md) |
| Hur man arbetar från idé till app | [`03-arbetsflode/`](03-arbetsflode/) | [kapitel](mallar/kapitel.md) |
| Säkerhet, Git, testning, kostnader | [`04-best-practices/`](04-best-practices/) | [kapitel](mallar/kapitel.md) |
| Länkar, kurser, communityer | [`06-resurser/`](06-resurser/) | [kapitel](mallar/kapitel.md) |

## Skrivregler

- **Språk:** svenska. Engelska facktermer går bra när de är etablerade (prompt, deploy).
- **Filnamn:** gemener, siffror och bindestreck – inga å, ä, ö eller mellanslag.
- **Frontmatter:** fyll i alla fält i mallen. `niva` är `nyborjare`, `van` eller `alla`.
- **Länkar:** vanliga Markdown-länkar med relativa sökvägar, till exempel `[Cursor](../02-verktyg/cursor.md)`. Inga `[[wikilinks]]`.
- **Callouts:** bara `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` och `[!CAUTION]`.
- **Bilder:** lägg dem i [`bilder/`](bilder/) och länka relativt.
- **Källor:** citerar eller bygger du på någon annans material, ange källan.
~~~

- [ ] **Steg 2: Skriv `CODE_OF_CONDUCT.md`**

Hämta den officiella svenska översättningen av Contributor Covenant 2.1 från `https://www.contributor-covenant.org/sv/version/2/1/code_of_conduct/`. Använd WebFetch eller `ctx_fetch_and_index`. Gör om den till Markdown ordagrant, utan att skriva om texten, och behåll avsnittet om tillskrivning (attribution) i slutet med länkar. Ersätt platshållaren för kontaktväg (i originalet `[INSERT CONTACT METHOD]`) med värdet för KONTAKTVÄG från den öppna frågan. Om den svenska översättningen inte går att hämta: stoppa och fråga användaren. Översätt inte själv.

Kontrollera: `grep -c "INSERT CONTACT METHOD" CODE_OF_CONDUCT.md` ska ge `0`.

- [ ] **Steg 3: Ersätt `README.md`**

~~~markdown
# Vibe coding-playbook

**Vibe Coders Jönköping** samlar här allt vi lärt oss om vibe coding – att bygga mjukvara genom att beskriva vad du vill ha för en AI. Playbooken är för dig som är helt ny och skrivs av communityn.

## Välj ditt spår

- 🌱 **Jag har aldrig programmerat** → [Börja här](00-borja-har/for-icke-programmerare.md)
- 💻 **Jag kan koda men är ny på AI-verktyg** → [Börja här](00-borja-har/for-utvecklare.md)

## Innehåll

| | Del | Vad du hittar |
|---|---|---|
| 00 | [Börja här](00-borja-har/) | Spår för nybörjare och utvecklare |
| 01 | [Grunder](01-grunder/) | Vad vibe coding är, begrepp och tankesätt |
| 02 | [Verktyg](02-verktyg/) | Guider till Claude Code, Cursor, Lovable med flera |
| 03 | [Arbetsflöde](03-arbetsflode/) | Från idé till prompt, iteration, felsökning och publicering |
| 04 | [Best practices](04-best-practices/) | Säkerhet, Git, testning och kostnader |
| 05 | [Tips](05-tips/) | Korta tips från communityn |
| 06 | [Resurser](06-resurser/) | Länkar, kurser och träffar |

## Bidra

Har du ett tips? Det tar två minuter:

**[💡 Skicka in ett tips](https://github.com/Dibbe/Vibejkpg/issues/new?template=nytt-tips.yml)** · [🧰 Föreslå en verktygsguide](https://github.com/Dibbe/Vibejkpg/issues/new?template=foresla-verktygsguide.yml) · [🛠️ Rapportera ett fel](https://github.com/Dibbe/Vibejkpg/issues/new?template=fel-eller-inaktuellt.yml)

Vill du skriva en hel sida? Läs [Så bidrar du](CONTRIBUTING.md). Använder du Obsidian kan du öppna repot som ett vault – se [guiden](00-borja-har/obsidian.md).

Alla som deltar följer vår [uppförandekod](CODE_OF_CONDUCT.md).

## Licens

Se [LICENSE](LICENSE).
~~~

- [ ] **Steg 4: Kör kontrollen**

Kör: `node scripts/kontrollera.mjs && node --test scripts/`
Förväntat: `OK: ...` och alla tester PASS. De trasiga länkarna från uppgift 3 är nu lösta.

- [ ] **Steg 5: Commit**

```bash
git add README.md CONTRIBUTING.md CODE_OF_CONDUCT.md
git commit -m "Lägg till README, bidragsguide och uppförandekod"
```

---

### Uppgift 6: Publicera och verifiera på GitHub

Stegen i den här uppgiften påverkar GitHub. Bekräfta med användaren före varje steg.

- [ ] **Steg 1: Skapa etiketterna** (bekräfta först)

```bash
gh label create tips --repo Dibbe/Vibejkpg --color 0E8A16 --description "Nytt tips"
gh label create verktygsguide --repo Dibbe/Vibejkpg --color 1D76DB --description "Förslag eller arbete med en verktygsguide"
gh label create rattelse --repo Dibbe/Vibejkpg --color D93F0B --description "Fel eller inaktuellt innehåll"
```

Kontrollera: `gh label list --repo Dibbe/Vibejkpg` visar alla tre.

- [ ] **Steg 2: Pusha grenen och öppna en PR** (bekräfta först)

```bash
git push -u origin playbook-skelett
gh pr create --base main --title "Playbookens skelett: struktur, mallar och bidragsflöde" --body "..."
```

PR-beskrivningen ska sammanfatta uppgift 1–5 och sluta med attributionsraden från sessionen.

- [ ] **Steg 3: Verifiera i Obsidian (manuellt, av användaren)**

Öppna repot som vault och kontrollera:
- att Obsidian inte ber om några inställningsändringar
- att **Templates: Insert template** listar `tips`, `verktygsguide` och `kapitel`
- att en länk skapad med `[[` blir en relativ Markdown-länk

Efter att vaultet öppnats ska `git status` inte visa några nya filer under `.obsidian/`.

- [ ] **Steg 4: Verifiera formulären efter merge**

Issue-formulär visas bara från standardgrenen. Efter merge till `main`: öppna `https://github.com/Dibbe/Vibejkpg/issues/new/choose` och kontrollera att de tre formulären syns och att "Open a blank issue" inte finns. Öppna direktlänken till `nytt-tips.yml` och kontrollera att formuläret laddas med fälten från uppgift 4.
