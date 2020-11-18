let slider = document.getElementById("slider");
slider.oninput = _sliderOnInput;
let sliderParent = document.getElementById("slider-parent");
let button = document.getElementById("stop-start");
button.onclick = _toggleTimer;

// store the height/width of the window
let winHeight = window.innerHeight;
let winWidth = window.innerWidth;

const _scaleFactor = 0.2;

function _timerCallback(){
    const offsetTop = Math.round(winHeight * (_scaleFactor * Math.random()));
    const offsetWidth = Math.round(winWidth * (_scaleFactor * Math.random()));

    // sliderParent.setAttribute("style", `top:${offsetTop}`);
    // sliderParent.setAttribute("style", `right:${offsetWidth}`);
    sliderParent.style.top = `${offsetTop}px`;
    sliderParent.style.left = `${offsetWidth}px`;
    // slider.offsetWidth = `${offsetWidth}px`;

    // console.log("offsetTop", `${offsetTop}px`);
    // console.log("offsetWidth", `${offsetWidth}px`);
}


const _timerInterval = 250;
let _timerID = undefined;

// _timerStart();


// ################## PRIVATE UI UPDATE METHODS ##################

// starts an interval timer that runs a callback every x milliseconds
function _timerStart() {
    
    if(_timerID === undefined){
        
        _timerID = window.setInterval(_timerCallback , _timerInterval);
    }

}

// stops the currently running interval timer who's ID is stored in "_rabbitAndSliderSyncTimerID"
function _timerStop(){
    if(_timerID !== undefined){

        // garbage collection
        clearInterval(_timerID);
    
        // this lets us know we need a new one
        _timerID = undefined;
    }
}


function _toggleTimer(event){
    if(_timerID !== undefined){
        _timerStop();
    }
    else{
        _timerStart();
    }

}


function _sliderOnInput(event){

    const sliderVal = event.target.value;
    sliderParent.setAttribute("style", `background-color:hsl(${sliderVal}, 100%, 50%);`)

    // console.log(sliderVal);
}