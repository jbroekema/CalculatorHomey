"use strict";

const language = Homey.manager('i18n').getLanguage();

module.exports.init = function init() {

	Homey.manager('speech-input').on('speech', listenForSpeechEvents);

	Homey.manager('flow').on('action.addition', function(callback, args){
		var numberOne = args.numberone;
		var numberTwo = args.numbertwo;
		var result = numberOne + numberTwo;
		callback( null, true );
		Homey.manager('speech-output').say(result.toString());
	});

	Homey.manager('flow').on('action.subtraction', function(callback, args){
		var numberOne = args.numberone;
		var numberTwo = args.numbertwo;
		var result = numberOne - numberTwo;
		callback( null, true );
		Homey.manager('speech-output').say(result.toString());
	});

	Homey.manager('flow').on('action.multiplication', function(callback, args){
		var numberOne = args.numberone;
		var numberTwo = args.numbertwo;
		var result = numberOne * numberTwo;
		callback( null, true );
		Homey.manager('speech-output').say(result.toString());
	});

	Homey.manager('flow').on('action.division', function(callback, args){
		var numberOne = args.numberone;
		var numberTwo = args.numbertwo;
		var result = numberOne / numberTwo;
		callback( null, true );
		Homey.manager('speech-output').say(result.toString());
	});
}

function listenForSpeechEvents(speech){
		console.log("Incoming speech event..");
		const options = {
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

	if(speechReg){ // did we find a match?
        speech.triggers.forEach(function (trigger){
			switch (trigger.id){
				case 'plus':
					result = parseInt(speechReg[1]) + parseInt(speechReg[2]);
					break;
				case 'minus':
					result = parseInt(speechReg[1]) - parseInt(speechReg[2]);
					break;
				case 'times':
					result = parseInt(speechReg[1]) * parseInt(speechReg[2]);
				  break;
				case 'divided':
					result = parseInt(speechReg[1]) / parseInt(speechReg[2]);
					break;
			}
		});
	}
	parseSpeechResponse(speech, result, options);
}

function parseSpeechResponse(speech, result, options){
	console.log("Creating response..");
	var repeatText = (language === 'en') ? 'Can you repeat that please' : 'Kun je dat herhalen';
	if(result == null) {
		speech.say(repeatText);
	}else{
		speech.say(result.toString());
	}
}
