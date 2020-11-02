let originalheight = 1;
let originalwidth = 1;
let init_time = (new Date()).getTime();
let cur_time = (new Date()).getTime();
let diff_time = (new Date()).getTime();
var mouse = [];
var keyboard = [];
var record = false;
var sound;
var recorder;
var pdf = null;
sound = new Howl({
    src: [localStorage.getItem("audio")]
});

function setup() {
    let cnt = createCanvas(canvasWidth, canvasHeight);
    cnt.parent('mouse');
    // background(220);
    // beginRendering();
}

function draw() {
    clear();
    ellipse(mouseX, mouseY, 10, 10);
    // console.log(mouseX)
    fill('blue');
    stroke('blue');
    if (record) {
        if (cur_time - diff_time > 100) {
            mouse.push([(cur_time - init_time) / 1000, [mouseX, mouseY]]);
            // mouse_y.push(mouseY);
            // mouse_time.push((cur_time - init_time) / 1000);
            diff_time = cur_time;
        }
        cur_time = (new Date()).getTime();
    }
}

startrecording = async() => {
    record = record ? false : true;
    btn = document.getElementById('record');
    btn.innerHTML = record ? "Stop" : "Record";
    if (record) {
        $("#slider-container").removeClass("show").addClass("hidden");
        console.log("start")
        recorder = await recordAudio();
        recorder.start();
        console.log("started")
        init_time = (new Date()).getTime();
        diff_time = (new Date()).getTime();
        mouse = [];
        keyboard = [];
    }
    if (!record) {
        $("#slider-container").removeClass("hidden").addClass("show");
        sound = await recorder.stop();
        // sound.play();
        mouseData = JSON.stringify(mouse)
        keyboardData = JSON.stringify(keyboard)
        getSLD(mouseData, keyboardData, pdf, sound.audioBlob)
    }
}

document.getElementById('record').addEventListener('click', startrecording)