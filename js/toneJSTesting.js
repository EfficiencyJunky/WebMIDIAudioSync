// Tone.Transport.PPQ = 480;

var midiObject;

// const midiFileURL = "media/Janet_LEFT_logic.mid";
const midiFileURL = "media/Janet_all_midi_tracks_new.mid";

const ccMessageNumbers = [70, 71, 73, 74];

if(typeof(currentMidi) === "undefined"){
  loadMidiFile();
}

// var player = new Tone.Player("_REFERENCE/janet/Janet-156-SC-NoDrums.aif").toMaster();
var player;

const audioFileURL = "media/janet_full.mp3";

if(typeof(useAudioFileLoaderUI) === "undefined" || useAudioFileLoaderUI === false){
  loadAudioFile();
}



// player.sync(0);

function loadAudioFile(fileName){

  let audioFilePath = (fileName) ? "media/" + fileName : audioFileURL;

  player = new Tone.Player(audioFilePath).toMaster();

  player.sync().start(0);
}



// ************************ MIDI FILE PREPARATION **************************************
// this is the main functionality of the ToneJS MIDI library for reading MIDI files
async function loadMidiFile(midiToUse){

  // load a midi file in the browser
  const midiObj = (midiToUse) ? midiToUse : await Midi.fromUrl(midiFileURL);
  
  //the file name decoded from the MIDI object
  const name = midiObj.name;

  console.log("midiObj ppq: ", midiObj.header.ppq);
  console.log("midiObj all: ", midiObj.header.tempos[0].bpm);

  console.log("midiObj Name: ", name);
  console.log("Number of Tracks: ", midiObj.tracks.length);

  midiObj.tracks.forEach((track) => {
    console.log("Track", track);
  });

  midiObject = midiObj;

  const synths = [];

  document.querySelector("tone-play-toggle")
    .addEventListener("play", (e) => {
      
      const playing = e.detail;

      if (playing && midiObj) {
        
        // const now = Tone.now() + 0.5;

        midiObj.tracks.forEach((track) => {

          const channel = track.channel + 1;

          // CC SCHEDULING
          // Schedule Control Change messages to the transport
          ccMessageNumbers.forEach( (ccNumber) => {

            track.controlChanges[ccNumber].forEach((cc) => {

              Tone.Transport.schedule((time) => {

                sendCCMessage(ccNumber, cc.value * 127, channel, midiOutputDeviceName);
              }, cc.time);

            });
          });

          // NOTES SCHEDULING
          // Schedule Note messages to the transport
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