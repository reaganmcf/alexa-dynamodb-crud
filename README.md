# How to perform _Create, Read, Update, and Delete_ Operations to an AWS DynamoDB from an Alexa Skill

## Introduction

In the current day and age of software development, almost every application requires some sort of API / database integration. With NoSQL databases being used more and more, being able to send _Create, Read, Update, and Delete_ or _CRUD_ operations to an AWS DynamoDB is a necessary skill to have as a developer. While it seems daunting, DynamoDB is incredibly easy to work with, and this article serves to remove the fear of interacting with DynamoDB in Node.JS.

You can follow along with a [starter project](https://github.com/reaganmcf/alexa-dynamodb-crud-starter) that has all of the basic files setup for you, or skip right ahead to the [finished project](https://github.com/reaganmcf/alexa-dynamodb-crud). If you run into any issues and need help, feel free to [message me on Twitter](https://twitter.com/ReaganMcF1059) and I will be more than happy to help you out!

_Note: I am going to assume you already have `ask-cli` configured and proper IAM permissions. If you do not and need to know how to set this up, follow the **Setup** section of [this other Alexa Skill article I wrote](https://cosmicjs.com/articles/how-to-build-an-alexa-skill-to-add-objects-to-your-bucket-via-voice-jlbar04u)_

## Table Structure and Setup

Here is the structure of my DynamoDB Table. I named mine `alexa-skill-table` and each document, let's call them a `Contact`, is going to be formatted as such: 
```js
{
  "username": "John",
  "phone_number": "1234567890"
}
```

Also, you are going to need to update the `config.js` file located at `lambda/custom/config.js` and replace all the fields to the fields that are associated with your particular `IAM Policy`. 
```js
const config = {
	DYNAMODB_CONFIG_SETTINGS: {
		accessKeyId: 'YOUR_ACCESS_KEY_ID',
		secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
		region: 'YOUR_REGION'
	}
};
```

Finally, before we get started coding, make sure to take a glance over the entire project's files and get a better understanding of the structure. The only files we are going to be changing is `api.js` which will handle all of our _CRUD_ DynamoDB calls and `index.js` which where all of our Intent handlers are located. Let's start off by adding the `createContact` and updating the `CreateContactIntent` handler in `api.js` and `index.js`.

---

## Update `createContact` and `CreateContactIntent`
```js
const createContact = async function(contactName) {
	let params = {
		TableName: 'alexa-skill-table',
		Item: {
			username: { S: contactName },
			phone_number: {S: 'n/a' }
		}
	};
	await dynamodb
		.putItem(params)
		.promise()
		.then((res) => {
			return true;
		})
		.catch((err) => {
			return false;
		});
};
```
Above is what the new `createContact` function should look like, and it is visibly a fairly basic function, as with all of them will be. Every DynamoDB operation consists of this structure with different `params` and different leading method names, in this case `putItem(params)`. You will see that very little changes in each API call because of this, showing how easy and intuitive DynamoDB is! Also, notice how we return a boolean value here as we don't need any information besides the confirmation of whether the operation successfully executed.

Now that we have the API call finished, lets update the corresponding `CreateIntentHandler` in `index.js`.
```js
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
```
The only part of the Intent handler we have to change is the `handle` property, which invokes our `createContact` API call and stores the boolean value of whether it performed the action successfully. Finally, we use string interpolation to either have Alexa say "Unsuccessfully created Contact John" or "Successfully created contact John".

With the basic _Create_ operation successfully added, you can try this for yourself by running `ask deploy` at the project directory and going to the Skill's Developer interface. Go ahead and say **Alexa, Ask Voice Phonebook to add John as a contact** and head over to the DynamoDB table and see the new document!

Now that we have the ability to _Create_ a `Contact`, we are also going to need the ability to _Delete_ a `Contact`, which is done in the next step.

---

## Update `deleteContact` and `DeleteContactIntent`
```js
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
      return true;
    })
    .catch((err) => {
      return false;
    });
};
```
As before, we are going to start off by updating the `deleteContact` function. It looks very similar to the `createContact` function, but `params` has the `Key` property instead and we are calling `deleteItem(params)` not `putItem(params)`. Also, as this operation does not return anything, we only care whether or not the operation was performed successfully, hence why we return a boolean value.

With the API operation finished, let's go ahead and update the `DeleteContactIntent` as well.
```js
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
```
This is practically identical to the `CreateContactIntent`, with just different wording in `speechText`.

Go ahead and re-deploy the skill and ask **Alexa, Ask Voice Phonebook to delete John as a Contact**, and head back to your DynamoDB Interface and see that John was removed successfully.

Things change up here a bit, as we are now going to implement the _Update_ functionality to change the `phone_number` property of a `Contact`.

---

### Update `updateContact` API Handler
```js
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
			return true;
		})
		.catch((err) => {
			return false;
		});
};
```

This time our API handler looks a little different with the `params` object. When updating an entry, we now have to provide the `UpdateExpression`, `ExpressionAttributeValues`, and `ReturnValues` properties when sending our request to our table. Then, we change our table operation to `updateItem(params)` and we are all set. As with the other API calls, we send back a boolean value.

Again, now we have to update the `UpdateContactIntent` to handle our API call.
```js
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
```
We have more code going on here because we have to send the new `phone_number` value to our API call. This should still look familiar though as it is essentially the same code with very few changes. Then, we return a different expression depending on whether or not the database update operation was successfully performed. 

You can re-deploy the skill and watch the database interface to see the John `Contact` get updated when you say **Alexa, Update John to 1235552212**.

Finally, we will implement the _Read_ operation.

---

### Update `readContact` API Handler
```js
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
			return res.Item.phone_number.S;
		})
		.catch((err) => {
			return false;
		});
};
```

This is very similar besides the `getItem(params)` operation as well as what we return. Unlike the other cases, we need to get the `phone_number` property back to the `ReadContactIntent`, so we return `res.Item.phone_number.S` to do so. Now, lets update `ReadContactIntent`.

```js
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
```

As before, very similar to the other Intents, but our `speechText` is very different depending on whether or not the operation is successful. After changing the `ReadContactIntent`, go a head and re-deploy to test it!

## Conclusions
The skill is now finished! Feel free to tinker with the `en-US.json` model to add additional phrases, utterances, and intents that you want to get a better handle behind Alexa Skills.

Now that you have successfully performed _CRUD_ operations to an AWS DynamoDB from an Alexa Skill, the possibilities are endless for other skills you can create, such as the following:
- Multi-player Trivia game with progress tracking
- Decision-based RPG
- Shopping lists
- Many, many more

If you have any questions feel free to [shoot me a message on Twitter](https://twitter.com/ReaganMcF1059) and I will be more than happy to respond you!

If you enjoyed this article, go check out my other articles, such as [How to build an Alexa Skill to add Objects to your Bucket via Voice](https://cosmicjs.com/articles/how-to-build-an-alexa-skill-to-add-objects-to-your-bucket-via-voice-jlbar04u)