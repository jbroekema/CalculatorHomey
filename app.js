"use strict";

const language = Homey.manager('i18n').getLanguage();

module.exports.init = function init() {
	Homey.log("Hello world!");
	Homey.manager('ledring').animate('loading',
		{
			color: 'purple',
			rpm: 10 // change rotations per minute
		},'INFORMATIVE', 3000,

		// callback
		function( err, success ) {
			if( err ) return Homey.error(err);
			console.log("Animation played succesfully");
		}
	);
	Homey.manager('speech-input').on('speech', listenForSpeechEvents);
}

function listenForSpeechEvents(speech){
		console.log("Incoming speech event..");
		const options = {
				calculateTrigger: false,
				minusTrigger: false,
				plusTrigger: false,
				timesTrigger: false,
				dividedTrigger: false,
				language : language,
				dateTranscript: (language === 'en') ? 'calculate' : 'bereken',
		};

		const timeout = setTimeout(() => {
			options.abort = true;
		}, 10000);

		if(!options.abort) parseSpeechTriggers(speech, options);
}

function parseSpeechTriggers(speech, options){
	const speechText = speech.transcript;
	var speechReg = speechText.match( new RegExp( "(\\d+)\\s\\w+\\s?\\w*\\s(\\d+)" ) );

	speech.triggers.forEach(trigger => {
		switch (trigger.id){
			case 'calculate':
				options.calculateTrigger = true;
				options.dateTranscript = (options.language === 'en') ? 'calculate' : 'bereken';
				break;
			case 'plus':
				options.plusTrigger = true;
				console.log(parseInt(speechReg[1]) + parseInt(speechReg[2]));
				break;
			case 'minus':
				options.minusTrigger = true;
				options.dateTranscript = (options.language === 'en') ? 'minus' : 'min';
				console.log(parseInt(speechReg[1]) - parseInt(speechReg[2]));
				break;
			case 'times':
				options.timesTrigger = true;
				options.dateTranscript = (options.language === 'en') ? 'times' : 'keer';
				console.log(parseInt(speechReg[1]) * parseInt(speechReg[2]));
			  break;
			case 'divided':
				options.dividedTrigger = true;
				options.dateTranscript = (options.language === 'en') ? 'divided by' : 'gedeeld door';
				console.log(parseInt(speechReg[1]) / parseInt(speechReg[2]));
				break;
		}
	});
}
