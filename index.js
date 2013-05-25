var cv = require('opencv');
var fs = require('fs');
var path = require('path');

var client, io, lastPng;
var tracking = false;
var debug = true;
var processingImage = false;
var face_cascade = new cv.CascadeClassifier(path.join(__dirname,'node_modules','opencv','data','haarcascade_frontalface_alt2.xml'));

function log(string) {
    if (debug) {
        console.log(string);
    }
}

function detectFaces() { 
    if(tracking && (!processingImage) && lastPng) {
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
            io.sockets.emit('face', { x: face.x, y: face.y, w: face.width, h: face.height, iw: im.width(), ih: im.height() });

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

      }, opts.scale, opts.neighbors
        , opts.min && opts.min[0], opts.min && opts.min[1]);
      
    });
  };
};

function copterface(name, deps) {
    debug = deps.debug || false;
    io = deps.io;
    io.sockets.on('connection', function (socket) {
        socket.on('/copterface', function (cmd) {
            console.log("copterface", cmd);
            if (cmd == "toggle") {
              tracking = tracking ? false : true;
            } 
        });
    });

    client = deps.client;
    client.createPngStream()
      .on('error', console.log)
      .on('data', function(pngBuffer) {
        lastPng = pngBuffer;
    });

    setInterval(detectFaces, 150);
}

module.exports = copterface;
