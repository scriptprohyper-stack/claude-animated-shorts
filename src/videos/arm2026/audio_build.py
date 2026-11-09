#!/usr/bin/env python3
"""
Audio-Mix fuer „Herzlichen Glueckwunsch! Du bist arm." (30 s).
espeak-ng VO + synthetische SFX. Keine externen Dienste.
"""
import json
import math
import subprocess
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "public" / "audio"
STEMS = OUT / "stems_arm"
OUT.mkdir(parents=True, exist_ok=True)
STEMS.mkdir(parents=True, exist_ok=True)

SR = 48000
TOTAL = 30.0


# --- VO ------------------------------------------------------------------
# ASCII fuer espeak, Umlaute werden in der Composition in Untertitel ersetzt.

VO = [
    # (id, start, voice, pitch, wpm, text)
    ("hook",   0.20, "de+f4", 72, 195, "Herzlichen Glueckwunsch! Du bist offiziell arm!"),
    ("bot1",   3.50, "de+f2", 70, 195, "Willkommen im Arm-Programm. Armut ist jetzt spannend!"),
    ("bot2",   6.20, "de+f2", 70, 195, "Was Sie sich nicht leisten koennen, bringt Punkte!"),
    ("bot3",   9.00, "de+f2", 72, 200, "Butter nicht gekauft? Plus fuenfzig!"),
    ("bot4",  11.30, "de+f2", 72, 200, "Heizung aus im Winter? Plus zweihundert!"),
    ("bot5",  13.70, "de+f2", 72, 200, "Freunde abgesagt, weil Bier zu teuer? Plus fuenfhundert — und ein Wellness-Sticker!"),
    ("drl2",  19.20, "de+m1", 48, 160, "Und was krieg ich dafuer?"),
    ("bot6",  20.80, "de+f2", 70, 195, "Mit genug Punkten erreichen Sie den Premium-Status!"),
    ("drl3",  23.40, "de+m1", 48, 160, "Was ist Premium?"),
    ("bot7",  24.60, "de+f2", 60, 175, "Premium ist das Leben, das Sie zweitausendneunzehn hatten."),
]


def synth_vo():
    out = {}
    for cid, start, voice, pitch, wpm, text in VO:
        p = STEMS / f"vo_{cid}.wav"
        subprocess.run([
            "espeak-ng", "-v", voice, "-p", str(pitch), "-s", str(wpm),
            "-a", "185", "-w", str(p), text,
        ], check=True)
        d = wav_duration(p)
        out[cid] = {"start": start, "duration": d, "text": text}
        print(f"  VO {cid:6s}  start={start:5.2f}  dur={d:4.2f}")
    return out


def wav_duration(p: Path) -> float:
    with wave.open(str(p), "rb") as w:
        return w.getnframes() / w.getframerate()


# --- SFX ----------------------------------------------------------------

def _write(path: Path, samples, sr=SR):
    import struct
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        buf = bytearray()
        for s in samples:
            v = int(max(-1.0, min(1.0, s)) * 32767)
            buf += struct.pack("<h", v)
        w.writeframes(bytes(buf))


def chime(dur=0.45):
    """Freundlicher Notifications-Ping, 2 Toene aufsteigend."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        env = math.exp(-t * 6)
        f1, f2 = 880, 1320
        s = math.sin(2 * math.pi * f1 * t) * 0.5 + math.sin(2 * math.pi * f2 * t) * 0.3
        out.append(s * env * 0.5)
    return out


def confetti(dur=0.8):
    """Konfetti-Burst: viele kleine zufaellige Partikel-Pings."""
    import random
    random.seed(42)
    n = int(dur * SR)
    out = [0.0] * n
    for _ in range(14):
        t0 = random.random() * dur * 0.6
        freq = 1400 + random.random() * 2800
        len_s = 0.05 + random.random() * 0.1
        start_i = int(t0 * SR)
        for j in range(int(len_s * SR)):
            i = start_i + j
            if i >= n:
                break
            tt = j / SR
            env = math.exp(-tt * 40)
            out[i] += math.sin(2 * math.pi * freq * tt) * env * 0.35
    return out


def badge_ding(dur=0.5, up=True):
    """Achievement-Ton: 3 Dreiklang-Noten in 0.5 s."""
    n = int(dur * SR)
    out = []
    notes = [523, 659, 784] if up else [784, 659, 523]  # C, E, G
    step = dur / 3
    for i in range(n):
        t = i / SR
        idx = min(2, int(t / step))
        local = t - idx * step
        env = math.sin(math.pi * local / step) if local < step else 0
        s = math.sin(2 * math.pi * notes[idx] * t) * env * 0.4
        out.append(s)
    return out


def fail_tone(dur=1.1):
    """Windows-aehnlicher Fehlerton."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        if t < 0.35:
            f = 740
            env = math.sin(math.pi * (t / 0.35)) if t < 0.35 else 0
        elif t < 0.45:
            env, f = 0, 740
        elif t < 0.95:
            lt = t - 0.45
            f = 494
            env = math.sin(math.pi * (lt / 0.5)) if lt < 0.5 else 0
        else:
            env, f = 0, 494
        s = math.sin(2 * math.pi * f * t) * 0.55 + math.sin(2 * math.pi * f * 1.5 * t) * 0.22
        out.append(s * env * 0.6)
    return out


