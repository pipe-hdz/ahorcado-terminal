// Música ambiental generada con Web Audio API (sin archivos externos).
// Un pad grave y suave + un arpegio pentatónico lento por encima.
const Music = (() => {
  let ctx = null;
  let master, filter, lfo;
  let playing = false;
  let arpTimer = null;
  let noteIndex = 0;

  const PAD_FREQS = [130.81, 164.81, 196.00]; // C3, E3, G3
  const SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // pentatónica suave

  function build(){
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.Q.value = 0.6;
    filter.connect(master);

    // LFO que hace "respirar" el filtro para que el pad no sea estático
    lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    PAD_FREQS.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.03;
      osc.connect(g);
      g.connect(filter);
      osc.start();
    });
  }

  function pluck(freq, time){
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.05, time + 0.15);
    g.gain.exponentialRampToValueAtTime(0.001, time + 1.1);
    osc.connect(g);
    g.connect(filter);
    osc.start(time);
    osc.stop(time + 1.2);
  }

  function loop(){
    if(!playing) return;
    pluck(SCALE[noteIndex % SCALE.length], ctx.currentTime);
    noteIndex++;
    arpTimer = setTimeout(loop, 850);
  }

  function start(){
    if(!ctx) build();
    if(ctx.state === "suspended") ctx.resume();
    playing = true;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
    loop();
  }

  function stop(){
    playing = false;
    clearTimeout(arpTimer);
    if(ctx){
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    }
  }

  function toggle(){
    if(playing){ stop(); return false; }
    start(); return true;
  }

  return { toggle };
})();
