//Mark: Below are all of the Custom Intents
/**
 * Custom intent. Called when the contact wants to add a new contact
 */
const CREATE_CONTACT_INTENT = 'CreateContactIntent';

/**
 * Custom intent. Called when the contact wants to read a contact's info
 */
const READ_CONTACT_INTENT = 'ReadContactIntent';

/**
 * Custom intent. Called when the contact wants to delete a contact
 */
const DELETE_CONTACT_INTENT = 'DeleteContactIntent';

/**
 * Custom intent. Called when the contact wants to update a contact
 */
const UPDATE_CONTACT_INTENT = 'UpdateContactIntent';

//MARK: Below are all of the default Aamazon.<any> Intents

/**
 * AMAZON intent. Lets the suer cancel a task or completely exit the skill
 */
const AMAZON_CANCEL_INTENT = 'AMAZON.CancelIntent';

/**
 * AMAZON intent. Called when the contact asks for help about the skill
 */
const AMAZON_HELP_INTENT = 'AMAZON.HelpIntent';

/**
 * AMAZON intent. Lets the contact stop an action or completely exit the skill
 */
const AMAZON_STOP_INTENT = 'AMAZON.StopIntent';

/**
 * AMAZON intent. Provides a fallback for contact utterances that do not match any of our skill's intents
 */
const AMAZON_FALLBACK_INTENT = 'AMAZON.FallbackIntent';

module.exports = {
    CREATE_CONTACT_INTENT,
    READ_CONTACT_INTENT,
    DELETE_CONTACT_INTENT,
    UPDATE_CONTACT_INTENT,
    AMAZON_CANCEL_INTENT,
    AMAZON_FALLBACK_INTENT,
    AMAZON_HELP_INTENT,
    AMAZON_STOP_INTENT
};