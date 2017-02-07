"use strict";

const language = Homey.manager('i18n').getLanguage();

module.exports.init = function init() {
	Homey.log("Hello world!");
	console.log(language);
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
	var result = null;
	if(speechReg){
		speech.triggers.forEach(trigger => {
			switch (trigger.id){
				case 'calculate':
					options.calculateTrigger = true;
					options.dateTranscript = (options.language === 'en') ? 'calculate' : 'bereken';
					break;
				case 'plus':
					result = parseInt(speechReg[1]) + parseInt(speechReg[2]);
					break;
				case 'minus':
					options.dateTranscript = (options.language === 'en') ? 'minus' : 'min';
					result = parseInt(speechReg[1]) - parseInt(speechReg[2]);
					break;
				case 'times':
					options.dateTranscript = (options.language === 'en') ? 'times' : 'keer';
					result = parseInt(speechReg[1]) * parseInt(speechReg[2]);
				  break;
				case 'divided':
					options.dateTranscript = (options.language === 'en') ? 'divided by' : 'gedeeld door';
					result = parseInt(speechReg[1]) / parseInt(speechReg[2]);
					break;
			}
		});
	}else{
		parseSpeechResponse(speech, null);
	}

	parseSpeechResponse(speech, result, options);
}

function parseSpeechResponse(speech, result, options){
	var repeatText = (language === 'en') ? 'Can you repeat that please' : 'Kun je dat herhalen';
	if(result == null) {
		speech.say(repeatText);
	}else{
		speech.say(result.toString());
	}
}
