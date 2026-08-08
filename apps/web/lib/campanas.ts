/**
 * Sonido de la esquela, sintetizado con WebAudio: un acorde de campana al
 * entrar el féretro y un "ding" breve cuando tú mismo dejas una ofrenda. Sin
 * archivos de audio, así el sonido arranca en el primer gesto del doliente.
 */

let ctx: AudioContext | null = null;

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

/** Acorde de tres notas (sol-re-sol agudo) con caída larga: la campana de la capilla. */
export function tanerCampana(): void {
  const audio = contexto();
  if (!audio) return;

  const t = audio.currentTime;
  [392, 587.3, 784].forEach((frecuencia, i) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = frecuencia;
    gain.gain.setValueAtTime(0.16 / (i + 1), t + i * 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 4);
    osc.connect(gain).connect(audio.destination);
    osc.start(t + i * 0.015);
    osc.stop(t + 4.2);
  });
}

/** Un tono breve y agudo: el gesto de dejar tu propia ofrenda tiene eco sonoro. */
export function tanerOfrenda(): void {
  const audio = contexto();
  if (!audio) return;

  const t = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.value = 1174;
  gain.gain.setValueAtTime(0.05, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
  osc.connect(gain).connect(audio.destination);
  osc.start(t);
  osc.stop(t + 0.9);
}
