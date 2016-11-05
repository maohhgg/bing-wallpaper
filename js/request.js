/**
 *
 */
var date, json;

dateSimple = new Date();
window.date = dateSimple.getFullYear() + '/' + (dateSimple.getMonth() + 1) + '/' +
        (dateSimple.getDate() < 10 ? 0+""+dateSimple.getDate() : dateSimple.getDate());
window.status = null;
window.error = null;

function slides() {
    var target = null;
}

slide = new slides();
slide.target = $("#slides");

function videoLoop(video) {
    if (video.ended)
        video.play();
}

function ajaxUpdate() {
    var request = null;
}
ajaxUpdate.prototype.ajaxDate = function (date) {
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
};

slides.prototype.addChlid = function(data) {
    data = jQuery.parseJSON(data);
    console.log(data);

    this.target.append('<li id="' + data.date + '" ></li>');

    var child = this.target.find('#' + data.date);
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
slides.prototype.addVideo = function(data) {
    var child = this.target.find('#' + data['date']);

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
}

var controls = {
    showDate: '',
    date: window.date,
    slides: [],
    previousDay: function() {
        if (this.showDate == "") {
            this.showDate = this.date;
            if (this.slides.length == 0) {
                this.slides.push(this.date);
            }
        }

        dateSimple = new Date(new Date(this.showDate) - 24 * 60 * 60 * 1000);
        preDate = dateSimple.getFullYear() + '/' + (dateSimple.getMonth() + 1) + '/' +
                (dateSimple.getDate() < 10 ? 0+""+dateSimple.getDate() : dateSimple.getDate());
        console.log(this.slides);
        console.log(this.slides.includes(preDate.toString()));
        if (!this.slides.includes(preDate.toString())) {
            ajax = new ajaxUpdate();
            ajax.ajaxDate(preDate);
            ajax.request.done(function(data, status) {
                if (status) {
                    slide.addChlid(data);
                    $('.slider').slider('start');
                    $('.slider').slider('next');
                    $('.slider').slider('pause');
                }
            });
            this.slides.push(preDate);
        }
        console.log(ajaxUpdate);
        this.showDate = preDate;

    },
    nextDay: function() {
        if (this.showDate == "") {
            this.showDate = this.date;
            if (this.slides.length == 0) {
                this.slides.push(this.date);
            }
        }
        console.log(this);

        dateSimple = new Date(new Date(this.showDate) + 25 * 60 * 60 * 1000);
        console.log(dateSimple);
        if (dateSimple > new Date(new Date(this.date) + 48 * 60 * 60 * 1000)) {
            Materialize.toast("超出日期范围", 4000);
            return;
        }
        nextDate = dateSimple.getFullYear() + '/' + (dateSimple.getMonth() + 1) + '/' +
                (dateSimple.getDate() < 10 ? 0+""+dateSimple.getDate() : dateSimple.getDate());

        console.log(this.slides);
        console.log(this.slides.includes(nextDate.toString()));
        if (!this.slides.includes(nextDate)) {
            ajax = new ajaxUpdate();
            ajax.ajaxDate(nextDate);
            ajax.request.done(function(data, status) {
                if (status) {
                    slide.addChlid(data);
                    $('.slider').slider('start');
                    $('.slider').slider('prev');
                    $('.slider').slider('pause');
                }
            });
            this.slides.push(nextDate);
        }
        Materialize.toast(nextDate + "执行了", 4000);
        this.showDate = nextDate;
    },
    chooseData: function() {

    },
    downloadImages: function() {

    }
}

ajax = new ajaxUpdate();
ajax.ajaxDate(window.date);
ajax.request.done(function(data,status){
    if (status) {
        slide.addChlid(data);
    }
})
$('.previousDay').get(0).addEventListener('click', function() {
    controls.previousDay();
    console.log(controls);
}, false);
$('.nextDay').get(0).addEventListener('click', function() {
    controls.nextDay();
}, false);
