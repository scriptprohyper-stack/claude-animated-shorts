#!/usr/bin/env python3
"""
Baut die komplette 30 s-Tonspur fuer den Satire-Short.

- VO auf Deutsch via espeak-ng (lokal, keine externen Dienste).
- SFX als Oszillator-Synthese (whoosh, boom, kasse, facepalm, error).
- Mix auf 48 kHz Stereo, exakt 30.000 s.

Ausgabe:
  public/audio/stems/<name>.wav  (einzelne Spuren, debuggable)
  public/audio/mix.wav           (finaler 30 s-Mix)
  public/audio/cues.json         (Startzeiten fuer Untertitel in der Komposition)
"""
import json
import math
import os
import subprocess
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "public" / "audio"
STEMS = OUT / "stems"
OUT.mkdir(parents=True, exist_ok=True)
STEMS.mkdir(parents=True, exist_ok=True)

SR = 48000
TOTAL = 30.0


# --- VO via espeak-ng ----------------------------------------------------

# Jede Zeile: id, Start-Sek, espeak-Voice, Pitch (0-99), Speed (wpm), Text.
# Voices (espeak-ng): de, de+m1..m7 (maennlich), de+f1..f5 (weiblich).
VO_LINES = [
    ("s1_narr",   0.30, "de",      50, 165, "Willkommen zur Weltfriedenskonferenz zwanzighundertsechsundzwanzig!"),
    ("s1_pol1",   2.60, "de+m3",   38, 160, "Wer gewinnt eigentlich den naechsten Weltkrieg?"),

    ("s2_haupt",  6.10, "de+m1",   55, 170, "Koennten wir mehr Geld fuer Schulen bekommen?"),
    ("s2_polno",  8.50, "de+m4",   28,  150, "KEIN BUDGET!"),
    ("s2_polyay", 10.80, "de+m4",  65, 160, "Oh! Ist der neu?!"),

    ("s3_a1",    12.20, "de+m2",   55, 170, "Wir wollen Frieden!"),
    ("s3_b1",    13.55, "de+m3",   48, 170, "Wir auch!"),
    ("s3_a2",    14.60, "de+m2",   55, 165, "Deshalb brauchen wir mehr Waffen!"),
    ("s3_b2",    17.10, "de+m3",   48, 170, "Wir auch!"),

    ("s4_narr",  19.20, "de",      50, 160, "Fuer Waffen ist Geld da. Fuer alles andere wird's schwierig."),
    ("s4_sell",  22.80, "de+m7",   62, 160, "Ich liebe Frieden!"),

    ("s5_erde",  25.20, "de+f3",   55, 165, "Kann mich bitte jemand deinstallieren?"),
    ("s5_text",  27.80, "de",      45, 160, "Menschheit zweitausendsechsundzwanzig. Update fehlgeschlagen."),
]


def synth_vo():
    cues = {}
    for cue_id, start, voice, pitch, wpm, text in VO_LINES:
        wav = STEMS / f"vo_{cue_id}.wav"
        cmd = [
            "espeak-ng",
            "-v", voice,
            "-p", str(pitch),
            "-s", str(wpm),
            "-a", "180",  # lauter als default
            "-w", str(wav),
            text,
        ]
        subprocess.run(cmd, check=True)
        dur = wav_duration(wav)
        cues[cue_id] = {
            "start": start,
            "duration": dur,
            "text": text,
        }
        print(f"  VO {cue_id:12s}  start={start:5.2f}s  dur={dur:4.2f}s")
    return cues


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as w:
        return w.getnframes() / w.getframerate()


# --- SFX: pure Oszillator-Synthese, wie templates/audio ------------------

def _write_wav(path: Path, samples, sr=SR, stereo=False):
    import struct
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2 if stereo else 1)
        w.setsampwidth(2)
        w.setframerate(sr)
        if stereo:
            buf = bytearray()
            for l, r in samples:
                buf += struct.pack("<hh", _clip16(l), _clip16(r))
            w.writeframes(bytes(buf))
        else:
            buf = bytearray()
            for s in samples:
                buf += struct.pack("<h", _clip16(s))
            w.writeframes(bytes(buf))


def _clip16(x):
    v = int(max(-1.0, min(1.0, x)) * 32767)
    return v


def whoosh(dur=0.8):
    """Downward noise sweep — Panzer / Kamerazoom."""
    import random
    n = int(dur * SR)
    out = []
    state = 0.0
    for i in range(n):
        t = i / SR
        env = (1 - t / dur) ** 1.5 * max(0, min(1, t / 0.05))
        # pink-ish noise via one-pole lowpass whose cutoff drops
        cut = 1.0 - (t / dur) * 0.85
        state = state * (1 - cut) + (random.random() * 2 - 1) * cut
        out.append(state * env * 0.6)
    return out


def boom(dur=0.7):
    """Low kick fuer Panzer-Impact."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        f = 90 * math.exp(-t * 8) + 40
        env = math.exp(-t * 4.5)
        s = math.sin(2 * math.pi * f * t) * env * 0.8
        out.append(s)
    return out


def cash(dur=0.35):
    """Kasse-Ding fuer Waffenverkaeufer."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        env = math.exp(-t * 7)
        # metallische Partialtoene
        s = 0.0
        for (f, g) in [(880, 0.5), (1320, 0.35), (1760, 0.25), (2640, 0.15)]:
            s += math.sin(2 * math.pi * f * t) * g
        out.append(s * env * 0.5)
    return out


