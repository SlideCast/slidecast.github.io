$(function() {
    $("#slider").slider({
        animate: true,
        range: "min",
        value: 0,
        min: 0,
        max: 100,
        // step: 50,
        slide: function(event, ui) {

        },
        start: function(event, ui) {
            if (play == 1)
                playpause();
        },
        stop: function(event, ui) {
            val = mouse_time[mouse_time.length - 1] * ui.value / 100;
            seeker(val);
        }
    });
});

function showgetsld() {
    $("#get_sld").removeClass("hidden").addClass("show");
    $("#show-chooser").removeClass("show").addClass("hidden");

}