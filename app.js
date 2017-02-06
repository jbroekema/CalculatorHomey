"use strict";

function init() {
	
	Homey.log("Hello world!");
	Homey.manager('ledring').animate(
		// animation name (choose from loading, pulse, progress, solid)
		'loading',

		// optional animation-specific options
		{
			color: 'purple',
			rpm: 10 // change rotations per minute
		},

		// priority
		'INFORMATIVE',

		// duration
		30000,

		// callback
		function( err, success ) {
			if( err ) return Homey.error(err);
			console.log("Animation played succesfully");
		}
	);
	Homey.manager('speech-output').say("Hello world");
	Homey.manager('speech-input').on('speech', speech => {
		console.log("Incoming speech event..");
		
		speech.say("Ask me");
	});
	
}

module.exports.init = init;