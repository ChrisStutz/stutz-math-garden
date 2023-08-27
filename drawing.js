const BACKGROUND_COLOR = '#000000';
const LINE_COLOR = '#FFFFFF';
const LINE_WIDTH = 15
var current_Y = 0;
var current_X = 0;
var previous_Y = 0;
var previous_X = 0;
var canvas;
var context;

function prepareCanvas() {
    // console.log('preparing canvas');
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');

    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.strokeStyle = LINE_COLOR;
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round';

    var isPainting = false;

    canvas.addEventListener(type = 'touchstart', function (event) {
        current_X = event.touches[0].pageX - canvas.offsetLeft;
        current_Y = event.touches[0].pageY - canvas.offsetTop;
        isPainting = true;

    });   

    document.addEventListener(type = 'mousedown', function (event) {
        current_X = event.pageX - canvas.offsetLeft;
        current_Y = event.pageY - canvas.offsetTop;
        isPainting = true;

    });
    document.addEventListener(type = 'mouseup', function (event) {
        current_X = event.pageX - canvas.offsetLeft;
        current_Y = event.pageY - canvas.offsetTop;
        isPainting = false;
    });

    document.addEventListener(type = 'touchend', function (event) {
        current_X = event.touches[0].pageX - canvas.offsetLeft;
        current_Y = event.touches[0].pageY - canvas.offsetTop;
        isPainting = false;

    });

    document.addEventListener(type = 'mousemove', function (event) {

        if (isPainting) {
            previous_X = current_X;
            current_X = event.pageX - canvas.offsetLeft;
            previous_Y = current_Y;
            current_Y = event.pageY - canvas.offsetTop;


            draw();
        }
    });

    document.addEventListener(type = 'touchmove', function (event) {

        if (isPainting) {
            previous_X = current_X;
            current_X = event.touches[0].pageX - canvas.offsetLeft;
            previous_Y = current_Y;
            current_Y = event.touches[0].pageY - canvas.offsetTop;


            draw();
        }
    });

    canvas.addEventListener(type = 'mouseleave', function (event) {
        isPainting = false;
    });

    canvas.addEventListener(type = 'touchcancel', function (event) {
        isPainting = false;
    });
};

function draw() {
    context.beginPath();
    context.moveTo(previous_X, previous_Y);
    context.lineTo(current_X, current_Y);
    context.closePath();
    context.stroke();
}

function clearCanvas() {
    currentX = 0;
    currentY = 0;
    previousX = 0;
    previousY = 0;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

}