def jubel(dur=0.9):
    """Zwei kleine aufsteigende Jubel-Blips."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        p = (t % 0.45) / 0.45
        f = 350 + p * 500
        env = math.sin(math.pi * p) if p < 1 else 0
        s = math.sin(2 * math.pi * f * t) * env * 0.35
        out.append(s)
    return out


def error_tone(dur=1.2):
    """Windows-aehnlicher Fehlerton: zwei Dur-Sexten-Toene."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        # Ton 1: 0.0 - 0.35, Ton 2: 0.4 - 0.75
        if t < 0.35:
            lt = t
            f = 740  # F#5-ish
            env = math.sin(math.pi * (lt / 0.35)) if lt < 0.35 else 0
        elif t < 0.4:
            env = 0
            f = 740
        elif t < 0.8:
            lt = t - 0.4
            f = 494  # B4-ish
            env = math.sin(math.pi * (lt / 0.4)) if lt < 0.4 else 0
        else:
            env = 0
            f = 494
        s = (math.sin(2 * math.pi * f * t) * 0.5
             + math.sin(2 * math.pi * f * 1.5 * t) * 0.25)
        out.append(s * env * 0.6)
    return out


def ambient_bed(dur=TOTAL):
    """Sehr leises, pulsierendes Betten-Pad, damit keine Totenstille."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        # langsamer Puls
        a = 0.5 + 0.5 * math.sin(2 * math.pi * 0.25 * t)
        s = (
            math.sin(2 * math.pi * 110 * t) * 0.10 +
            math.sin(2 * math.pi * 165 * t) * 0.07 +
            math.sin(2 * math.pi * 220 * t) * 0.05
        )
        out.append(s * (0.25 + 0.25 * a) * 0.12)
    return out


SFX_EVENTS = [
    # (id, start_sec, builder)
    ("sfx_zoom",     5.60, whoosh, {"dur": 0.5}),
    ("sfx_tankwh",   9.60, whoosh, {"dur": 1.1}),
    ("sfx_tankboom",10.30, boom,   {"dur": 0.6}),
    ("sfx_jubel",   18.10, jubel,  {"dur": 0.9}),
    ("sfx_cash",    23.30, cash,   {"dur": 0.4}),
    ("sfx_err",     28.70, error_tone, {"dur": 1.2}),
]


def build_sfx():
    cues = {}
    for cue_id, start, fn, kwargs in SFX_EVENTS:
        samples = fn(**kwargs)
        path = STEMS / f"{cue_id}.wav"
        _write_wav(path, samples)
        dur = len(samples) / SR
        cues[cue_id] = {"start": start, "duration": dur}
        print(f"  SFX {cue_id:12s}  start={start:5.2f}s  dur={dur:4.2f}s")
    # Ambient bed
    samples = ambient_bed(TOTAL)
    _write_wav(STEMS / "ambient.wav", samples)
    return cues


# --- Mix via ffmpeg ------------------------------------------------------

def mix(vo_cues, sfx_cues):
    inputs = []
    filter_parts = []
    labels = []

    def _add(path, start_ms, gain_db):
        idx = len(inputs) // 2
        inputs.extend(["-i", str(path)])
        # delay -> stereo pad -> volume -> aresample to common rate
        filter_parts.append(
            f"[{idx}:a]aresample={SR},"
            f"aformat=channel_layouts=mono,"
            f"adelay={start_ms}|{start_ms},"
            f"volume={gain_db}dB[a{idx}]"
        )
        labels.append(f"[a{idx}]")

    # Ambient bed first
    _add(STEMS / "ambient.wav", 0, -8)

    # VO
    for cue_id, data in vo_cues.items():
        _add(STEMS / f"vo_{cue_id}.wav", int(data["start"] * 1000), 0)

    # SFX
    for cue_id, data in sfx_cues.items():
        gain = -4 if cue_id != "sfx_err" else -2
        _add(STEMS / f"{cue_id}.wav", int(data["start"] * 1000), gain)

    mix_filter = "".join(labels) + f"amix=inputs={len(labels)}:duration=longest:normalize=0,"
    mix_filter += f"aformat=sample_rates={SR}:channel_layouts=stereo,"
    mix_filter += f"apad=whole_dur={TOTAL},atrim=0:{TOTAL}[out]"

    graph = ";".join(filter_parts + [mix_filter])

    cmd = ["ffmpeg", "-y"] + inputs + [
        "-filter_complex", graph,
        "-map", "[out]",
        "-ac", "2",
        "-ar", str(SR),
        str(OUT / "mix.wav"),
    ]
    print("  running ffmpeg...")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2000:])
        raise RuntimeError("ffmpeg mix failed")


def main():
    print("[1/3] VO (espeak-ng, de)...")
    vo = synth_vo()
    print("[2/3] SFX synth...")
    sfx = build_sfx()
    print("[3/3] Mix...")
    mix(vo, sfx)

    cues = {"vo": vo, "sfx": {k: v for k, v in sfx.items()}, "total": TOTAL}
    (OUT / "cues.json").write_text(json.dumps(cues, indent=2))
    print(f"\nFertig: {OUT / 'mix.wav'}")
    print(f"       {OUT / 'cues.json'}")


if __name__ == "__main__":
    main()
