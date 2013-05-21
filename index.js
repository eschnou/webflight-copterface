var cv = require('opencv');
var fs = require('fs');
var path = require('path');
var arDrone = require('ar-drone');

var client, io;
var lastPng;
var processingImage = false;
var flying = false;
var face_cascade = new cv.CascadeClassifier(path.join(__dirname,'node_modules','opencv','data','haarcascade_frontalface_alt2.xml'));
var startTime = new Date().getTime();

function log(s){
    var time = ( ( new Date().getTime() - startTime ) / 1000 ).toFixed(2);
    console.log(time+" \t"+s);
}   

function detectFaces() { 
    if((!processingImage) && lastPng) {
      processingImage = true;
      cv.readImage( lastPng, function(err, im) {
        var opts = {};
        face_cascade.detectMultiScale(im, function(err, faces) {

          var face;
          var biggestFace;

          for(var k = 0; k < faces.length; k++) {
            face = faces[k];
            if( !biggestFace || biggestFace.width < face.width ) biggestFace = face;
          }

          if( biggestFace ){
            face = biggestFace;
            io.sockets.emit('face', { x: face.x, y: face.y, width: face.width, height: face.height });
            console.log( face.x, face.y, face.width, face.height, im.width(), im.height() );

            face.centerX = face.x + face.width * 0.5;
            face.centerY = face.y + face.height * 0.5;

            var centerX = im.width() * 0.5;
            var centerY = im.height() * 0.5;

            var heightAmount = -( face.centerY - centerY ) / centerY;
            var turnAmount = -( face.centerX - centerX ) / centerX;

            turnAmount = Math.min( 1, turnAmount );
            turnAmount = Math.max( -1, turnAmount );

            log( turnAmount + " " + heightAmount );

            //heightAmount = Math.min( 1, heightAmount );
            //heightAmount = Math.max( -1, heightAmount );
            heightAmount = 0;

            if( Math.abs( turnAmount ) > Math.abs( heightAmount ) ){
              log( "turning "+turnAmount );
              if( turnAmount < 0 ) client.clockwise( Math.abs( turnAmount ) );
              else client.counterClockwise( turnAmount );
              setTimeout(function(){
                  log("stopping turn");
                  client.clockwise(0);
                  //this.stop();
              },100);
            }
            else {
              log( "going vertical "+heightAmount );
              if(  heightAmount < 0 ) client.down( heightAmount );
              else client.up( heightAmount );
              setTimeout(function(){
                log("stopping altitude change");
                
                client.up(0);

              },50);

            }

          }

        processingImage = false;
        //im.save('/tmp/salida.png');

      }, opts.scale, opts.neighbors
        , opts.min && opts.min[0], opts.min && opts.min[1]);
      
    });
  };
};

function copterface(name, deps) {
    io = deps.io;
    client = deps.client;
    client.createPngStream()
      .on('error', console.log)
      .on('data', function(pngBuffer) {
        console.log("got image");
        lastPng = pngBuffer;
    });

    setInterval( detectFaces, 150);
}

module.exports = copterface;
