/**
 *
 */
var date, json;

dateSimple = new Date();
window.date = dateSimple.getFullYear() + '/' + (dateSimple.getMonth() + 1) + '/' + dateSimple.getDate();
window.status = null;
window.error = null;

function slides() {
    var target = null;
}

function videoLoop(video) {
    if (video.ended)
        video.play();
}

function ajaxUpdate(date,callback) {
    var request = $.ajax({
        url: window.location.href + "/ajax",
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
    request.done(function(data, status) {
        if (status) {
            slide = new slides();
            slide.target = $("#slides");
            slide.addChlid(data);
        }
    });
    request.fail(function(error) {
        window.error = error;
        console.log(window.error);
        Materialize.toast(error, 4000)
    });
}

slides.prototype.addChlid = function(data) {
    data = jQuery.parseJSON(data);
    console.log(data);

    this.target.append('<li id="' + data.date +'" ></li>');

    var child = this.target.find('#' + data.date);
    var img = data.date;

    if (data.video != '0')
        img += "_video_image";

    child.append('<img src=" ./resource/' + img + '.jpg" >');
    child.append('\
    <div class="caption left-align" >\
        <h3>' + data.title + '</h3>\
        <h6 class="light grey-text text-lighten-3">' + data.content + '</h6>\
    </div>');

    $('.slider').slider();
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
        if (this.showDate == ""){
            this.showDate = this.date;
            if (this.slides.length == 0) {
                this.slides.push(this.date);
            }
        }

        dateSimple = new Date(new Date(this.showDate) - 24 * 60 * 60 * 1000);
        preDate = dateSimple.getFullYear() + '/' + (dateSimple.getMonth() + 1) + '/' + dateSimple.getDate();

        if (!this.slides.includes(preDate.toString())){
            ajaxUpdate(preDate);
            this.slides.push(preDate);
        }
        this.showDate = preDate;
        $('.slider').slider('start');
        $('.slider').slider('next');
        $('.slider').slider('pause');
    },
    nextDay: function() {
        if (this.showDate == ""){
            this.showDate = this.date;
            if (this.slides.length == 0) {
                this.slides.push(this.date);
            }
        }

        dateSimple = new Date(new Date(this.showDate) + 24 * 60 * 60 * 1000);
        nextDate = dateSimple.getFullYear() + '/' + (dateSimple.getMonth() + 1) + '/' + dateSimple.getDate();
        if (dateSimple == new Date(new Date(this.date) + 24 * 60 * 60 * 1000)) {
            Materialize.toast("超出日期范围", 4000);
            return ;
        }
        console.log(nextDate);
        console.log(this.slides.includes(nextDate.toString()));
        if (!this.slides.includes(nextDate)){
            ajaxUpdate(nextDate);
            this.slides.push(nextDate);

        }
        Materialize.toast(nextDate+"执行了", 4000);
        this.showDate = nextDate;
        $('.slider').slider('start');
        $('.slider').slider('prev');
        $('.slider').slider('pause');
    },
    chooseData: function() {

    },
    downloadImages: function() {

    }
}

ajaxUpdate(window.date);

$('.previousDay').get(0).addEventListener('click', function() {
    controls.previousDay();
    console.log(controls);
}, false);
$('.nextDay').get(0).addEventListener('click', function() {
    controls.nextDay();
}, false);
