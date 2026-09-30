# Vibe coding-playbook – design (v1: skelett och mallar)

**Datum:** 2026-09-30
**Repo:** [Dibbe/Vibejkpg](https://github.com/Dibbe/Vibejkpg) (publikt)
**Status:** Utkast för granskning

## Syfte

En öppen playbook från Vibe Coders Jönköping som hjälper helt nya att komma igång med vibe coding och samlar communityns best practices och tips.

## Beslut

| Fråga | Beslut |
|---|---|
| Målgrupp | Blandad: icke-programmerare och utvecklare som är nya på AI-verktyg |
| Verktyg | Separata guider per verktyg |
| Format | Markdown som läses direkt på GitHub |
| Obsidian | Repot ska kunna öppnas som vault. GitHub går först: allt ska visas korrekt på GitHub |
| Bidrag | Öppen community via PR och GitHub-issueformulär |
| Språk | Svenska |
| Omfattning v1 | Bara struktur, navigation, mallar och bidragsflöde. Inget sakinnehåll |

## Framgångskriterium för v1

En ny medlem ska på under fem minuter kunna förstå var ett nytt tips eller en ny verktygsguide hör hemma, kopiera rätt mall (eller fylla i rätt formulär) och skicka in sitt bidrag.

## Struktur

Repot är ordnat efter läsarens resa. Numren på mapparna visar ordningen.

```
README.md                     Startsida: vad det här är, "Välj ditt spår", länkar till alla mappar, knappar till formulären
CONTRIBUTING.md               Tre sätt att bidra (se Bidragsflöde)
CODE_OF_CONDUCT.md            Contributor Covenant 2.1, svensk översättning, med kontaktväg ifylld
LICENSE                       Finns redan
.gitignore                    Personliga Obsidian-filer
00-borja-har/
  README.md                   Innehållsförteckning
  for-icke-programmerare.md   Ingångssida för spåret (kapitelmall, tom)
  for-utvecklare.md           Ingångssida för spåret (kapitelmall, tom)
  obsidian.md                 Hur man öppnar repot som vault (skrivs i v1, eftersom den gäller själva repot)
01-grunder/README.md
02-verktyg/README.md          Lista över guider, en fil per verktyg: <verktyg>.md
03-arbetsflode/README.md
04-best-practices/README.md
05-tips/README.md             Lista över tips, en fil per tips: <kort-beskrivning>.md
06-resurser/README.md
mallar/
  tips.md
  verktygsguide.md
  kapitel.md
bilder/.gitkeep               Gemensam mapp för bilder
.obsidian/
  app.json                    Länkinställningar
  templates.json              Mallmapp = mallar/
.github/
  ISSUE_TEMPLATE/
    config.yml                blank_issues_enabled: false
    nytt-tips.yml
    foresla-verktygsguide.yml
    fel-eller-inaktuellt.yml
  pull_request_template.md
```

Varje `README.md` i en mapp har en kort beskrivning av vad som hör hemma där och en innehållsförteckning som skrivs för hand. I v1 består den av texten "Inga sidor ännu – [bidra](../CONTRIBUTING.md)!".

### Filnamn

Filnamn skrivs med gemener och bindestreck, utan å, ä, ö och mellanslag (till exempel `claude-code.md`, `borja-med-en-plan.md`). Då blir URL:er och relativa länkar stabila. Läsbar titel anges i `titel` i frontmattern och som H1.

## Konventioner för GitHub och Obsidian

- Använd bara vanliga Markdown-länkar med relativa sökvägar: `[Cursor](../02-verktyg/cursor.md)`. Wikilinks (`[[...]]`) används inte.
- Embeds (`![[...]]`), Dataview och andra Obsidian-plugins används inte.
- Callouts får bara vara de typer GitHub stöder: `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` och `[!CAUTION]`.
- Mermaid-diagram är tillåtna.
- Bilder läggs i `bilder/` och länkas relativt.
- `.obsidian/app.json` sätter `useMarkdownLinks: true`, `newLinkFormat: "relative"` och `attachmentFolderPath: "bilder"`.
- `.obsidian/templates.json` sätter `folder: "mallar"`.
- `.gitignore` utesluter `.obsidian/workspace*.json`, `.obsidian/plugins/`, `.obsidian/themes/`, `.obsidian/cache` och `.trash/`.

Konventionerna står i CONTRIBUTING.md och i `00-borja-har/obsidian.md`.

## Mallar

Alla mallar har samma grundfält i frontmattern:

```yaml
---
titel:
typ: tips | verktygsguide | kapitel
niva: nyborjare | van | alla
tags: []
forfattare:
senast-uppdaterad: YYYY-MM-DD
---
```

Varje mall har korta instruktioner som HTML-kommentarer (`<!-- ... -->`). De syns inte på GitHub och tas bort när mallen fylls i.

- **`mallar/tips.md`** har rubrikerna *Problemet*, *Tipset*, *Exempel* (gärna en prompt i ett kodblock) och *Varför det fungerar*. Riktlinjen är att ett tips ska få plats på en skärm.
- **`mallar/verktygsguide.md`** har extrafälten `verktyg`, `webbplats`, `kostnad` och `kraver-kodvana: ja | nej`. Rubrikerna är *Vad det är och för vem*, *Kom igång steg för steg*, *Första projektet*, *Styrkor och svagheter*, *Vanliga fällor* och *Kostnad* (datumstämplad).
- **`mallar/kapitel.md`** har rubrikerna *Sammanfattning*, *Innehåll* och *Läs vidare* (länk till nästa steg i resan).

## Bidragsflöde

CONTRIBUTING.md beskriver tre spår, från enklast till mest avancerat:

1. **Utan Git:** fyll i ett issue-formulär. Det kräver ett gratis GitHub-konto. En moderator gör om bidraget till en fil.
2. **I webbläsaren:** redigera eller skapa en fil direkt på GitHub. Guiden visar steg för steg hur man kopierar en mall, sparar och öppnar en PR.
3. **Lokalt eller i Obsidian:** forka, klona, öppna som vault, infoga en mall och öppna en PR.

README och CONTRIBUTING har direktlänkar till formulären, till exempel `https://github.com/Dibbe/Vibejkpg/issues/new?template=nytt-tips.yml`.

### Issue-formulär (`.github/ISSUE_TEMPLATE/`)

- **`nytt-tips.yml`** har fälten *Rubrik*, *Vilket problem löser det?*, *Tipset*, *Exempel eller prompt* (valfritt), *Nivå* (rullista: nybörjare / van / alla) och *Verktyg* (rullista: verktygsoberoende, Claude Code, Cursor, Lovable, Bolt, v0, annat). Etikett: `tips`.
- **`foresla-verktygsguide.yml`** har fälten *Verktyg*, *Webbplats*, *Varför det behövs en guide* och *Vill du skriva den själv?* (kryssruta). Etikett: `verktygsguide`.
- **`fel-eller-inaktuellt.yml`** har fälten *Vilken sida?*, *Vad är fel?* och *Förslag på rättelse* (valfritt). Etikett: `rattelse`.
- **`config.yml`** innehåller `blank_issues_enabled: false`.

Etiketterna `tips`, `verktygsguide` och `rattelse` skapas i repot med `gh label create`.

### PR-mall

Checklista:
- Rätt mall är använd.
- Frontmattern är ifylld.
- Länkarna är relativa Markdown-länkar.
- Mappens README är uppdaterad med den nya sidan.
- Inget kopierat innehåll utan källa.

## Utanför v1

- Sakinnehåll i kapitlen, guiderna och tipsen (det skriver communityn).
- CI för länk- och frontmatterkontroll.
- En statisk webbplats.
- Externt formulär för bidrag utan konto.

## Verifiering

- Alla relativa länkar i repot pekar på filer som finns (kontrolleras med ett skript före commit).
- YAML i issue-formulären är giltig, och formulären visas under "New issue" på GitHub efter push.
- Repot öppnas i Obsidian utan att `.obsidian`-inställningarna behöver ändras, och "Insert template" listar de tre mallarna.
