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
