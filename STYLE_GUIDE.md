# Style Guide — "Faceless Sci-Fi Short" (verbindlich)

**Status:** Kanon. Jeder neue Short in diesem Repo hält sich strikt an diese
Regeln, es sei denn der Short gehört ausdrücklich zu einem anderen,
dokumentierten Stil (z. B. `cartoon-3d-short` / bridge).

## 0 · Die DNA in einem Satz

> Minimalistische weiße Cartoon-Figur mit dicken schwarzen Outlines,
> expressivem Gesicht und einfacher Silhouette steht in einer bunten,
> stilisierten Sci-Fi-Welt (Pastell-Lila/Blau-Hintergründe mit
> Neon-Grün/Cyan/Pink-Akzenten) — immer 9:16, immer deutsch, immer
> sarkastisch.

Wenn etwas aussieht wie Anime, Pixar, Realismus, Stock-Illustration oder
Horror-Grit: falsch, zurück auf Null.

## 1 · Die Hauptfigur

**Silhouette (Priorität 1).** Du musst sie schwarz-weiß bei 128 px noch
erkennen.

- **Kopf:** rund-oval, leicht höher als breit (h/w ≈ 1.08), glatt, keine
  Haare, keine Ohren.
- **Hals:** keiner. Kopf sitzt direkt auf dem Oberkörper.
- **Körper:** weicher, birnenförmiger Rumpf. Breite unten ≈ 1.25 × Breite
  oben. Keine Taille, keine sichtbaren Muskeln.
- **Arme:** schlank, röhrenförmig, nur eine sanfte Krümmung. Enden in
  **weißen Fäustling-Händen mit schwarzer Outline** (keine Finger, nur
  die Fäustling-Silhouette; eine leichte Daumen-Andeutung ist OK).
- **Beine:** kurz, nur andeutungsweise, enden in **weißen, rundlichen
  Schuhen mit schwarzer Outline**. In vielen Shots von der Unterkante
  abgeschnitten — das ist OK.
- **Nase:** existiert nicht.
- **Ohren:** existieren nicht.
- **Füllfarbe:** `#ffffff` (reines Weiß). Kein Off-White, kein Beige.
- **Outline:** `#0a0a0a`, 7 – 9 px bei 1080 px Höhe (`strokeLinejoin: round`,
  `strokeLinecap: round`). **Outlines sind Teil des Looks, nicht Beiwerk.**
- **Body-Höhe (Gesamt):** ≈ 3.2 Kopfhöhen. Kein 2 HH (zu Chibi), kein
  4 HH (zu erwachsen).

**Accessoires, die der Figur fest zugeschrieben werden dürfen und für
den „Mad Scientist"-Archetyp sogar erwünscht sind:**
- grüne **Pilotenbrille auf der Stirn** (Akzent `--accent-green`),
- schlichter grauer / lila **Rucksack**,
- seitlich klickbarer **Kanister am Gürtel** (Slime, Energie, Mystery),
- kleiner **Antennenstab** oder **Haar-Spike** aus dem Scheitel.

Keine Kleidung außer monochromen Overalls in einer der Akzentfarben.
Nie: Hut, Mütze, Krawatte, realistische Haare.

## 2 · Gesicht (ExpressSystem)

**Augen.** Schwarze **kleine Ovale** (nicht Punkte, nicht Kreise, nicht
leere Weiße). `rx ≈ 0.035 × Kopfbreite`, `ry ≈ 0.055 × Kopfbreite`.
Abstand Mittelpunkt-zu-Mittelpunkt ≈ `0.36 × Kopfbreite`. Klein und
expressiv — die Brauen leisten die Hauptarbeit. Nie Highlights.

**Mund.**
- **Geschlossen/Neutral:** kurze Linie oder winziger Bogen, maximal
  `0.18 × Kopfbreite` breit, Stroke 5 – 6 px.
- **Offen (Talk/Shock/Happy/Angry):** rundliches Oval, **Innenraum
  magenta/pink** (`--accent-pink`-Nachbar `#e04a90`), schwarze Outline.
  Eine kleine, weiche Zungen-Erhebung am unteren Rand ist erlaubt und
  richtig (siehe Referenz — das ist Teil des Looks).
- Nie Zähne.

**Augenbrauen** sind das stärkste Werkzeug für Ausdruck.
Ovale Augen + verschiedene Brauen = ganze Palette:

