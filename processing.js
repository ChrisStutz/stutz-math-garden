let cv = window.cv;
var model;

async function loadModel(){
    model = await tf.loadGraphModel('TFJS/model.json');
    
}

function predictImage(){
    console.log('processing...');
    let image = cv.imread(canvas);
   
   //chaning to black and white and increasing threshold
    cv.cvtColor(image,image,cv.COLOR_RGBA2GRAY,0);
    cv.threshold(image,image,175,255,cv.THRESH_BINARY);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    
    // finding contours
    cv.findContours(image,contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    image = image.roi(rect);
    // Resizing image
    var height =  image.rows;
    var width = image.cols;
    if (height>width){
        height=20;
        const scaleFactor = image.rows/height;
        width = Math.round(image.cols/scaleFactor);
        }
    else {
        width = 20;
        scaleFactor = image.cols/width;
        height = Math.round(image.rows/scaleFactor);
        } 
    let newsize = new cv.Size(width,height);
    cv.resize(image,image,newsize,0,0,interpolation=cv.INTER_AREA);

    //creating padding for image
    const LEFT = Math.ceil(4 + (20-width)/2);
    const RIGHT = Math.floor(4 + (20-width)/2);
    const TOP = Math.ceil(4 + (20-height)/2);
    const BOTTOM = Math.floor(4 + (20-height)/2);
    // console.log(`top: ${TOP} bottom: ${BOTTOM} Right: ${RIGHT} Left: ${RIGHT}`);

    const BLACK = new cv.Scalar(0,0,0,0);
    cv.copyMakeBorder( image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK );
    
    //finding center of mass
    cv.findContours(image,contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt= contours.get(0);
    const Moments = cv.moments(cnt,false);
    const cX = Moments.m10/Moments.m00;
    const cY = Moments.m01/Moments.m00;
    // console.log(`m00 = ${Moments.m00} m10 = ${Moments.m10} m01 = ${Moments.m01}`);

    // shifting image
    const Xshift = Math.round(image.cols/2.0-cX);
    const Yshift = Math.round(image.rows/2.0-cY);
    newsize = new cv.Size(image.cols,image.rows);
    M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, Xshift, 0, 1, Yshift]);
    cv.warpAffine(image,image,M,newsize,cv.INTER_LINEAR,cv.BORDER_CONSTANT,BLACK);

    //normalizing image
    pixelValues = image.data;
    pixelValues = Float32Array.from(pixelValues);
    pixelValues = pixelValues.map(function(item) {
        return item/255.0;
    });

    //Creating Tensor
    const X = tf.tensor([pixelValues]);
    const result = model.predict(X);
    console.log(`prediction: ${result}`);

    const output = result.dataSync()[0];

    image.delete();
    contours.delete();
    hierarchy.delete();
    cnt.delete();
    M.delete();
    result.dispose();
    X.dispose();

    return output;
    }
