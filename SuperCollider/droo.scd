(
{        
    var x = MouseX.kr(0, 1);
    var y = MouseY.kr(0, 1);
    var lfo = SinOsc.kr(0.1);
    var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var sig = MiPlaits.ar(
        30 + [0, 0.01 * lfo] + 12 + 7 + xx - 24, 
        engine: 0, 
        harm: x, timbre: 1 - y, morph: y
    );
    sig = [sig[0][1], sig[1][1]];
    sig = VadimFilter.ar(
        sig, 
        5000 * lfo.unipolar + 100, 
        0.25, 
        1
    ) * 0.4;
}.play;
)


(o).unipolar


Scale.minor.degrees
Scale.phrygian.degrees;


(
x.free;
x = {        
    var x = MouseX.kr(0, 1);
    var y = MouseY.kr(0, 1);
    var lfo = SinOsc.kr(0.1).unipolar;
    var lfo2 = SinOsc.kr(0.1).unipolar;
    // var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var scale = Scale.minor.degrees ++ [12];
    var xx = Select.kr([floor(x * 8)], scale).lag(0.5);
    var t = Impulse.kr(1);
    var d = Demand.kr(t, 0, Dwhite());
    var sig = MiPlaits.ar(
        30 + [0, 0.01 * lfo], 
        engine: 0, harm: 0.25, timbre: 0.5 - (lfo2 * 0.1), morph: x);
    sig = [sig[0][1], sig[1][1]];
        SendReply.kr(Impulse.kr(30), '/dListener', x, 1);
    SendReply.kr(Impulse.kr(30), '/dYListener', y, 1);
    sig = VadimFilter.ar(sig, 1000 * lfo.unipolar + 100, 0.25, 1) * 0.4;}.play;
)



(
x.free;
x = {        var x = MouseX.kr(0, 1);
        var y = MouseY.kr(0, 1);
    var lfo = SinOsc.kr(0.1).unipolar;
    var lfo2 = SinOsc.kr(0.1).unipolar;
// var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var scale = Scale.minor.degrees ++ [12];
    var xx = Select.kr([floor(x * 8)], scale).lag(0.5);
    var t = Impulse.kr(1);
    var d = Demand.kr(t, 0, Dwhite());
    var d2 = Demand.kr(t, 0, Dseq([0, 0, 3, -2], inf));
    var sig = MiPlaits.ar(30 + [0, 0.01 * lfo] + d2 + 12, engine: 0, harm: 0.25, timbre: 0.5 - (lfo2 * 0.1), morph: x);
    sig = [sig[0][1], sig[1][1]];
        SendReply.kr(Impulse.kr(30), '/dListener', x, 1);
    sig = VadimFilter.ar(sig, 1000 * lfo.unipolar + 100, 0.25, 1) * 0.4;}.play;
)



(
{        
    var x = MouseX.kr(0, 1);
    var y = MouseY.kr(0, 1);
    var lfo = SinOsc.kr(0.1);
    // var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var scale = Scale.minor.degrees ++ [12];
    var xx = Select.kr([floor(x * 8)], scale).lag(0.5);
    var sig = MiPlaits.ar(30 + [0, 0.01 * lfo] + 12 + 0 + xx, engine: 0, harm: x, timbre: 1 - y, morph: y);
    sig = [sig[0][1], sig[1][1]];
    sig = VadimFilter.ar(sig, 1000 * lfo.unipolar + 4100, 0.25, 1) * 0.1;
}.play;
)




// ----------------------


(
x.free;
x = {       
    var x = MouseX.kr(0, 1);
    var y = MouseY.kr(0, 1);
    var lfo = SinOsc.kr(0.1).unipolar;
    var lfo2 = SinOsc.kr(0.1).unipolar;

    var scale = Scale.minor.degrees ++ [12];
    var xx = Select.kr([floor(x * 8)], scale).lag(0.5);
    var sig = MiPlaits.ar(30 + [0, 0.01 * lfo] - 0, engine: 5, harm: 0.5, timbre: 0.5, morph: 0.25);
    sig = [sig[0][1], sig[1][1]];
    sig = VadimFilter.ar(sig, 1000 * lfo.unipolar + 100, 0.25, 1) * 0.4;
}.play;
)

(
y.free;
y = {   
    var x = 1 - MouseX.kr(0, 1);
    var y = MouseY.kr(0, 1);
    var lfo = SinOsc.kr(0.1);
    // var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var scale = Scale.minor.degrees ++ [12];
    var xx = Select.kr([floor(x * 8)], scale).lag(0.5);
    var sig = MiPlaits.ar(
        30 + [0, 0.01 * lfo] + 12 + 0 + xx, 
        engine: 0, harm: x, timbre: 1 - y, morph: y
    );
    sig = [sig[0][1], sig[1][1]];
    sig = VadimFilter.ar(sig, 1000 * lfo.unipolar + 1100, 0.25, 1) * 0.4;
}.play;
)


