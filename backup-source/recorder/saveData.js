function getSLD(mouse, keyboard, pdf, audio) {
    console.log(mouse)
    console.log(pdf)
    console.log(keyboard)
    console.log(audio)
    var zip = new JSZip();
    zip.file("mouse.json", mouse);
    zip.file("keyboard.json", keyboard);
    zip.file("slides.pdf", pdf);
    zip.file("mouse.json", mouse);
    zip.file("audio.mp3", audio)
    zip.file("metadata", JSON.stringify({ "width": canvasWidth, "height": canvasHeight }))
    zip.generateAsync({ type: "blob" })
        .then(function(content) {
            // see FileSaver.js
            saveAs(content, cur_time.toString() + ".zip");
        });
}