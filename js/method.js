$(document).ready(function() {
    $('.slider').slider({
        indicators: false,
        full_width: true,
    });
    $('.slider').slider('next');
    $('.slider').slider('pause');
    $(".button-collapse").sideNav({
        menuWidth: 360,
        edge: 'right',
        closeOnClick: true
    });
    $('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    // var id = "#20161011"
    // $(id).ready(function(){
    //     var doc = $(id)
    //     doc.parent().find("img").hide()
    //     doc.get(0).play()
    //     // $(this).parent().find("img").hide()
    // })
    //  $('.carousel.carousel-slider').carousel({full_width: true});
})
