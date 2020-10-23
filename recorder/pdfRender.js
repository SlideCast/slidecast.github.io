/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
var pdfDoc = null;
var canvasWidth = 1;
var canvasHeight = 1;
var fullscr = false;
var pageNum = 0;
var pageRendering = false;
var loaded = false;

function renderPage(num) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function(page) {
        canvasHeight = window.innerHeight;
        canvasWidth = window.innerWidth;
        if (!fullscr) {
            canvasHeight *= 0.9;
            canvasWidth *= 0.9;
        }
        btnHeight = getComputedStyle(document.getElementById("play-buttons")).getPropertyValue("height")
        canvasHeight -= parseFloat(btnHeight.substr(0, btnHeight.length - 2))
        var viewport_old = page.getViewport({ scale: 1 });
        var ratio = canvasWidth / viewport_old.width
        if (ratio > canvasHeight / viewport_old.height)
            ratio = canvasHeight / viewport_old.height
        var viewport = page.getViewport({ scale: ratio });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        document.getElementById('mouse').width = viewport.width + 'px';
        document.getElementById('mouse').height = viewport.height + 'px';
        document.getElementById('mouse').style.width = viewport.width + 'px';
        document.getElementById('mouse').style.height = viewport.height + 'px';
        document.getElementById('play-buttons').style.width = viewport.width + 'px';
        resizeCanvas(viewport.width, viewport.height);
        canvasWidth = viewport.width;
        canvasHeight = viewport.height;
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    // Update page counters
    document.getElementById('page_num').textContent = num;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
    if (!loaded)
        return
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    keyboard.push([(cur_time - init_time) / 1000, "LEFT"])
    queueRenderPage(pageNum);
}

function onPrev() {
    if (!loaded)
        return
    if (pageNum <= 1) {
        return;
    }
    onPrevPage();
    // seeker(key_l[leftArrow - 1]);
}
document.getElementById('prev').addEventListener('click', onPrev);

/**
 * Displays next page.
 */
function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    keyboard.push([(cur_time - init_time) / 1000, "RIGHT"])
    queueRenderPage(pageNum);
}

function onNext() {
    if (!loaded)
        return
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    onNextPage();
    // seeker(key_l[rightArrow + 1]);
}

document.getElementById('next').addEventListener('click', onNext);

/**
 * Asynchronously downloads PDF.
 */
function beginRendering(url) {
    // console.log(url)
    // var url = 'Random_variables.pdf';
    $("#result_block").removeClass("hidden").addClass("show");
    $("#show-chooser").removeClass("hidden").addClass("show");
    $("#get_pdf").removeClass("show").addClass("hidden");
    pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 0.8,
        canvas = document.getElementById('main_canvas'),
        ctx = canvas.getContext('2d');
    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        document.getElementById('page_count').textContent = pdfDoc.numPages;
        renderPage(pageNum);
        loaded = true;
        if (record)
            startrecording()
        gofullscreen();
        pdf = url
    });
}

document.getElementById("pdf").addEventListener('change', function(evt) {
    var files = evt.target.files;
    console.log(files[0].name);
    let reader = new FileReader();
    reader.readAsArrayBuffer(files[0])
    reader.onload = () => beginRendering(reader.result);
})

window.addEventListener('resize', () => {
    queueRenderPage(pageNum);
    if (record)
        startrecording()
})
document.getElementById('mouse').addEventListener('dblclick', gofullscreen)

window.addEventListener('keydown', (e) => {
    if (!loaded)
        return
    if (e.keyCode == 39)
        onNext();
    else if (e.keyCode == 37)
        onPrev()
})

function gofullscreen() {
    fullscr = !fullscr;
    if (fullscr) {
        if (document.fullscreenEnabled) {
            // console.log('yay');
            document.querySelector('main').requestFullscreen();
        }
    } else {
        document.exitFullscreen();
    }
}