(
x.free;
x = {        
    // var x = MouseX.kr(0, 1);
    // var y = MouseY.kr(0, 1);
    var x = 0.39; var y = 0.5;
    var lfo = SinOsc.kr(0.25 * ((1..6)/6));
    var t = Impulse.kr(0.25);
    var t2 = Impulse.kr(4);
    var d = Demand.kr(t, 0, Dseq([25, 32 - 3, 30, 32] * -1, inf));
    var e = EnvGen.kr(Env([0, 1, 0], [0.01, 1], -8), t2);
    var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var sig = MiPlaits.ar(
        ~toMidi.("Ab2") + ([0, 0.05].wrapExtend(6) * lfo) + [0, 12, 19].stutter(2) + xx + d, 
        engine: 6, 
        harm: 0.5, timbre: 1 - y, morph: 0.5
    );
    sig = [sig[0][1] + sig[2][1] + sig[4][1], sig[1][1] + sig[3][1] + sig[5][1]];
    // y.poll;
    sig = VadimFilter.ar(
        sig, 
        2000 * [lfo[0], lfo[1]].unipolar + 1000, 
        0.25, 
        1
    ) * 0.4;
}.play;
)


(
y.free;
y = {        
    // var x = MouseX.kr(0, 1);
    // var y = MouseY.kr(0, 1);
    var x = 0.39; var y = 0.5;
    var lfo = SinOsc.kr(0.25 * ((1..6)/6));
    var t = Impulse.kr(0.25);
    var t2 = Impulse.kr(6);
    var d = Demand.kr(t2, 0, Dseq([0, 3, 2, -2].stutter(2).reverse, inf));
    var d2 = Demand.kr(t2, 0, Dseq((1..16)/16 + 1, inf));
    var e = EnvGen.kr(Env([0, 1, 0], [0.05, 0.25], -8), t2);
    var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var sig = MiPlaits.ar(
        ~toMidi.("C5") + ([0, 0.05].wrapExtend(6) * lfo) + [0, 12, 19].stutter(2) + xx + d, 
        engine: 6, 
        harm: 0.75, timbre: 0.25, morph: 0.5
    );
    sig = [sig[0][1] + sig[2][1] + sig[4][1], sig[1][1] + sig[3][1] + sig[5][1]];
    // y.poll;
    sig = VadimFilter.ar(
        sig, 
        2000 * e + 100, 
        0.25, 
        5
    ) * 0.04;
}.play(fadeTime: 0.025);
)


(
z.free;
z = {        
    // var x = MouseX.kr(0, 1);
    // var y = MouseY.kr(0, 1);
    var x = 0.39; var y = 0.5;
    var lfo = SinOsc.kr(0.25 * ((1..6)/6));
    var t = Impulse.kr(0.25);
    var t2 = Impulse.kr(6);
    var d = Demand.kr(t2, 0, Dseq([0].stutter(2), inf));
    var d2 = Demand.kr(t2, 0, Dseq((1..16)/16 + 1, inf));
    var e = EnvGen.kr(Env([0, 1, 0], [0.05, 0.25], -8), t2);
    var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var sig = MiPlaits.ar(
        ~toMidi.("C3") + ([0, 0.05].wrapExtend(6) * lfo) + [0, 12, 19].stutter(2) + xx + d, 
        engine: 5, 
        harm: 0.75, timbre: 0.25, morph: 0.85
    );
    sig = [sig[0][1] + sig[2][1] + sig[4][1], sig[1][1] + sig[3][1] + sig[5][1]];
    // y.poll;
    sig = VadimFilter.ar(
        sig, 
        2000 * e + 1000, 
        0.25, 
        5
    ) * 0.2;
}.play(fadeTime: 0.025);
)

s.mute;
s.unmute;
(
{        
    // var x = MouseX.kr(0, 1);
    // var y = MouseY.kr(0, 1);
    var x = 0.39; var y = 0.5;
    var lfo = SinOsc.kr(0.25 * ((1..6)/6));
    var t = Impulse.kr(0.25);
    var t2 = Impulse.kr(4);
    var d = Demand.kr(t, 0, Dseq([25, 24, 30, 29] * -1, inf));
    var d2 = Demand.kr(t2, 0, Dseq((1..16)/16 + 1, inf));
    var e = EnvGen.kr(Env([0, 1, 0], [0.1, d2], -8), t2);
    var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var sig = MiPlaits.ar(
        ~toMidi.("Ab2") + ([0, 0.05].wrapExtend(6) * lfo) + [0, 12, 19].stutter(2) + xx + d, 
        engine: 6, 
        harm: 0.5, timbre: 0.5, morph: 0.5
    );
    sig = [sig[0][1] + sig[2][1] + sig[4][1], sig[1][1] + sig[3][1] + sig[5][1]];
    // y.poll;
    sig = VadimFilter.ar(
        sig, 
        2000 * e + 100, 
        0.25, 
        1
    ) * 0.4;
}.play(fadeTime: 0.025);
)




