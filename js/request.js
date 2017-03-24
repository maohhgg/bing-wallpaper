/**
 *
 */
var date, json;

dateSimple = new Date();
window.date = dateSimple.getFullYear() + '/' +
        ((dateSimple.getMonth() + 1) < 10 ? (0+""+(dateSimple.getMonth() + 1)) : (dateSimple.getMonth() + 1)) + '/' +
        (dateSimple.getDate() < 10 ? 0+""+dateSimple.getDate() : dateSimple.getDate());
window.status = null;
window.error = null;

var slides = function(node) {
    var target = node;
    return{
        addVideo : function (data) {
            var child = target.find('#' + data['date']);

            child.append('<video class="responsive-video" id="video' + data.date + '" style="display:none" controls loop="loop">\
                    <source src="resource/' + data.date + '_video.mp4" type="video/mp4">\
                </video>');

            var video = child.find("#video" + data.date);
            video.ready(function() {
                video.show();
                child.find('img').hide();
                video = video.get(0);
                video.play();
            }(video, child));
        },
        addChlid : function(data) {
            data = jQuery.parseJSON(data);
            console.log(data);

            target.append('<li id="' + data.date + '" ></li>');

            var child = target.find('#' + data.date);
            var img = data.date;
            if (data.video != '0')
                img += "_video_image";

            child.append('<img src=" ./resource/' + img + '.jpg" >');
            var align = ["left", "right", "center"];
            child.append('\
            <div class="caption ' + align[parseInt(Math.random() * 3)] + '-align" >\
                <h3>' + data.title + '</h3>\
                <h6 class="light grey-text text-lighten-3">' + data.content + '</h6>\
            </div>');

            $('.slider').slider({
                indicators: false,
            });
            $('.slider').slider('pause');
            if (data.video != '0')
                this.addVideo(data);
        }
    }
}

slide = new slides($("#slides"));

var Ajax = function (date) {
    this.request = $.ajax({
           url: window.location.href + "ajax",
           data: "main=" + date.replace(/\//g, ""),
           statusCode: {
               200: function() {
                   window.status = 200;
               },
               404: function() {
                   window.status = 404;
               },
               405: function() {
                   window.status = 405;
               },
           }
       });
}


var Controls = function(num){
    var showDate ='';
    var date = num;
    var slides = [];
    return {
        previousDay: function() {
            if (showDate == "") {
                showDate = date;
                if (slides.length == 0) {
                    slides.push(this.date);
                }
            }

            var dateSimple = new Date(new Date(showDate) - 24 * 60 * 60 * 1000);
            var preDate = dateSimple.getFullYear() + '/' +
                    ((dateSimple.getMonth() + 1) < 10 ? (0+""+(dateSimple.getMonth() + 1)) : (dateSimple.getMonth() + 1)) + '/' +
                    (dateSimple.getDate() < 10 ? 0+""+dateSimple.getDate() : dateSimple.getDate());
            console.log(preDate);
            console.log(slides.includes(preDate.toString()));
            if (!slides.includes(preDate.toString())) {
                var ajax = new Ajax(preDate.toString());
                ajax.request.done(function(data, status) {
                    if (status) {
                        slide.addChlid(data);
                        $('.slider').slider('start');
                        $('.slider').slider('next');
                        $('.slider').slider('pause');
                    }
                });
                slides.push(preDate);
            } else {
                $('.slider').slider('start');
                $('.slider').slider('next');
                $('.slider').slider('pause');
            }
            showDate = preDate;
        },
        nextDay: function() {
            if (showDate == "") {
                showDate = date;
                if (slides.length == 0) {
                    slides.push(date);
                }
            }

            var dateSimple = new Date(new Date(showDate) + 48 * 60 * 60 * 1000);
            console.log(dateSimple);
            if (dateSimple > new Date(new Date(date) + 48 * 60 * 60 * 1000)) {
                Materialize.toast("超出日期范围", 4000);
                return;
            }
            var nextDate = dateSimple.getFullYear() + '/' +
                    ((dateSimple.getMonth() + 1) < 10 ? (0+""+(dateSimple.getMonth() + 1)) : (dateSimple.getMonth() + 1)) + '/' +
                    (dateSimple.getDate() < 10 ? 0+""+dateSimple.getDate() : dateSimple.getDate());
            console.log(nextDate);
            console.log(nextDate.toString());
            console.log(slides.includes(nextDate.toString()));
            if (!slides.includes(nextDate.toString())) {
                var ajax = new Ajax(nextDate.toString());
                ajax.request.done(function(data, status) {
                    if (status) {
                        slide.addChlid(data);
                        $('.slider').slider('start');
                        $('.slider').slider('prev');
                        $('.slider').slider('pause');
                    }
                });
                slides.push(nextDate);
            } else {
                $('.slider').slider('start');
                $('.slider').slider('prev');
                $('.slider').slider('pause');
            }
            Materialize.toast(nextDate + "执行了", 4000);
            this.showDate = nextDate;
        },
        chooseData: function() {

        },
        downloadImages: function() {

        }
    }

}
var ajax = new Ajax(window.date);
console.log(ajax);
ajax.request.done(function(data,status){
    if (status) {
        slide.addChlid(data);
    }
})
var controls = new Controls(window.date)
$('.previousDay').get(0).addEventListener('click', function() {
    controls.previousDay();
    console.log(controls);
}, false);
$('.nextDay').get(0).addEventListener('click', function() {
    controls.nextDay();
}, false);
