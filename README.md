# Authy Dashboard Examples
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

NOTE: If you're looking for the webhook examples, you can find the [here](https://github.com/AuthySE/webhooks-api).
