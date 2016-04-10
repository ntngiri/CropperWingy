// this variable will hold whichever object is currently being dragged
var movingElement;
var i = 1;
// this variable holds the curent mode (0=move, 1=resize, 2=rotate)
var mode = 0;

// these variables stores the old y position of the cursor (it is updated in whileDragging)
var oldY;

// run this code when fully loaded
$(window).load(function() {
    $('#imgUpload').on('click', '.gallImg', function() {
        var appendDem = '<div class="image">' +
            '<img height="100%" width="100%" src='+this.src+' file='+this.file+'>'+
            '<span class="corner TL dspn"></span>' +
            '<span class="corner TR dspn"></span>' +
            '<span class="corner rotator dspn"></span>' +
            '<span class="corner BL dspn"></span>' +
            '<span class="corner BR dspn"></span>' +
            '</div>'
        $('#main').append(appendDem);
    });
    $('html').keyup(function(e) {
        if (e.keyCode == 46) {
            if ($('.selected').length != 0) {
                $('.selected').remove();
            }
        }
    });
    // // attach the mousedown event to all image tags
    // $('#main img').click(selectImage);
    $(".image").mousedown(startDragging);

    // attach the mousemove event to the body
    $("body").mousemove(whileDragging);

    // attach the mouseup event to the body
    $("body").mouseup(doneDragging);


});

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// start dragging will always fire, then while dragging, and finally done dragging on mouse up

function startDragging(e) {
    if ($('.selected').length != 0) {
        $('.selected').removeClass('selected');
    }
    $(this).addClass('selected');

    // set this image as the current one to be dragged
    movingElement = $(this);

    // set the degrees for this object if it isn't already set, to 0
    if (!movingElement[0].degree)
        movingElement[0].degree = 0;

}

function whileDragging(e) {
    if ($(e.target).hasClass('corner')) {
        mode = 1;
        if ($(e.target).hasClass('rotator')) {
            mode = 2;
        }
    }
    if (movingElement == null)
        return false;

    // mode 0, move
    if (mode == 0) {
        // for moving, dragging the image moves it to to the new coordinates

        // offset the new drag coordinates (by half the image height)
        var parentOffset = $(movingElement[0]).parent().offset();
        var newY = e.pageY - parentOffset.top - 50;
        //e.pageY ;
        var newX = e.pageX - parentOffset.left - 50;

        // adjust the x and y values of the currently being dragged image
        movingElement.css({
            "top": newY + "px",
            "left": newX + "px"
        });
    }
    // mode 1, resize
    else if (mode == 1) {
        // for resizing, dragging the image up makes it larger, down makes it smaller

        // to detect if the cursor moved up or down, we need to check if its y value is greater than or less than the y value that it previously held
        if (e.pageY > oldY) {
            // dragged down, make it smaller
            movingElement.css({
                height: '+=10%',
                width: '+=10%'
            })
            var left = $(movingElement).find('.rotator').css('left');
            left.slice(0, -2);
            var a = (parseInt(left) + 5) + 'px';
            $(movingElement).find('.rotator').css({
                'left': a
            });
        } else if (e.pageY < oldY) {
            // dragged up, make it larger
            movingElement.css({
                height: '-=10%',
                width: '-=10%'
            })
            var left = $(movingElement).find('.rotator').css('left');
            left.slice(0, -2);
            var a = (parseInt(left) - 5) + 'px';
            $(movingElement).find('.rotator').css({
                'left': a
            });
        }

        // update old Y for the next call to movingElement
        oldY = e.pageY;
    }
    // mode 2, rotate
    else if (mode == 2) {
        // for rotating, going up rotates counterclockwise, and going down rotates clockise

        if (e.pageY > oldY)
            movingElement[0].degree += 2;

        else if (e.pageY < oldY)
            movingElement[0].degree -= 2;

        // dragged down, make it smaller
        movingElement.css("transform", 'rotate(' + movingElement[0].degree + 'deg)');

        // update old Y for the next call to movingElement
        oldY = e.pageY;
    }
}

function doneDragging(e) {
    mode = 0;
    // unset the image that's being dragged
    movingElement = null;
}


function droppedImage(input, e) {
    im = new Image();
    var dt = input.files[0] || document.Upload.submitfile.files;
    var files = dt;
    if (files) {
        var file = files;
        var reader = new FileReader();

        //attach event handlers here...
        reader.readAsDataURL(file);

        reader.addEventListener('loadend', function(e, file) {

            var bin = this.result;

            var imageDiv = '<div class="image">' +
                '<img height="100%" width="100%" file=' + file + ' src=' + bin + '>' +
                '<span class="corner TL dspn"></span>' +
                '<span class="corner TR dspn"></span>' +
                '<span class="corner rotator dspn" style="top:-50px,left:130px"></span>' +
                '<span class="corner BL dspn"></span>' +
                '<span class="corner BR dspn"></span>' +
                '</div>';

            // var img = document.createElement("img"); 
            var img2 = '<img class="gallImg" width="20%" file=' + file + ' src =' + bin + '>';
            $('#main').append(imageDiv)

            $('#imgUpload').append(img2);
            i = i + 1;
            $('img').attr("draggable", "false");

            // attach the mousedown event to all image tags
            $('.image').mousedown(startDragging);
            mode = 0;

        }.bindToEventHandler(file), false);
    }

    return false;
}

Function.prototype.bindToEventHandler = function bindToEventHandler() {
    var handler = this;
    var boundParameters = Array.prototype.slice.call(arguments);
    //create closure
    return function(e) {
        e = e || window.event; // get window.event if e argument missing (in IE)   
        boundParameters.unshift(e);
        handler.apply(this, boundParameters);
    }
};