def typing_beep(dur=0.08):
    """Kurzer UI-Beep."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        env = math.exp(-t * 60)
        out.append(math.sin(2 * math.pi * 1800 * t) * env * 0.3)
    return out


def ambient(dur=TOTAL):
    """Leises Pad fuer Grundton."""
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        a = 0.5 + 0.5 * math.sin(2 * math.pi * 0.2 * t)
        s = (math.sin(2 * math.pi * 110 * t) * 0.10
             + math.sin(2 * math.pi * 165 * t) * 0.06)
        out.append(s * (0.3 + 0.2 * a) * 0.09)
    return out


SFX = [
    # (id, start, builder, kwargs, gain_db)
    ("chime_hook",  0.00, chime,       {"dur": 0.5}, -2),
    ("confetti",    0.25, confetti,    {"dur": 0.7}, -4),
    ("badge1",      8.90, badge_ding,  {"dur": 0.5}, -3),
    ("badge2",     11.20, badge_ding,  {"dur": 0.5}, -3),
    ("badge3",     13.60, badge_ding,  {"dur": 0.5}, -3),
    ("chime_prem", 20.70, chime,       {"dur": 0.4}, -6),
    ("fail",       28.50, fail_tone,   {"dur": 1.3}, -1),
]


def build_sfx():
    out = {}
    for cid, start, fn, kw, gain in SFX:
        samples = fn(**kw)
        p = STEMS / f"{cid}.wav"
        _write(p, samples)
        out[cid] = {"start": start, "duration": len(samples) / SR, "gain_db": gain}
        print(f"  SFX {cid:12s}  start={start:5.2f}  dur={out[cid]['duration']:4.2f}")
    _write(STEMS / "ambient.wav", ambient(TOTAL))
    return out


def mix(vo, sfx):
    inputs = []
    parts = []
    labels = []

    def add(path, start_ms, gain_db):
        idx = len(inputs) // 2
        inputs.extend(["-i", str(path)])
        parts.append(
            f"[{idx}:a]aresample={SR},"
            f"aformat=channel_layouts=mono,"
            f"adelay={start_ms}|{start_ms},"
            f"volume={gain_db}dB[a{idx}]"
        )
        labels.append(f"[a{idx}]")

    add(STEMS / "ambient.wav", 0, -10)
    for cid, d in vo.items():
        add(STEMS / f"vo_{cid}.wav", int(d["start"] * 1000), 0)
    for cid, d in sfx.items():
        add(STEMS / f"{cid}.wav", int(d["start"] * 1000), d["gain_db"])

    mix_filter = (
        "".join(labels)
        + f"amix=inputs={len(labels)}:duration=longest:normalize=0,"
        + f"aformat=sample_rates={SR}:channel_layouts=stereo,"
        + f"apad=whole_dur={TOTAL},atrim=0:{TOTAL}[out]"
    )
    graph = ";".join(parts + [mix_filter])
    cmd = ["ffmpeg", "-y"] + inputs + [
        "-filter_complex", graph,
        "-map", "[out]",
        "-ac", "2",
        "-ar", str(SR),
        str(OUT / "arm.wav"),
    ]
    print("  mix...")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-1500:])
        raise RuntimeError("ffmpeg mix failed")


def main():
    print("[1/3] VO (espeak-ng, de)...")
    vo = synth_vo()
    print("[2/3] SFX...")
    sfx = build_sfx()
    print("[3/3] Mix...")
    mix(vo, sfx)
    cues = {"vo": vo, "sfx": sfx, "total": TOTAL}
    (OUT / "arm_cues.json").write_text(json.dumps(cues, indent=2))
    print(f"\nFertig: {OUT / 'arm.wav'}")


if __name__ == "__main__":
    main()
