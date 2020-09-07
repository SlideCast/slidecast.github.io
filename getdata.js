var mouse_time = [];
var mouse_x = [];
var mouse_y = [];
var key_l = [];
var key_r = [];

var loaded = false;
document.getElementById("file").addEventListener('change', function(evt) {
    // remove content
    // be sure to show the results
    $("#result_block").removeClass("hidden").addClass("show");

    // Closure to capture the file information.
    function handleFile(f) {

        JSZip.loadAsync(f) // 1) read the Blob
            .then(function(zip) {
                $("#get_sld").removeClass("show").addClass("hidden");
                zip.forEach(function(relativePath, zipEntry) {
                    if (zipEntry.name.indexOf("audio") != -1) {
                        zip.file(zipEntry.name).async("base64").then(function(data) {
                            localStorage.setItem("audio", "data:audio/x-mp3;base64," + data);
                        });
                        loaded = true;
                    }

                    if (zipEntry.name.indexOf("metadata") != -1) {
                        zip.file(zipEntry.name).async("string").then(function(data) {
                            var message = JSON.parse(data);
                            originalheight = message.height;
                            originalwidth = message.width;
                        });
                    }

                    if (zipEntry.name.indexOf("mouse") != -1) {
                        zip.file(zipEntry.name).async("string").then(function(data) {
                            var message = JSON.parse(data);
                            message.forEach(element => {
                                mouse_time.push(element[0]);
                                mouse_x.push(element[1][0]);
                                mouse_y.push(element[1][1]);
                            });
                        });

                    }

                    if (zipEntry.name.indexOf("keyboard") != -1) {
                        zip.file(zipEntry.name).async("string").then(function(data) {
                            var message = JSON.parse(data);
                            message.forEach(element => {
                                if (element[1] == "LEFT")
                                    key_l.push(element[0]);
                                else
                                    key_r.push(element[0]);
                            });
                        });
                    }
                });

            }, function(e) {
                $result.append($("<div>", {
                    "class": "alert alert-danger",
                    text: "Error reading " + f.name + ": " + e.message
                }));
            });
    }

    var files = evt.target.files;
    for (var i = 0; i < files.length; i++) {
        handleFile(files[i]);
        beginRendering(files[i].name);
    }
});