let midiOutputDeviceName = "IAC Driver MyMIDIPort";
// let midiOutputDeviceName = "mio";

let slider = document.getElementById("slider");
let sliderParent = document.getElementById("slider-parent");
let button = document.getElementById("test-button");

slider.oninput = _sliderOnInput;
button.onclick = _skipAhead15Seconds;


WebMidi.enable(function (err) {

    if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        console.log("WebMidi enabled!");
      }


    // Viewing available inputs and outputs
    console.log("WebMidi Inputs:", WebMidi.inputs);
    console.log("WebMidi Outputs:", WebMidi.outputs);


    printMidiInputInfo(WebMidi.inputs);

    // setupMidiInputs(WebMidi.inputs);


});


function printMidiInputInfo(inputs){
    
    console.log("*****************************************");

    inputs.forEach( (input, index) => {
        console.log("INPUT #", index);
        console.log("connection: ", input.connection);
        console.log("id: ", input.id);
        console.log("manufacturer: ", input.manufacturer);
        console.log("name: ", input.name);
        console.log("state: ", input.state);
        console.log("type: ", input.type);

        console.log("*****************************************");
    });

}



function setupMidiInputs(inputs){
    // Retrieve an input by name, id or index
    // var input = WebMidi.getInputByName("My Awesome Keyboard");
    // OR...
    // input = WebMidi.getInputById("1809568182");
    // input = WebMidi.inputs[0];

    addListeners(inputs[1]);


}


function addListeners(input){

    // Listen for a 'note on' message on all channels
    input.addListener('noteon', 'all',
        function (e) {
            console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
        }
    );

    // Listen to pitch bend message on channel 3
    // input.addListener('pitchbend', 3,
    //     function (e) {
    //         console.log("Received 'pitchbend' message.", e);
    //     }
    // );

    // Listen to control change message on all channels
    input.addListener('controlchange', "all",
        function (e) {
            // console.log("Received 'controlchange' message.", e);

            var channel = e.channel + 3;
            var message = e.data[1];
            var value = e.data[2];

            sendCCMessage(message, value, channel, midiOutputDeviceName);
            // printCCMessage(message, value, channel, outputName);
                      
        }
    );


}


function removeListeners(){
    // Remove all listeners for 'noteoff' on all channels
    // input.removeListener('noteoff');

    // Remove all listeners on the input
    // input.removeListener();


}


function sendCCMessage(message, value, channel, outputName){

    let output = WebMidi.getOutputByName(outputName);
    output.sendControlChange(message, value, channel);

}

function sendNoteMessage(noteNumber, velocity, channel, outputName){

    let output = WebMidi.getOutputByName(outputName);
    output.playNote(noteNumber, channel, {velocity: velocity/127});

}

// *********************************************************************************

function printCCMessage(message, value, channel, output){


    console.log("channel: ", channel);
    console.log("message: ", message);
    console.log("value: ", value);
    console.log("***********************");

}




// ************************ SLIDER METHODS **************************************

function _sliderOnInput(event){

    const sliderVal = event.target.value;

    const sliderColor = scale(sliderVal);
    const sliderLuminance = (sliderVal != 127) ? 50 : 100;

    sliderParent.setAttribute("style", `background-color:hsl(${sliderColor}, 100%, ${sliderLuminance}%);`)
    // console.log(sliderVal);
    // console.log(Math.round(sliderColor));
    // console.log(sliderColor);
    // console.log(sliderLuminance);

    let channel = 1;
    let message = 73;

    sendCCMessage(message, sliderVal, channel, midiOutputDeviceName);

}





// ************************ BUTTON METHODS **************************************
function _skipAhead15Seconds(event){
    
    console.log("Transport Time", Tone.Transport.position);

    // let newTransportPositioin = Tone.Time(Tone.Transport.now() + 15).toBarsBeatsSixteenths();
    // Tone.Transport.position = newTransportPositioin;

    Tone.Transport.position = "5:0:0";
    
  }






// ************************ HELPER METHODS **************************************
function scale(inputMIDIValue){

    let hslMin = 0,
        hslMax = 360,
        midiMin = 0,
        midiMax = 126;

    let percent = (inputMIDIValue - midiMin) / (midiMax - midiMin);
    let outputX = percent * (hslMax - hslMin) + hslMin;

    return outputX;
}