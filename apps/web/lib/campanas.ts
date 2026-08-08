/**
 * Sonido de la capilla sintetizado con WebAudio: una campana grave al entrar el
 * féretro y un zumbido de órgano de fondo. Sin archivos de audio que cargar, y
 * así el ambiente arranca en el primer gesto del doliente sin esperas.
 */

let ctx: AudioContext | null = null;
let organo: { osciladores: OscillatorNode[]; volumen: GainNode } | null = null;

function contexto(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Constructor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Constructor) return null;
    ctx = new Constructor();
  }
  void ctx.resume();
  return ctx;
}

/** Una campanada grave: varios parciales inarmónicos con caída larga. */
export function tanerCampana(): void {
  const audio = contexto();
  if (!audio) return;

  const ahora = audio.currentTime;
  // Proporciones de una campana real: el timbre nace de que no son armónicos.
  const parciales = [
    { hz: 110, vol: 0.5, seg: 5.5 },
    { hz: 220, vol: 0.32, seg: 4.5 },
    { hz: 262, vol: 0.2, seg: 3.2 },
    { hz: 440, vol: 0.14, seg: 2.4 },
    { hz: 587, vol: 0.08, seg: 1.6 },
  ];

  for (const p of parciales) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = p.hz;
    gain.gain.setValueAtTime(0, ahora);
    gain.gain.linearRampToValueAtTime(p.vol * 0.28, ahora + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ahora + p.seg);
    osc.connect(gain).connect(audio.destination);
    osc.start(ahora);
    osc.stop(ahora + p.seg + 0.1);
  }
}

/** Zumbido de órgano muy bajo, para que el silencio no sea silencio del todo. */
export function arrancarOrgano(): void {
  const audio = contexto();
  if (!audio || organo) return;

  const volumen = audio.createGain();
  volumen.gain.setValueAtTime(0, audio.currentTime);
  volumen.gain.linearRampToValueAtTime(0.05, audio.currentTime + 4);
  volumen.connect(audio.destination);

  // Quinta justa grave: el intervalo más iglesia que existe.
  const osciladores = [55, 82.4, 110].map((hz) => {
    const osc = audio.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = hz;
    osc.connect(volumen);
    osc.start();
    return osc;
  });

  organo = { osciladores, volumen };
}

export function pararOrgano(): void {
  if (!organo || !ctx) return;
  const fin = ctx.currentTime + 1.2;
  organo.volumen.gain.linearRampToValueAtTime(0, fin);
  for (const osc of organo.osciladores) osc.stop(fin + 0.1);
  organo = null;
}
