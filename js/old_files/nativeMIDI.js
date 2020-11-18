navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
    console.log(midiAccess);

    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;


    console.log(inputs.values());
}

function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}



// Add minimessage event listener that responds to MIDI input from devices
// function onMIDISuccess(midiAccess) {
//     for (var input of midiAccess.inputs.values())
//         input.onmidimessage = getMIDIMessage;
//     }
// }

function getMIDIMessage(midiMessage) {
    console.log(midiMessage);
}