"use strict";

const language = Homey.manager('i18n').getLanguage();

module.exports.init = function init() {

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

		const options = {
				calculateTrigger: false,
				minusTrigger: false,
				plusTrigger: false,
				timesTrigger: false,
				dividedTrigger: false,
				language : language,
				dateTranscript: (language === 'en') ? 'calculate' : 'bereken',
		},

		const timeout = setTimeout(() => {
			options.abort = true;
		}, 10000);

		if(!abort) parseSpeechTriggers(speech, options);

		//speech.say("Ask me");
	});

}

function parseSpeechTriggers(speech, options){

	speech.triggers.forEach(trigger = > {
		switch (trigger.id){
			case 'calculate':
				options.calculateTrigger = true;
				break;
			case 'plus':
				options.plusTrigger = true;
				break;
			case 'minus':
				options.minusTrigger = true;
				break;
			case 'times':
				options.timesTrigger = true;
			  break;
			case 'divided':
				options.dividedTrigger = true;
				break;
		}
	});
}
