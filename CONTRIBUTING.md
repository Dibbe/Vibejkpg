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
