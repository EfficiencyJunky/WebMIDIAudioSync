// const midiFileURL = "media/Janet_LEFT_logic.mid";
const midiFileURL = "media/Janet_all_midi_tracks.mid";

const ccMessageNumbers = [70, 71, 73, 74];

// var player = new Tone.Player("_REFERENCE/janet/Janet-156-SC-NoDrums.aif").toMaster();
var player = new Tone.Player("media/janet_full.mp3").toMaster();

readMidiFile();

player.sync().start(0);
// player.sync(0);


// ************************ MIDI FILE PREPARATION **************************************
// this is the main functionality of the ToneJS MIDI library for reading MIDI files
async function readMidiFile(){

  // load a midi file in the browser
  const currentMidi = await Midi.fromUrl(midiFileURL);
  
  //the file name decoded from the MIDI object
  const name = currentMidi.name;

  console.log("currentMidi Name: ", name);
  console.log("Number of Tracks: ", currentMidi.tracks.length);

  currentMidi.tracks.forEach((track) => {
    console.log("Track", track);
  });

  const synths = [];

  document.querySelector("tone-play-toggle")
    .addEventListener("play", (e) => {
      
      const playing = e.detail;

      if (playing && currentMidi) {
        
        // const now = Tone.now() + 0.5;

        currentMidi.tracks.forEach((track) => {

          const channel = track.channel + 1;

          //create a synth for each track
          // const synth = new Tone.PolySynth(Tone.Synth, {
          //   envelope: {
          //     attack: 0.02,
          //     decay: 0.1,
          //     sustain: 0.3,
          //     release: 1,
          //   },
          // }).toDestination();
          // synths.push(synth);
          //schedule all of the events
          // track.notes.forEach((note) => {
          //   synth.triggerAttackRelease(
          //     note.name,
          //     note.duration,
          //     note.time + now,
          //     note.velocity
          //   );
          // });

          // CC SCHEDULING
          // Create Control Change message transport schedule

          ccMessageNumbers.forEach( (ccNumber) => {

            track.controlChanges[ccNumber].forEach((cc) => {

              Tone.Transport.schedule((time) => {

                sendCCMessage(ccNumber, cc.value * 127, channel, midiOutputDeviceName);
              }, cc.time);

            });
          });

          // NOTES SCHEDULING
          // Create Note message transport schedule
          track.notes.forEach((note) => {

            Tone.Transport.schedule((time) => {
              
              sendNoteMessage(note.name, note.velocity, channel, midiOutputDeviceName);
            }, note.time);

          });

        });
        
        Tone.Transport.start();

      } else {
        //dispose the synth and make a new one
        // while (synths.length) {
        //   const synth = synths.shift();
        //   synth.disconnect();
        // }
        // player.sync().stop(0);
        Tone.Transport.pause();
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