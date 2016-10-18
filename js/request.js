/**
 *
 */
var date,json;

dateSimple = new Date();
window.date = dateSimple.getFullYear() +''+ (dateSimple.getMonth() + 1) +''+ dateSimple.getDate();
window.json = "";
function slides() {
    var target = null;
}

slides.prototype.addChlid = function(data) {
    data = jQuery.parseJSON(data);
    console.log(data);

    this.target.find('li').removeClass('active');
    this.target.append('<li class="active" id="'+data.date+'" style="opacity: 1; transform: translateX(0px) translateY(0px);"></li>');
    var child = this.target.find('#'+data['date']);
    var img = data.date;
    if(data.video != '0'){
        img += "_video_image";
    }
    child.append('<img src="data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" style="background-image: url(./resource/'+img+'.jpg);">');
    child.append('\
    <div class="caption left-align" style="opacity: 0; transform: translateX(-100px) translateY(0px);">\
        <h3>'+data.title+'</h3>\
        <h6 class="light grey-text text-lighten-3">'+data.content+'</h6>\
    </div>');
}
$.ajax({
    url: window.location.href+"/ajax",
    data: "main="+window.date,
}).done(function(data) {
    slide = new slides();
    slide.target = $("#slides");
    slide.addChlid(data);
});