| Expression | Augen | Brauen | Mund |
|---|---|---|---|
| **neutral** | Ovale, frontal | keine | kurze flache Linie |
| **happy** | Ovale → nach oben geschlossene Bögen | leichte Aufwölbung | kleiner Smile-Bogen |
| **angry** | Ovale, verschmälert | V-förmig nach innen | kurze gerade Linie, leichter Frown |
| **confused** | Ovale, versetzt (ein höher als das andere) | eine hoch, eine tief | zickzack-S |
| **sarcastic** | Ovale, beide zur **selben Seite** verschoben (Side-Eye) | eine Augenbraue hochgezogen | einseitiger halber Smile (Smirk) |
| **shocked** | kleine Kreis-Pupillen in weißen Ovalen | hoch oben | offenes O |
| **smug** | halb geschlossene Bögen von oben nach unten | leicht hochgezogen | langgezogener Smirk |

**Emote-Symbole gehören zum Expression-System** (Referenz zeigt sie
klar). Ein Symbol pro Expression, über oder neben dem Kopf:

| Expression | Symbol |
|---|---|
| happy | zwei gelbe Jubel-Strahlen oben |
| angry | roter „Veins"-Cluster (vier kurze Schläge, sternförmig) |
| confused | großes pinkes/schwarzes Fragezeichen oben rechts |
| sarcastic | ein hellblauer Schweißtropfen seitlich am Kopf |
| shocked | ein großer gelber Starburst (Stern-Explosion) über dem Kopf |
| smug | ein weißer Vier-Spitz-Sparkle neben dem Kopf |

Nie: Blush, Sternchen-Augen, Herz-Augen, weinende Tropfen. Keine
Multi-Symbol-Kombis.

**Blick-Richtung.** Zur Kamera (frontal) ist Default. Sarcastic ist
**immer** zur Seite. Beim Zeigen zeigt die Figur **mit dem Arm** und
dreht den Kopf nur um 10 – 15°.

## 3 · Posen (PoseSystem)

Alle Posen sind **flach zur Kamera** — kein 3D-Dreh, keine
Perspektiv-Verkürzung. Perspektive macht die Welt, nicht die Figur.

- **idle** — Arme hängen, leichtes Up-Down-Bob 3 – 5 px Amplitude, 0.8 Hz.
- **talking** — idle + Mund schnappt im 6-Frame-Rhythmus auf-zu solang
  die Zeile läuft, minimale Kopfneigung ±2°.
- **shrug** — beide Arme angehoben, Handflächen nach oben angedeutet
  (nur der Winkel der Hand-Blobbe), Schultern +5 % hoch über 8 Frames.
- **pointing** — ein Arm gerade nach außen (auf das Ziel zeigend), andere
  Hand lässig an die Hüfte, Kopf zum Ziel +10°.
- **panic run** — Körper nach vorn geneigt 20°, Arme nach hinten-oben
  geworfen, Beine abwechselnd nach vorn und hinten getrieben, Stretch
  des Körpers +15 %. Dust-Puffs hinter den Füßen.
- **sarcastic side-eye** — idle, aber Augen nach links/rechts, eine
  Augenbraue hoch, Smirk, Kopf leicht geneigt.
- **shocked recoil** — Körper 1 Frame gestaucht (squash 0.85), dann
  3 Frames gestreckt (stretch 1.15) und 4 px nach hinten gefedert.
- **presenting to camera** — frontal, beide Arme seitlich geöffnet,
  Handflächen zur Kamera, wie "ta-da".

Pose = Code-Prop `pose`. Expression = Code-Prop `expression`. Diese
beiden sind orthogonal: jede Kombi ist legal.

## 4 · Farben

Semantische Tokens — nie Hex-Codes direkt in Szenen schreiben.

```
--figure-fill       #ffffff
--ink               #0a0a0a      (Outlines + Gesichts-Elemente)
--bg-deep           #2a1a52      (tiefer Hintergrund, Lab-Rückwand)
--bg-mid            #5d4ab7      (Lila-Mid, Kontrollraum-Panels)
--bg-soft           #a99bff      (weicher Pastell-Lila, Nebel/Licht)
--bg-sky            #7ec6ff      (Pastell-Cyan, Welten/Himmel)

--accent-green      #8cf542      (Portal, Slime, "Go", Goggles)
--accent-pink       #ff6eb7      (Warnlampen, Mund-Innenraum, Energie)
--accent-cyan       #4de1ff      (Monitore, Holo, Daten, UI)
--accent-yellow     #ffda47      (Starbursts, Vorsicht, Impulse)
--accent-tan        #e6d3a8      (warmer Schatten auf Props, Gürtel, Boden)
```

**Regeln**

- Figur ist immer `--figure-fill`. Die einzige Ausnahme ist ein kurzes
  Flash-Frame (z. B. Portal-Rückschlag), max. 1 – 2 Frames.
