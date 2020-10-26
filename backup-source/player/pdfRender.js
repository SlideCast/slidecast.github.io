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
        btnHeight += getComputedStyle(document.getElementById("slider-container")).getPropertyValue("height")
            // btnHeight.subs
        canvasHeight -= parseFloat(btnHeight.substr(0, btnHeight.length - 2))
        var viewport_old = page.getViewport({ scale: 1 });
        if (canvasHeight * originalwidth > originalheight * canvasWidth) {
            canvasHeight = originalheight * canvasWidth / originalwidth;
        } else
            canvasWidth = originalwidth * canvasHeight / originalheight;
        document.getElementById('mouse').width = canvasWidth.toString() + 'px';
        document.getElementById('mouse').height = canvasHeight.toString() + 'px';
        document.getElementById('mouse').style.width = canvasWidth.toString() + 'px';
        document.getElementById('mouse').style.height = canvasHeight.toString() + 'px';
        document.getElementById('slider-container').style.width = canvasWidth.toString() + 'px';
        document.getElementById('play-buttons').style.width = canvasWidth.toString() + 'px';
        resizeCanvas(canvasWidth, canvasHeight);
        var ratio = min(canvasWidth / viewport_old.width, canvasHeight / viewport_old.height);
        var viewport = page.getViewport({ scale: ratio });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
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
        return;
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
    queueRenderPage(pageNum);
}

function onPrev() {
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
    queueRenderPage(pageNum);
}

function onNext() {
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
    // var url = 'Random_variables.pdf';
    pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 0.8,
        canvas = document.getElementById('main_canvas'),
        ctx = canvas.getContext('2d');
    console.log(canvas)
    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
        pageNum = 1;
        console.log(pdfDoc_)
        console.log('asd')
        pdfDoc = pdfDoc_;
        document.getElementById('page_count').textContent = pdfDoc.numPages;

        // Initial/first page rendering
        renderPage(pageNum);
    });
}

// document.getElementById("pdf").addEventListener('change', function(evt) {
//     var files = evt.target.files;
//     console.log(files[0].name);
//     beginRendering(files[0].name);
// })

window.addEventListener('resize', () => queueRenderPage(pageNum))
document.getElementById('mouse').addEventListener('dblclick', () => {
    fullscr = !fullscr;
    if (fullscr) {
        if (document.fullscreenEnabled) {
            // console.log('yay');
            document.querySelector('main').requestFullscreen();
        }
    } else {
        document.exitFullscreen();
    }
})