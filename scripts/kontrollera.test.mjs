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
