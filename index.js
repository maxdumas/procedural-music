import StartAudioContext from 'startaudiocontext';
import Tone from 'tone';

StartAudioContext(Tone.context, 'button').then(() => {
    let harmonySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
    harmonySynth.set('detune', -1200);
    harmonySynth.volume.value = -12;

    let kickSynth =
        new Tone.Synth({
            oscillator: {
                frequency: 70,
                type: 'sine'
            },
            envelope: {
                attack: 0.01,
                decay: 0.05,
                sustain: 0.01,
                release: 0.01,
            },
            volume: 10
        })
        .toMaster();

    let snareColorSynth = new Tone.Synth({
        oscillator: {
            frequency: 180,
            type: 'sine',
        },
        envelope: {
            attack: 0.001,
            decay: 0.3,
            sustain: 0.01,
            release: 0.01,
        },
        volume: -10,
    }).toMaster();
    let snareNoiseSynth = new Tone.NoiseSynth({
        noise: {
            type: 'pink',
        },
        envelope: {
            attack: 0.001,
            decay: 0.3,
            sustain: 0,
            release: 0.01,
        },
        volume: -10
    }).toMaster();

    let kickPart = new Tone.Part(time => {
        kickSynth.triggerAttackRelease(70, '8n', time);
    }, ['0:0', '0:1', '0:1:3', '0:2:0', '0:2:1.5', '0:3:0']);

    kickPart.loop = true;
    kickPart.loopStart = '0';
    kickPart.loopEnd = '1m';
    kickPart.start();

    let snarePart = new Tone.Part(time => {
        snareColorSynth.triggerAttackRelease(180, '16n', time);
        snareNoiseSynth.triggerAttackRelease('16n', time);
    }, ['0:1', '0:3:0']);

    snarePart.loop = true;
    snarePart.loopStart = '0';
    snarePart.loopEnd = '1m';
    snarePart.start();

    let harmonyPart = new Tone.Part((time, notes) => {
        harmonySynth.triggerAttackRelease(notes, '8n', time);
    }, [
        ['0:0', ['C4', 'E4', 'G4', 'B4']],
        ['0:1', ['C4', 'E4', 'G4', 'B4']],
        ['0:2', ['C4', 'E4', 'G4', 'B4']],
        ['0:3', ['C4', 'E4', 'G4', 'B4']],

        ['1:0', ['C4', 'E4', 'G4', 'B4']],
        ['1:1', ['C4', 'E4', 'G4', 'B4']],
        ['1:2', ['C4', 'E4', 'G4', 'B4']],
        ['1:3', ['C4', 'E4', 'G4', 'B4']],

        ['2:0', ['D5', 'E4', 'G4', 'B4']],
        ['2:1', ['D5', 'E4', 'G4', 'B4']],
        ['2:2', ['D5', 'E4', 'G4', 'B4']],
        ['2:3', ['D5', 'E4', 'G4', 'B4']],

        ['3:0', ['D5', 'D4', 'G4', 'B4']],
        ['3:1', ['D5', 'D4', 'G4', 'B4']],
        ['3:2', ['D5', 'D4', 'G4', 'B4']],
        ['3:3', ['D5', 'D4', 'G4', 'B4']],
    ]).start();

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = '0';
    Tone.Transport.loopEnd = '4m';
    Tone.Transport.bpm.value = 85;
    Tone.Transport.swing = 0.5;
    Tone.context.latencyHint = 'playback';
    Tone.Transport.start();
});
