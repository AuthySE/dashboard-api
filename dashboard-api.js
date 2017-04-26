const qs = require('qs');
const crypto = require('crypto');
const exec = require('child_process').exec;
const n = require('nonce')();
const jwt = require('jsonwebtoken');

module.exports = function (app_api_key, access_key, signing_key, options) {
    if (!app_api_key || !access_key || !signing_key) {
        return false;
    } else {
        return new AuthyDashboard(app_api_key, access_key, signing_key, options);
    }
};


function AuthyDashboard(app_api_key, access_key, signing_key, options) {
    this.DEBUG = options.DEBUG || false;
    this.PROD = options.PROD || true;
    this.api_url = options.API_URL;
    this.app_api_key = app_api_key;
    this.access_key = access_key;
    this.signing_key = signing_key;

    // you need to make a request from dev to get this key
    this.integration_key;

    this.nonce = options.PROD ? n() + "." + n() : 123;
    this.computed_sig;

    // contact info
    this.country_code;
    this.email;
    this.phone;
}


/**
 * Sort by property only.
 *  Normal JS sort parses the entire string so a stringified array value like 'events=zzzz'
 *  would be moved after 'events=aaaa'.
 *
 *  Instead we split tokenize the string around the '=' value and only sort alphabetically
 *  by the property.
 *
 * @param {string} x
 * @param {string} y
 * @returns {number}
 */
function sortByPropertyOnly(x, y) {
    var xx = x.split("=");
    var yy = y.split("=");

    if (xx < yy) {
        return -1;
    }
    if (xx > yy) {
        return 1;
    }
    return 0;
}


