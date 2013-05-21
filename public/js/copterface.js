(function (window, undefined) {
    'use strict';

    var CF;

    CF = function CopterFace(cockpit) {
        console.log("Loading Copterface plugin.");

        // Instance variables
        this.cockpit = cockpit;

        // Add required UI elements
        $("#cockpit").append('<canvas id="copterface" width="640" height="360"></canvas>');

        // Bind to navdata events on websockets
        var ah = this;
	this.cockpit.socket.on('face', function(data) {
	    console.log("Found a face: " + data);
        });
    };

    window.Cockpit.plugins.push(CF);

}(window, undefined));