- Jede Szene hat **einen** dominanten Hintergrund-Lila-Verlauf
  (`--bg-deep` → `--bg-mid` → `--bg-soft`) und **eine** dominante
  Akzentfarbe. Mehr als eine Akzentfarbe gleichzeitig nur, wenn die
  Pointe das verlangt.
- Neon-Farben leuchten (= haben einen 20 – 40 px blurrigen Glow in der
  gleichen Farbe hinter sich). Normale Flächen glühen nicht.
- Hintergrund-Luma nie über 0.75 — sonst verliert die weiße Figur ihre
  Silhouette.

## 5 · Hintergründe

Drei fertige Umgebungen (`src/shared/scifi/Environments.tsx`):

1. **Mad Lab** — Rückwand mit Panelgitter, 3 – 5 Monitore mit cyan Scanlines,
   Pipes von der Decke, Bodenfliesen in flacher Perspektive, Flüssigkeits-
   Kolben im Hintergrund. Dominanz: `--bg-deep/-mid`. Akzent: Cyan.
2. **Portal Hub** — Rundes Portal-Rig in der Mitte (Ring aus Metall +
   Energie-Scheibe), Boden mit konzentrischen Lichtlinien, leichter
   Nebelschleier am Boden. Dominanz: `--bg-mid/-soft`. Akzent: Grün.
3. **Slime World** — weicher wolkiger Pastell-Horizont, Slime-Blobs im
   Vordergrund (Boden), eigenartige floating rocks im Hintergrund.
   Dominanz: `--bg-sky/-soft`. Akzent: Pink.

Alle Umgebungen haben **leichte 3D-Perspektive via SVG** (Fluchtlinien
zum Zentrum, kein echtes Three.js). Grund: der Look muss cartoonhaft
bleiben, nicht "technisch beeindruckend".

**Dos.**
- 1 großer Fluchtpunkt in Bildmitte oder knapp über der Mitte.
- Max. 2 bewegte Elemente im Hintergrund (Scanline, Pipe-Flimmern,
  Nebelschwade). Alles andere ist still.
- Rand-Vignette dunkler als Mitte, damit die Figur ins Zentrum zieht.

**Don'ts.**
- Keine echten Fotos, keine Texturen aus dem Netz.
- Keine mehrstöckigen, komplexen Kompositionen.
- Keine Instrumententafeln mit lesbarem Mikro-Text — unleserlich auf
  dem Handy ist unprofessionell.

## 6 · Props

In `src/shared/scifi/Props.tsx`, alle mit stroke `--ink` und semantischen
Farbtokens. Jeder Prop hat Props für `x, y, scale, rotation` und ist
beidhändig haltbar.

- **PortalBlaster** — raygun mit grünem Energiekern, Griff vorn. ~ 1.4 KH
  lang.
- **MiniDrone** — kleines schwebendes Rechteck mit zwei gelben
  "Augen"-Lichtern, zwei Mini-Propellern oben.
- **SlimeCanister** — Zylinder mit kuppelförmigem Deckel, grün gefüllt
  bis 70 %, Blasen steigen auf.
- **TimeGadget** — scheibenförmig, ein cyan Zifferblatt mit einem
  einzigen hin-und-her schwenkenden Zeiger.
- **PortalRing** — 50 cm – 2 m Ring, Metallrand + wirbelnde Energie-Scheibe
  in Akzentfarbe. Das Herzstück des Short-Universums.

Props werden **vor** der Figur gezeichnet, wenn sie in der Hand gehalten
werden, und **hinter** der Figur, wenn sie frei in der Welt stehen.

## 7 · Animationsprinzipien

- **Smootherstep** für jede glatte Bewegung (6t⁵ − 15t⁴ + 10t³). Nie
  linear, nie `Easing.ease`.
- **Squash & Stretch nur auf Reaktion**, nicht auf Idle. Max. ±18 %.
- **Jeder Hold pusht.** Statische Frames > 6 brauchen wenigstens ein
  langsames Zoom-In (0.2 %/f) oder Kameradrift, sonst wirkt der Shot tot.
- **Impact-Kicks:** ein Shake-Pattern von 5 – 7 Frames mit alternierendem
  Vorzeichen und exponentiellem Abfall, Amplitude max. 20 px.
- **Mund-Timing:** Mund geht **3 Frames bevor** der Konsonant im Audio
  startet auf — wirkt lebendiger. Siehe `isTalking()`-Pattern in den
  Szenen-Dateien.

## 8 · Kamera & Schnitt

- Standard-Framing: Figur von Schuh bis Haaransatz füllt 55 – 70 % der
  Bildhöhe. Kopfspiel 10 – 15 %.
