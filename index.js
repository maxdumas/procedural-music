import StartAudioContext from 'startaudiocontext';
import Tone from 'tone';

StartAudioContext(Tone.context, 'button').then(async () => {
    let reverb = new Tone.Reverb(0.5);
    await reverb.generate();
    let harmonySynth = new Tone.PolySynth(4, Tone.Synth)
        .chain(
            new Tone.AutoFilter('16n', 'A4').start(),
            Tone.Master,
        );
    harmonySynth.set('detune', -1200);
    harmonySynth.volume.value = -15;

    let kickSynth = new Tone.Synth({
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
        volume: 5
    }).chain(Tone.Master);

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
        volume: 0,
    }).chain(reverb, Tone.Master);
    let snareNoiseSynth = new Tone.NoiseSynth({
        noise: {
            type: 'pink',
        },
        envelope: {
            attack: 0.001,
            decay: 0.3,
            sustain: 0.1,
            release: 0.5,
        },
        volume: 0
    }).chain(reverb, Tone.Master);

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

    let harmonyPart = new Tone.Part((time, value) => {
        const { notes, duration = '8n' } = value;
        harmonySynth.triggerAttackRelease(notes, duration, time);
    }, [
        ['0:0', { notes: ['C4', 'E4', 'G4', 'B4'] }],
        ['0:1', { notes: ['C4', 'E4', 'G4', 'B4'] }],
        ['0:2', { notes: ['C4', 'E4', 'G4', 'B4'], duration: '8n.' }],
        ['0:3', { notes: ['C4', 'E4', 'G4', 'B4'] }],

        ['1:0', { notes: ['C4', 'E4', 'G4', 'B4'] }],
        ['1:1', { notes: ['C4', 'E4', 'G4', 'B4'] }],
        ['1:2', { notes: ['C4', 'E4', 'G4', 'B4'], duration: '8n.' }],
        ['1:3', { notes: ['C4', 'E4', 'G4', 'B4'] }],

        ['2:0', { notes: ['D5', 'E4', 'G4', 'B4'] }],
        ['2:1', { notes: ['D5', 'E4', 'G4', 'B4'] }],
        ['2:2', { notes: ['D5', 'E4', 'G4', 'B4'], duration: '8n.' }],
        ['2:3', { notes: ['D5', 'E4', 'G4', 'B4'] }],

        ['3:0', { notes: ['D5', 'D4', 'G4', 'B4'] }],
        ['3:1', { notes: ['D5', 'D4', 'G4', 'B4'] }],
        ['3:2', { notes: ['D5', 'D4', 'G4', 'B4'], duration: '8n.' }],
        ['3:3', { notes: ['D5', 'D4', 'G4', 'B4'] }],
    ]).start();

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = '0';
    Tone.Transport.loopEnd = '4m';
    Tone.Transport.bpm.value = 85;
    Tone.Transport.swing = 0.5;
    Tone.context.latencyHint = 'playback';
    Tone.Transport.start();
});
