/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
var pdfDoc = null;
var canvasWidth = 1;
var canvasHeight = 1;
var fullscr = false;

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
        btnHeight.subs
        canvasHeight -= parseFloat(btnHeight.substr(0, btnHeight.length - 2))
        var viewport_old = page.getViewport({ scale: 1 });
        if (canvasHeight * viewport_old.width > viewport_old.height * canvasWidth) {
            canvasHeight = viewport_old.height * canvasWidth / viewport_old.width;
        } else
            canvasWidth = viewport_old.width * canvasHeight / viewport_old.height;
        var ratio = canvasWidth / viewport_old.width;
        var viewport = page.getViewport({ scale: ratio });
        document.getElementById('mouse').width = canvasWidth.toString() + 'px';
        document.getElementById('mouse').height = canvasHeight.toString() + 'px';
        document.getElementById('mouse').style.width = canvasWidth.toString() + 'px';
        document.getElementById('mouse').style.height = canvasHeight.toString() + 'px';
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;
        resizeCanvas(canvasWidth, canvasHeight);

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
document.getElementById('prev').addEventListener('click', onPrevPage);

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
document.getElementById('next').addEventListener('click', onNextPage);

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

    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {

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
            console.log('yay');
            document.querySelector('main').requestFullscreen();
        }
    } else {
        document.exitFullscreen();
    }
})