- Nur **harte Cuts** auf Pointen (Beat-Change, Punchline). Alles dazwischen
  ist ein 18 – 40 Frame Smootherstep-Glide.
- Zoom-Punch auf "Reveal"-Momente: 8 Frames, 1.0 → 1.25 Scale, 2° Roll,
  danach 6 Frames stabilisieren.
- Keine Handheld-Wackelei. Keine Dutch Angles außer explizit als Gag.

## 9 · Text & Untertitel

- Schrift: **Impact** (für Big-Hit-Overlays) oder System-Sans-Bold
  (`-apple-system`, `Arial Black`) für Untertitel.
- Untertitelpanel: halbtransparentes Schwarz (`rgba(0,0,0,0.72)`),
  rx 16, 36 px Textgröße, weiß, **immer** in der unteren Bildhälfte,
  Speaker-Label in `--accent-yellow`.
- Big-Hit-Overlays: mehrfarbiger Shadow (`stroke=ink`, `paint-order=stroke`)
  damit der Text auf allen Hintergründen liest.
- Alle Umlaute als echte Umlaute (Ä/Ö/Ü/ß). Niemals "ae/oe/ue/ss"
  im UI-Text — das ist nur im espeak-ng-Input nötig.

## 10 · Audio-Signatur

Audio ist Teil des Stils, nicht nachträglich:

- **Portal-Open:** absteigender Whoosh 0.8 s + heller Sparkle-Chord.
- **Blaster-Fire:** kurzer Zap (Rechteck-Sweep 800 → 200 Hz in 120 ms).
- **Drone-Idle:** schwebender 80-Hz-Sinus mit 3-Hz-Tremolo, –18 dB.
- **Fail/Error:** zwei absteigende Töne (z. B. F#5 → B4), einer pro
  150 ms, siehe `error_tone` in `audio_build.py`.

Deutsche VO: **espeak-ng** lokal mit Voice `de+m1..m7` / `de+f1..f5`,
Pitch & Speed pro Charakter. Keine externen TTS-Dienste.

## 11 · Format & Delivery

- 1080 × 1920, 9:16, 30 fps. **Keine** andere Auflösung.
- H.264 (`crf 18` für Final, `crf 20` für Preview), `yuv420p`, AAC Stereo
  48 kHz, Dauer exakt wie im Drehbuch.
- Jeder Short hat mindestens einen **Hook in den ersten 2 Sekunden**
  (visuelle Reveal + Hook-Zeile), sonst wird weitergescrollt.
- Hochformat-sichere Zone: untere 15 % können von UI-Chrome (TikTok-Bar,
  YouTube-Shorts-Buttons) verdeckt sein. Keine Pointen dort.

## 12 · Dos & Don'ts (Schnellcheck)

### Dos

- Weiß + Schwarz + ein Akzent-Neon.
- Ovale Augen, keine Nase.
- Dicke Outlines, auch auf Props und Welt.
- Smootherstep-Glides, Impact-Kicks, Zoom-Punches.
- Sarkastischer Ton, trocken, ohne Gewalt- oder Leid-Humor.

### Don'ts

- Realistische Gesichter, Anime-Augen, Pixar-Rendering.
- Dunkle Grit-Looks, Horror, grinsende Clowns.
- Realkörperliche Politiker, Prominente, reale Logos.
- Stock-Vektoren aus dem Netz als Hintergrund.
- Mini-Text in Hintergrund-Monitoren, der lesbar erscheinen will.
- Stilwechsel mitten im Short.

## 13 · Dateien dieses Systems

| Pfad | Zweck |
|---|---|
| `STYLE_GUIDE.md` | Dieses Dokument. Kanon. |
| `src/shared/scifi/tokens.ts` | Die Farbtokens aus Abschnitt 4. |
| `src/shared/scifi/Character.tsx` | Haupt-Charakter, alle Expressions + Posen. |
| `src/shared/scifi/Props.tsx` | Die 5 Props aus Abschnitt 6. |
| `src/shared/scifi/Environments.tsx` | Mad Lab, Portal Hub, Slime World. |
| `src/videos/scifi/TestClip.tsx` | 10-s-Beispiel-Szene. |
| `.claude/skills/scifi-faceless-short/SKILL.md` | Future-Session-Entrypoint. |

## 14 · Entscheidungs-Regel bei Zweifeln

> **Stilistisch passend schlägt technisch beeindruckend. Immer.**

Wenn eine Szene technisch komplex aussieht aber stilistisch generisch
wird: vereinfachen. Wenn eine Szene zu einfach wirkt aber auf dem Handy
sofort lesbar ist: behalten.
