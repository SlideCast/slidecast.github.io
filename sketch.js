let i = 0;
let init_time = (new Date()).getTime();
let cur_time = (new Date()).getTime();
let dff_time = (new Date()).getTime();
var done = false;
var play = 0;
var drawing = false;
var left = false;
var right = false;
let leftArrow = 0;
let rightArrow = 0;
let originalheight = 1;
let originalwidth = 1;
var sound;
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
    if (drawing || left || right) {
        init_time = diff_time;
        cur_time = (new Date()).getTime();
        if (drawing && i < mouse_y.length && 1000 * mouse_time[i] <= cur_time - init_time) {
            clear();
            // background(220);
            ellipse(mouse_x[i] * canvasWidth / originalwidth, mouse_y[i] * canvasHeight / originalheight, 10, 10);
            fill('blue');
            stroke('blue');
            document.getElementById("start-time").innerHTML = convertTime(mouse_time[i].toFixed(0))
            $("#slider").slider("option", "value", 100 * mouse_time[i] / mouse_time[mouse_time.length - 1])
            i = (i + 1);

        } else if (i == mouse_y.length) {
            // document.getElementById("result").append("completed");
            // document.getElementById('play').innerHTML = 'Play again!';
            // play = 0;
            i = 0;
            rightArrow = 0;
            leftArrow = 0;
            drawing = false;
            left = false;
            right = false;
            init_time = (new Date()).getTime();
            cur_time = (new Date()).getTime();
            dff_time = (new Date()).getTime();
            pageNum = 1;
            queueRenderPage(pageNum);
        }
        if (right && rightArrow < key_r.length && cur_time - init_time >= 1000 * key_r[rightArrow]) {
            onNextPage()
                // console.log("Right")
            rightArrow++;
        } else if (rightArrow == key_r.length) {
            // play = 0;
            // rightArrow = 0;
            right = false;
        }

        if (left && leftArrow < key_l.length && cur_time - init_time >= 1000 * key_l[leftArrow]) {
            onPrevPage()
                // console.log("LEFT")
            leftArrow++;
        } else if (leftArrow == key_l.length) {
            // play = 0;
            // leftArrow = 0;
            left = false;

        }
        // console.log(document.getElementById("start-time").innerHTML)
    } else {
        sound.pause();
        play = 0;
        document.getElementById('play').innerHTML = 'Play!';
        diff_time = (new Date()).getTime() - cur_time + init_time;

    }
}

document.getElementById('play').addEventListener('click', playpause);

function togglePlay(audio) {
    return audio.playing() ? audio.pause() : audio.play();
};

function playpause() {
    if (!loaded) {
        alert("Please wait for loading to finish!");
        return;
    }


    play = play == 0 ? 1 : 0;
    btn = document.getElementById('play');
    btn.innerHTML = play == 0 ? "Play!" : "Pause";
    if (play == 1 && loaded) {
        sound.play();
        last_time = new Date;
        drawing = true;
        left = true;
        right = true;
    } else {
        sound.pause();
        drawing = false;
        left = false;
        right = false;
        // alert("stopped");
    }
}

function seeker(val) {
    i = searchTime(mouse_time, val);
    let curpage = (rightArrow - leftArrow);
    leftArrow = searchTime(key_l, val);
    rightArrow = searchTime(key_r, val);
    pageNum += (rightArrow - leftArrow) - curpage;
    queueRenderPage(pageNum);
    sound.seek(val);
    init_time = (new Date()).getTime();
    cur_time = init_time + mouse_time[i] * 1000;
    // init_time += mouse_time[0];
    diff_time = (new Date()).getTime() - cur_time + init_time;
    document.getElementById("start-time").innerHTML = convertTime(mouse_time[i].toFixed(0))
    $("#slider").slider("option", "value", 100 * mouse_time[i] / mouse_time[mouse_time.length - 1])
}