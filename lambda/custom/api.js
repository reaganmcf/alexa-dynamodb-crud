const AWS = require('aws-sdk');
const config = require('./config');

AWS.config.update(config.AWS_SETTINGS);
let dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

/**
 * API Handler for Creating a new Contact Document
 * @param {String} contactName name of the contact being added
 */
const createContact = async function(contactName) {
	let params = {
		TableName: 'alexa-skill-table',
		Item: {
			username: { S: contactName },
			phone_number: { S: 'n/a' }
		}
	};
	return await dynamodb
		.putItem(params)
		.promise()
		.then((res) => {
			console.log(res);
			return true;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

/**
 * API Handler for Reading the details of a Contact Document
 * @param {String} contactName name fo the contact's details being read 
 */
const readContact = async function(contactName) {
	let params = {
		TableName: 'alexa-skill-table',
		Key: {
			username: { S: contactName }
		}
	};
	return await dynamodb
		.getItem(params)
		.promise()
		.then((res) => {
			console.log(res);
			return res.Item.phone_number.S;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

/**
 * API Handler for Deleting a Contact Document
 * @param {String} contactName 
 */
const deleteContact = async function(contactName) {
	let params = {
		TableName: 'alexa-skill-table',
		Key: {
			username: { S: contactName }
		}
	};
	return await dynamodb
		.deleteItem(params)
		.promise()
		.then((res) => {
			console.log(res);
			return true;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

/**
 * API Handler for updating a Contact Document's Phone Number Property
 * @param {String} contactName 
 * @param {String} updatedNumber 
 */
const updateContact = async function(contactName, updatedNumber) {
	let params = {
		TableName: 'alexa-skill-table',
		Key: {
			username: { S: contactName }
		},
		UpdateExpression: 'set phone_number = :n',
		ExpressionAttributeValues: {
			':n': { S: updatedNumber }
		},
		ReturnValues: 'UPDATED_NEW'
	};

	return await dynamodb
		.updateItem(params)
		.promise()
		.then((res) => {
			console.log(res);
			return true;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

module.exports = {
	createContact,
	readContact,
	deleteContact,
	updateContact
};