AuthyDashboard.prototype = {
    /**
     *
     * @param {!string} url
     * @param {!string} method   POST || GET
     * @param {Object=} params  Any additional params.
     */
    computeSig: function (url, method, params) {
        var allParams = {
            app_api_key: this.app_api_key,
            access_key: this.access_key
        };

        // add any additional params
        for (var key in params) {
            allParams[key] = params[key];
        }

        if (this.DEBUG) console.log("Params:\n", allParams);

        var sorted_params = qs.stringify(allParams, {arrayFormat: 'brackets'}).split("&").sort(sortByPropertyOnly).join("&").replace(/%20/g, '+');

        if (this.DEBUG) console.log("Sorted: \n", sorted_params);

        var dataToSign = this.nonce + "|" + method + "|" + url + "|" + sorted_params;

        this.computed_sig = crypto.createHmac('sha256', this.signing_key).update(dataToSign).digest('base64');


        if (this.DEBUG) {
            console.log("Nonce:\n", this.nonce);
            console.log("Signature:\n", this.computed_sig);
        }
    },

    /**
     * Call the CURL command
     * @param curl
     */
    callCurl: function (curl) {
        if (this.DEBUG) {
            console.log("cURL call:\n", curl);
        }

        console.log("CURL COMMAND:");
        console.log(curl);

        exec(curl, (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}\n`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    },

    /**
     * Update both main and sidebar logos.
     */
    updateAssets: function () {

        var url = this.api_url + "/dashboard/json/application/assets/update";
        var method = "POST";

        this.computeSig(url, method);

        var curl = 'curl -H "X-Authy-Signature: ' + this.computed_sig + '"'
            + ' -H "X-Authy-Signature-Nonce: ' + this.nonce + '"'
            + ' -F app_api_key="' + this.app_api_key + '"'
            + ' -F access_key="' + this.access_key + '"'
            + ' -F main_logo="@./main.png;type=image/png" '
            + ' -F sidebar_logo="@./sidebar_logo.png;type=image/png" '
            + '"' + url + '"';

        this.callCurl(curl);
    },

    /**
     * Testing to see what happens when
     *   1) a JPG is uploaded
     *   2) an oversize file is uploaded
     */
    updateJPGAssets: function () {

        var url = this.api_url + "/dashboard/json/application/assets/update";
        var method = "POST";

        this.computeSig(url, method);

        var curl = 'curl -H "X-Authy-Signature: ' + this.computed_sig + '"'
            + ' -H "X-Authy-Signature-Nonce: ' + this.nonce + '"'
            + ' -F app_api_key="' + this.app_api_key + '"'
            + ' -F access_key="' + this.access_key + '"'
            + ' -F main_logo="@./main.png;type=image/png" '
            + ' -F sidebar_logo="@./big.png;type=image/png" '
            + '"' + url + '"';

        this.callCurl(curl);
    },

    /**
     * Example updating the background color
     *
     * @param {!string=} hexColor  #ff0000
     */
    updateColors: function (hexColor) {

        var url = this.api_url + "/dashboard/json/application/ui_settings/update";
        var method = "POST";
        var color = hexColor || '#ff0000';

        this.computeSig(url, method, {background_color: color});

        var curl = 'curl -H "X-Authy-Signature: ' + this.computed_sig + '"'
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' -d app_api_key="' + this.app_api_key + '"'
            + ' -d access_key="' + this.access_key + '"'
            + ' -d background_color="' + color + '" '
            + '"' + url + '"';

        this.callCurl(curl);
    },

    getApplicationUIDetails: function () {
        var url = this.api_url + "/dashboard/json/application/ui_settings";
        var method = "GET";
        this.computeSig(url, method);

        var curl = 'curl -H "X-Authy-Signature: ' + this.computed_sig + '"'
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' "' + url + "?app_api_key=" + this.app_api_key + "&access_key=" + this.access_key + '"';

        this.callCurl(curl);
    },

    getApplicationDetails: function () {
        var url = this.api_url + "/dashboard/json/application/details";
        var method = "GET";
        this.computeSig(url, method);

        var curl = 'curl -H "X-Authy-Signature: ' + this.computed_sig + '"'
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' "' + url + "?app_api_key=" + this.app_api_key + "&access_key=" + this.access_key + '"';

        this.callCurl(curl);
    },

    /**
     * Update application details.  In this example, we are only updating the app name.
     * @param {String=} optionalName
     */
    updateAppDetails: function (optionalName) {
        var name = optionalName || "Change the name Meow!";

        var url = this.api_url + "/dashboard/json/application/update";
        var method = "POST";
        this.computeSig(url, method, {name: name});

        var curl = 'curl -H "X-Authy-Signature: ' + this.computed_sig + '"'
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' -d app_api_key="' + this.app_api_key + '"'
            + ' -d access_key="' + this.access_key + '"'
            + ' -d name="' + name + '"'
            + ' "' + url + '"';

        this.callCurl(curl);
    },

    /**
     *
     * @param {!string} name
     */
    createDashboardApplication: function (name) {
        var appName = name || "My new App Name";

        var url = this.api_url + "/dashboard/json/applications";
        var method = "POST";

        var curl = 'curl -d name="' + appName + '"'
            + ' -d phone_number="' + this.phone + '"'
            + ' -d country_code="' + this.country_code + '"'
            + ' -d email="' + this.email + '"'
            + ' -d integration_api_key="' + this.integration_key + '"'
            + ' "' + url + '"';

        this.callCurl(curl);
    },

    /**
     * Documentation is incorrect.  This is a GET, not a POST request.
     */
    getApplicationLogos: function () {
        var url = this.api_url + "/dashboard/json/application/assets";
        var method = "GET";

        var params = {
            app_api_key: this.app_api_key,
            access_key: this.access_key
        };

        this.computeSig(url, method, params);

        var curl = 'curl -H "X-Authy-Signature: ' + this.computed_sig + '"'
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' "' + url + "?app_api_key=" + this.app_api_key + '&access_key=' + this.access_key + '"';

        this.callCurl(curl);

    },

    listUsers: function () {
        var url = this.api_url + "/dashboard/json/application/users";
        var method = "GET";

        this.computeSig(url, method);
        var curl = 'curl -H "X-Authy-Signature: ' + this.computed_sig + '"'
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' "' + url + "?app_api_key=" + this.app_api_key + '&access_key=' + this.access_key + '"';

        this.callCurl(curl);

    },

    deleteWebhook: function (id) {
        if (!id) {
            console.log('webhook id required');
            return false;
        }
        var url = this.api_url + "/dashboard/json/application/webhooks";
        var method = "DELETE";

        // extra params for sig computation
        var params = {
            "webhook_id": id
        };

        this.computeSig(url, method, params);
        var curl = 'curl -X DELETE ' + url
            + ' -d webhook_id="' + id + '"'
            + ' -d app_api_key=' + this.app_api_key
            + ' -d access_key=' + this.access_key
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' -H "X-Authy-Signature: ' + this.computed_sig + '"';

        this.callCurl(curl);

    },

    listWebhooks: function () {
        var url = this.api_url + "/dashboard/json/application/webhooks";
        var method = "GET";

        this.computeSig(url, method);
        var curl = 'curl -X GET ' + url
            + ' -d app_api_key=' + this.app_api_key
            + ' -d access_key=' + this.access_key
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' -H "X-Authy-Signature: ' + this.computed_sig + '"';

        this.callCurl(curl);
    },

    /**
     * {Array.<strings>} events
     */
    createWebhooks: function (events, callback_url, name) {
        var url = this.api_url + "/dashboard/json/application/webhooks";
        var method = "POST";


        if (events.length < 1 || !callback_url || !name) {
            console.log('no events or no callback or webhook name');
            return false;
        }
        var webhook_events = '';

        for (var i = 0; i < events.length; i++) {
            webhook_events += ' -d events[]="' + events[i] + '" '
        }

        // extra params for sig computation
        var params = {
            app_api_key: this.app_api_key,
            access_key: this.access_key,
            url: callback_url,
            events: events,
            name: name
        };

        this.computeSig(url, method, params);

        var curl = 'curl -X POST ' + url
            + ' -d url="' + callback_url + '"'
            + ' -d name="' + name + '"'
            + webhook_events
            + ' -d app_api_key="' + this.app_api_key + '"'
            + ' -d access_key="' + this.access_key + '"'
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' -H "X-Authy-Signature: ' + this.computed_sig + '"';

        this.callCurl(curl);
    },

    verifyJWTResponse: function (message, secret) {

        try {
            var decoded = jwt.verify(message, secret, {algorithm: ["HS256"]});
            console.log('Signature verified and decoded');
            return decoded;
        } catch (err) {
            console.log('Invalid signature. Cannot verify JWT');
            console.log(err);
            return false;
        }
    }
};
