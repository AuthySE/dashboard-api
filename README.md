# Authy Dashboard and Webhook API Examples
Use this simple NodeJS package to test the [Authy Dashboard API](http://docs.authy.com/dashboard.html).  

Before using this API, you'll need to ask `support@twilio.com` to enable your dashboard keys for Authy.  Send the App Id of the application you want enabled.

In order to setup and test this kind of tooling from your local development, you'll want to use [Ngrok](http://ngrok.io) or something similar.

### Setup
1. Clone this repo
2. `npm install`
3. Browse to the application you want to use in the twilio.com/console where (once enabled) you should now see:
    * App API Key
    * Your Access Key
    * API Signing Key
5. Add the above keys to `demo.env`
6. `source demo.env`
7. Uncomment sections you want to use in `test-dashboard.js`
7. `node test-dashboard.js` to test

### Testing
This Dashboard code allows you to do a few things with the dashboard including:
* Compute HMAC Sig w/ a nonce
* Updates assets (logos)
* Updates colors (just background for this example)
* Gets application UI details
* Updates application details
* Create, List, Delete Webhooks

## Webhooks
You can set a webhook to be called after a publically visible event.  You can create, delete, verify and list current webhooks.  Webhooks use a `POST` when responding.

**Listing Webhooks:**
```javascript
dashboard.listWebhooks();
```
*Response:*
```json
{"webhooks":[{
    "id":"WH_#####-#####",
    "name":"name_of_webhook",
    "account_sid":"AC######",
    "service_id":"###",
    "url":"https://YOUR_SITE/API/WEBHOOK_ENDPOINT",
    "signing_key":"SIGNING_KEY",
    "events":["user_added"]
}]}
```


**Create Webhooks:**
You'll want to select a public event from the list below, set the callback URL for the webhook and lastly name the webhook.
```javascript
var events = ['user_added'];
var callback_url = 'https://YOUR_SITE/API/WEBHOOK_ENDPOINT';
var name = 'user-added-demo';
dashboard.createWebhooks(events, callback_url, name);
```
*Response:*
```json
{"webhook":{
    "id":"WH_#####-#####",
    "name":"user-added",
    "account_sid":"AC######",
    "service_id":"###",
    "url":"https://YOUR_SITE/API/WEBHOOK_ENDPOINT",
    "signing_key":"SIGNING_KEY",
    "events":["user_added"]
},
"message":"Webhook created",
"success":true
}
```
**Deleting a Webhook**
You'll need the unique identifier for your webhook to initate a delete.
```javascript
var webhook_id = "WH_#####-####";
dashboard.deleteWebhook(webhook_id);
```
*Response:*
```
{"message":"Webhook deleted","success":true}
```
**Verify a Webhook**
```javascript
var webhook_signing_key = ''; // unique key associated with a specific webhook
var encoded_message = '';     // this is the message passed from the callback
var decoded = dashboard.verifyJWTResponse(encoded_message, webhook_signing_key);
console.log(util.inspect(decoded, false, null));
```

##### Public Events to Trigger Webhooks
You can trigger webhooks using the following events.  You can use multiple events in a single webhook.

* account_recovery_approved
* account_recovery_canceled
* account_recovery_started
* custom_message_not_allowed
* device_registration_completed
* one_touch_request_responded
* phone_change_canceled
* phone_change_pin_sent
* phone_change_requested
* phone_verification_code_is_invalid
* phone_verification_code_is_valid
* phone_verification_failed
* phone_verification_not_found
* phone_verification_started
* suspended_account
* token_invalid
* token_verified
* too_many_code_verifications
* too_many_phone_verifications
* totp_token_sent
* user_added
* user_phone_changed
* user_removed


