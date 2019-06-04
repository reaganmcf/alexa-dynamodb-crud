const Alexa = require('ask-sdk-core');

const API = require('./api');
const Requests = require('./Requests');
const Messages = require('./Messages');
const Intents = require('./Intents');

//Mark: Handlers for Requests
/**
 * Handler for a Launch Request
 */
const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === Requests.LAUNCH_REQUEST;
	},
	handle(handlerInput) {
		const speechText = Messages.WELCOME;

		return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
	}
};

/**
 * Handler for a SessionEnded Request
 */
const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return request.type === Requests.SESSION_ENDED_REQUEST;
	},
	handle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		console.log(`Session ended with reason: ${request.reason}`);
		return handlerInput.responseBuilder.speak('Goodbye!').getResponse();
	}
};

//Mark: Handlers for Custom Intents
/**
 * Handler for the CreateContactIntent
 */
const CreateContactIntent = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return request.type === Requests.INTENT_REQUEST && request.intent.name === Intents.CREATE_CONTACT_INTENT;
	},
	async handle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		const contactSlot = request.intent.slots.Contact;
		let res = await API.createContact(contactSlot.value);
		var speechText = `${res ? 'Successfully' : 'Unsuccessfully'} created Contact ${contactSlot.value}`;
		return handlerInput.responseBuilder.speak(speechText).getResponse();
	}
};

/**
 * Handler for the DeleteContactIntent
 */
const DeleteContactIntent = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return request.type === Requests.INTENT_REQUEST && request.intent.name === Intents.DELETE_CONTACT_INTENT;
	},
	async handle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		const contactSlot = request.intent.slots.Contact;
		let res = await API.deleteContact(contactSlot.value);
		var speechText = `${res ? 'Successfully' : 'Unsuccessfully'} deleted Contact ${contactSlot.value}`;
		return handlerInput.responseBuilder.speak(speechText).getResponse();
	}
};

/**
 * Handler for the UpdateContactIntent
 */
const UpdateContactIntent = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return request.type === Requests.INTENT_REQUEST && request.intent.name === Intents.UPDATE_CONTACT_INTENT;
	},
	async handle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		const contactSlot = request.intent.slots.Contact;
		const phoneNumberSlot = request.intent.slots.PhoneNumber;
		let res = await await API.updateContact(contactSlot.value, phoneNumberSlot.value);
		var speechText = `${res
			? 'Successfully'
			: 'Unsuccessfully'} updated Contact ${contactSlot.value}'s phone number to ${phoneNumberSlot.value}`;
		return handlerInput.responseBuilder.speak(speechText).getResponse();
	}
};

/**
 * Handler for the ReadContactIntent
 */
const ReadContactIntent = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return request.type === Requests.INTENT_REQUEST && request.intent.name === Intents.READ_CONTACT_INTENT;
	},
	async handle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		const contactSlot = request.intent.slots.Contact;
		let res = await API.readContact(contactSlot.value);
		let speechText = '';
		if (res) {
			speechText = `${contactSlot.value}'s phone number is ${res}`;
		} else {
			speechText = `Unsuccessfully read ${contactSlot.value}'s phone number`;
		}
		return handlerInput.responseBuilder.speak(speechText).getResponse();
	}
};

//Mark: Handlers for AMAZON default intents
/**
 * Handler for the AMAZON.HelpIntent
 */
const HelpIntentHandler = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return request.type === Requests.INTENT_REQUEST && request.intent.name === Intents.AMAZON_HELP_INTENT;
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder.speak(Messages.HELP).reprompt(Messages.HELP).getResponse();
	}
};

/**
 * Handler for the AMAZON.StopIntent and AMAZON.CancelIntent
 */
const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return (
			request.type === Requests.INTENT_REQUEST &&
			(request.intent.name === Intents.AMAZON_CANCEL_INTENT || request.intent.name === Intents.AMAZON_STOP_INTENT)
		);
	},
	handle(handlerInput) {
		return handlerInput.responsebuilder.speak(Messages.CANCEL).getResponse();
	}
};

/**
 * Handler for any unexpected errors
 */
const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		console.log(`Error handled: ${error.message}`);
		return handlerInput.responseBuilder.speak(Messages.ERROR).reprompt(Messages.ERROR).getResponse();
	}
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
	.addRequestHandlers(
		LaunchRequestHandler,
		SessionEndedRequestHandler,
		CreateContactIntent,
		DeleteContactIntent,
		UpdateContactIntent,
		ReadContactIntent,
		HelpIntentHandler,
		CancelAndStopIntentHandler
	)
	.addErrorHandlers(ErrorHandler)
	.lambda();