(
y.free;
y = {        
    // var x = MouseX.kr(0, 1);
    // var y = MouseY.kr(0, 1);
    var x = 0.39; var y = 0.5;
    var lfo = SinOsc.kr(0.25 * ((1..6)/6));
    var t = Impulse.kr(0.25);
    var t2 = Impulse.kr(6);
    var d = Demand.kr(t2, 0, Dseq([0, 3, 2, -2].stutter(2).reverse, inf));
    var d2 = Demand.kr(t2, 0, Dseq((1..16)/16 + 1, inf));
    var e = EnvGen.kr(Env([0, 1, 0], [0.01, 0.5], -8), t2);
    var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var sig = MiPlaits.ar(
        ~toMidi.("C5") + ([0, 0.05].wrapExtend(6) * lfo) + [0, 12, 19].stutter(2) + xx + d, 
        engine: 6, 
        harm: 0.75, timbre: 0.25, morph: 0.5
    );
    sig = [sig[0][1] + sig[2][1] + sig[4][1], sig[1][1] + sig[3][1] + sig[5][1]];
    // y.poll;
    sig = VadimFilter.ar(
        sig, 
        15000 * e + 100, 
        0.25, 
        1
    ) * 0.04;
    sig = CombN.ar(sig, 1, 0.0625 * [1, 1.01], 2);
}.play(fadeTime: 0.025);
)



(
y.free;
y = {        
    // var x = MouseX.kr(0, 1);
    // var y = MouseY.kr(0, 1);
    var x = 0.39; var y = 0.5;
    var lfo = SinOsc.kr(0.25 * ((1..6)/6));
    var t = Impulse.kr(0.25);
    var t2 = Impulse.kr(3);
    var d = Demand.kr(t2, 0, Dseq([0, 3, 2, -2].stutter(2).reverse, inf));
    var d2 = Demand.kr(t2, 0, Dseq((1..16)/16 + 1, inf));
    var e = EnvGen.kr(Env([0, 1, 0], [0.01, 0.5], -8), t2);
    var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var sig = MiPlaits.ar(
        ~toMidi.("C5") + ([0, 0.05].wrapExtend(6) * lfo) + [0, 12, 19].stutter(2) + xx + d, 
        engine: 6, 
        harm: 0.75, timbre: 0.25, morph: 0.5
    );
    sig = [sig[0][1] + sig[2][1] + sig[4][1], sig[1][1] + sig[3][1] + sig[5][1]];
    // y.poll;
    sig = VadimFilter.ar(
        sig, 
        15000 * e + 100, 
        0.25, 
        1
    ) * 0.04;
    sig = sig * 0 + (CombN.ar(sig, 1, 0.0625 * [1, 1.01], 2) * 1);
}.play(fadeTime: 0.025);
)



(
w.free;
w = {        
    // var x = MouseX.kr(0, 1);
    // var y = MouseY.kr(0, 1);
    var x = 0.39; var y = 0.5;
    var lfo = SinOsc.kr(0.25 * ((1..6)/6));
    var t = Impulse.kr(0.25);
    var t2 = Impulse.kr(3);
    var d = Demand.kr(t2, 0, Dseq([25, 24, 30, 29].stutter(16) * -1, inf));
    var d2 = Demand.kr(t2, 0, Dseq(((1..16)/16 + 0.5), inf));
    var e = EnvGen.kr(Env([0, 1, 0], [0.1, d2], -8), t2);
    var xx = (round(sin(x * 50) * 0.5 + 0.5)).lag(0.5);
    var sig = MiPlaits.ar(
        ~toMidi.("Ab2") + ([0, 0.05].wrapExtend(6) * lfo) + [0, 12, 19].stutter(2) + xx + d, 
        engine: 6, 
        harm: 0.5, timbre: 0.5, morph: 0.5,
        trigger: t2,
        decay: d2,
        level: e * e * e,
        lpg_colour: 0.29
        // timb_mod: -0.25
    );
    sig = [sig[0][1] + sig[2][1] + sig[4][1], sig[1][1] + sig[3][1] + sig[5][1]];
    // y.poll;
    sig = VadimFilter.ar(
        sig, 
        1000 * e + 100, 
        0.25, 
        1
    ) * 0.4;
}.play(fadeTime: 0.025);
)
