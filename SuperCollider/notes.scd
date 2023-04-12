s.boot;
s.quit;
(
OSCdef.new(
    \fromnode,
    // The following function will be executed every time 
    // a message is received at the address 'bouncy'.
    {
        arg msg, time, addr, port;
        // The message we receive is contained in the msg property.
        var note = 0;
        // msg.postln;
        // We create a simple Synth with the play method.
        // The Synth node will be removed when the EnvGen reaches the end
        // of its envelope (because of doneAction: 2). This is a simple
        // frequency modulation (FM) synth with 3 operators (op1, op2, op3).
        var busses = [~bu, ~bu2];
        {
        var sig = Impulse.ar(0.1);
        var env = EnvGen.kr(Env([0, 1, 0], [0.1, 0.01]), doneAction: 2);
            Out.ar(busses[msg[1]], sig);
        }.play;
    },
    // This is the address at which this instance of OSCdef listens.
    'moon'
);
)


(
~bu = Bus.audio(s, 2);
~bu2 = Bus.audio(s, 2);
)


(
~rr.free;
~rr = {
    var sig = In.ar(~bu, 2);
    MiRings.ar(sig, pit: 60 - 1 - 12, struct: 0.5, model: 1) * 0.1!2;
}.play;
)

(
~rr2.free;
~rr2 = {
    var sig = In.ar(~bu2, 2);
    MiRings.ar(sig, pit: 60 - 1 - 24, struct: 0, model: 1) * 0.4!2;
}.play;
)
(
~rr.free;
~rr = {
    var sig = In.ar(~bu, 2);
    MiRings.ar(sig, pit: 60 - 1 - 36, struct: MouseY.kr(0, 1), damp: MouseX.kr(0, 1), pos: SinOsc.kr(6).unipolar * 0.1, model: 1) * 0.1!2;
}.play;
)
(
~rr.free;
~rr = {
    var sig = In.ar(~bu, 2);
    MiRings.ar(sig, pit: 60 - 1 - 36, struct: MouseY.kr(0, 1), damp: MouseX.kr(0, 1), pos: SinOsc.kr(6).unipolar * 0.1, model: 3) * 0.1!2;
}.play;
)


(
~rr.free;
~rr = {
    var in = In.ar(~bu, 2);
    var sig = MiRings.ar(in, pit: 60 - 1 - 36, struct: 0, damp: 1, pos: SinOsc.kr(6).unipolar * 0.1, model: 3) * 0.05!2;
    sig = sig + (MiRings.ar(in, pit: 60 - 1 - 36, struct: 0, damp: 0.4, pos: SinOsc.kr(6).unipolar * 0.1, model: 3) * 1.3!2);
}.play;
)

(
~rr.free;
~rr = {
    var in = In.ar(~bu, 2);
    var sig = MiRings.ar(in, pit: 60 - 1 - 36, struct: 0, damp: 1, pos: SinOsc.kr(6).unipolar * 0.1, model: 3) * 0.1!2;
    sig = sig + (MiRings.ar(in, pit: 60 - 1 - 0 - 2, struct: 0, damp: 0.4, pos: SinOsc.kr(6).unipolar * 0.1, model: 1) * 0.3!2);
}.play;
)
x.free;
x = {SinOsc.ar(220) * 0.1!2}.play;