const midiFileURL = "media/Janet_LEFT_logic.mid";

// var player = new Tone.Player("_REFERENCE/janet/Janet-156-SC-NoDrums.aif").toMaster();
var player = new Tone.Player("media/janet_full.mp3").toMaster();

readMidiFile();

// this is the main functionality of the ToneJS MIDI library for reading MIDI files
async function readMidiFile(){

  // load a midi file in the browser
  const currentMidi = await Midi.fromUrl(midiFileURL);

  //the file name decoded from the first track
  const name = currentMidi.name;

  console.log("currentMidi Track Name: ", name);
  console.log("Number of Tracks: ", currentMidi.tracks.length);

  let track1 = currentMidi.tracks[0];
  console.log("CC71", track1.controlChanges[71]);

  const synths = [];
  document
    .querySelector("tone-play-toggle")
    .addEventListener("play", (e) => {
      const playing = e.detail;
      if (playing && currentMidi) {
        const now = Tone.now() + 0.5;
        currentMidi.tracks.forEach((track) => {
          //create a synth for each track
          const synth = new Tone.PolySynth(Tone.Synth, {
            envelope: {
              attack: 0.02,
              decay: 0.1,
              sustain: 0.3,
              release: 1,
            },
          }).toDestination();
          synths.push(synth);
          //schedule all of the events
          track.notes.forEach((note) => {
            synth.triggerAttackRelease(
              note.name,
              note.duration,
              note.time + now,
              note.velocity
            );
          });
          track.controlChanges[70].forEach((cc) => {

            Tone.Transport.schedule((time) => {
              // invoked on measure 16
              // console.log("measure 16!");
              let channel = 1;
              let message = 70;

              sendCCMessage(message, cc.value * 127, channel, "mio");
            }, cc.time);

          });          
          track.controlChanges[71].forEach((cc) => {

            Tone.Transport.schedule((time) => {
              // invoked on measure 16
              // console.log("measure 16!");
              let channel = 1;
              let message = 71;

              sendCCMessage(message, cc.value * 127, channel, "mio");
            }, cc.time);

          });
          track.controlChanges[73].forEach((cc) => {

            Tone.Transport.schedule((time) => {
              // invoked on measure 16
              // console.log("measure 16!");
              let channel = 1;
              let message = 73;

              sendCCMessage(message, cc.value * 127, channel, "mio");
            }, cc.time);


          });          
          track.controlChanges[74].forEach((cc) => {

            Tone.Transport.schedule((time) => {
              // invoked on measure 16
              // console.log("measure 16!");
              let channel = 1;
              let message = 74;

              sendCCMessage(message, cc.value * 127, channel, "mio");
            }, cc.time);

          });


        });

        
        player.sync().start(0)
        // player.start()

        Tone.Transport.start();
      } else {
        //dispose the synth and make a new one
        while (synths.length) {
          const synth = synths.shift();
          synth.disconnect();
        }
      }
    });

    



}

//get the tracks
// midi.tracks.forEach(track => {
  //tracks have notes and controlChanges

  //notes are an array
  // const notes = track.notes;
  // notes.forEach(note => {
  //   //note.midi, note.time, note.duration, note.name
  // })

  //the control changes are an object
  //the keys are the CC number
  // track.controlChanges[64];

  //they are also aliased to the CC number's common name (if it has one)
  // track.controlChanges.sustain.forEach(cc => {
  //   // cc.ticks, cc.value, cc.time
  // });

  //the track also has a channel and instrument
  //track.instrument.name
// });