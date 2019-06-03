const AWS = require('aws-sdk');
const config = require('./config');

AWS.config.update(config.AWS_SETTINGS);
let dynamodb = new AWS.DynamoDB();

/**
 * API Handler for Creating a new Contact Document
 * @param {String} contactName name of the contact being added
 */
const createContact = async function(contactName) {};

/**
 * API Handler for Reading the details of a Contact Document
 * @param {String} contactName name fo the contact's details being read 
 */
const readContact = async function(contactName) {};

/**
 * API Handler for Deleting a Contact Document
 * @param {String} contactName 
 */
const deleteContact = async function(contactName) {};

/**
 * API Handler for updating a Contact Document's Phone Number Property
 * @param {String} contactName 
 * @param {String} updatedNumber 
 */
const updateContact = async function(contactName, updatedNumber) {};

module.exports = {
	createContact,
	readContact,
	deleteContact,
	updateContact
};
