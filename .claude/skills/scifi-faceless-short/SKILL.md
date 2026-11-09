---
name: scifi-faceless-short
description: Make a 9:16 German-language Faceless YouTube Short in the minimalist "weisse Cartoon-Figur mit dicken schwarzen Outlines" sci-fi style (Portal-Rings, Mad-Lab, Slime-World, sarcastic deadpan Comedy). Use when the user says "scifi short", "lab short", "portal short", "weisse Cartoon-Figur", "that sci-fi style", or asks for a Short in the look seen in STYLE_GUIDE.md.
---

# Sci-Fi Faceless Short — Haus-Stil

**Lies ZUERST `STYLE_GUIDE.md` am Repo-Root.** Das ist der Kanon. Es
beschreibt Figur, Palette, Posen, Expressions, Props, Environments,
Kamera und Delivery. Alles hier ist nur Workflow.

## Pipeline

1. **Topic + Hook.** Ein Thema, eine Pointe, eine Hook-Zeile in den
   ersten 2 Sekunden. Ohne Hook wird weitergescrollt.
2. **Drehbuch.** Deutsch, Hochdeutsch, 20 – 45 s. Pro Sekunde max. 3.5
   Worte VO. Stil: sarkastisch, trocken, nie Gewalt-/Leid-Humor.
3. **Scene-File erstellen.** Kopiere die Struktur von
   `src/videos/scifi/TestClip.tsx` nach `src/videos/scifi/<name>.tsx`.
4. **Audio.** Baue ein `audio_build.py` pro Short (siehe das aus
   `src/videos/frieden2026/` als Vorlage) mit espeak-ng `-v de+mX/fX`
   pro Charakter. Mix als `public/audio/<name>.wav`. Importiere mit
   `<Audio src={staticFile("audio/<name>.wav")} />`.
5. **Render.** `npx remotion render src/index.ts <CompId>
   out/<name>.mp4 --codec h264 --crf 18`.
6. **Prüfen.** Mindestens 4 Stills aus unterschiedlichen Beats. Auf
   dem Handy im Hochformat gegen den Style-Guide spiegeln.
7. **Commit + Push.** Branch + PR wie in `STUDIO.md` beschrieben.

## Wiederverwendbare Bausteine (schon da)

| Modul | Wofür |
|---|---|
| `src/shared/scifi/tokens.ts` | Farb-Tokens — nie Hex direkt in Szenen. |
| `src/shared/scifi/Character.tsx` | Hauptfigur mit 7 Expressions + 8 Posen + Accessoires (Goggles/Backpack/Canister/Antenna). |
| `src/shared/scifi/Props.tsx` | PortalRing, PortalBlaster. Weitere Props (MiniDrone, SlimeCanister, TimeGadget) sind im Style-Guide dokumentiert aber noch nicht implementiert — bauen wenn gebraucht, im gleichen Pattern. |
| `src/shared/scifi/Environments.tsx` | MadLab. Weitere Umgebungen (PortalHub, SlimeWorld) sind im Style-Guide dokumentiert — bauen wenn gebraucht. |
| `src/videos/scifi/TestClip.tsx` | Referenzimplementierung — 10 s Lab + Portal + Pointing. |

## Nicht machen

- Keine Realpersonen (auch nicht als Charaktere im Short). Nur
  generische Figuren oder erfundene Namen.
- Keine externen KI-Video-Generatoren. Keine kostenpflichtigen TTS.
- Keine urheberrechtlich geschützten Musikstücke. SFX & Beds werden
  in `audio_build.py` synthetisiert (Vorlage: `src/videos/frieden2026/
  audio_build.py` SFX-Funktionen).
- Keine Stilwechsel mitten im Short. Wer Bridge-Style will, startet
  einen anderen Short.

## Beim Zweifeln

> **Stilistisch passend schlägt technisch beeindruckend.**

Wenn eine Idee kompliziert wird, zurück zum Style-Guide, §14.
