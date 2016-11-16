const qs = require('qs');
const crypto = require('crypto');
const exec = require('child_process').exec;
const n = require('nonce')();

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
    this.app_api_key = app_api_key;
    this.access_key = access_key;
    this.signing_key = signing_key;
    this.nonce = options.PROD ? n() + "." + n() : 1234.4321;
    this.computed_sig;

    // contact info
    this.country_code;
    this.email;
    this.phone;
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

        var sorted_params = qs.stringify(allParams).split("&").sort().join("&").replace(/%20/g, '+');
        if (this.DEBUG) console.log("Sorted:\n", sorted_params);

        var dataToSign = this.nonce + "|" + method + "|" + url + "|" + sorted_params;
        this.computed_sig = crypto.createHmac('sha256', this.signing_key).update(dataToSign).digest('base64');


        if (this.DEBUG) {
            console.log("Nonce:");
            console.log(this.nonce);
            console.log("Signature:");
            console.log(this.computed_sig);
        }
    },

    /**
     * Update both main and sidebar logos.
     */
    updateAssets: function () {

        var url = "https://api.authy.com/dashboard/json/application/assets/update";
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
     * Example updating the background color
     *
     * @param {!string=} hexColor  #ff0000
     */
    updateColors: function (hexColor) {

        var url = "https://api.authy.com/dashboard/json/application/ui_settings/update";
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
        var url = "https://api.authy.com/dashboard/json/application/ui_settings";
        var method = "GET";
        this.computeSig(url, method);

        var curl = 'curl -H "X-Authy-Signature: ' + this.computed_sig + '"'
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' "' + url + "?app_api_key=" + this.app_api_key + "&access_key=" + this.access_key + '"';

        this.callCurl(curl);
    },

    getApplicationDetails: function () {
        var url = "https://api.authy.com/dashboard/json/application/details";
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

        var url = "https://api.authy.com/dashboard/json/application/update";
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
     * Call the CURL command
     * @param curl
     */
    callCurl: function (curl) {
        if (this.DEBUG) {
            console.log("cURL call:\n", curl);
        }

        exec(curl, (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}\n`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    },

    setContactInfo: function (email, country_code, phone) {
        this.email = email;
        this.country_code = country_code;
        this.phone = phone;
    },

    createDashboardApplication: function () {
        var params = {
            name: "My new App Name",
            email: ""
        };


        var url = "https://api.authy.com/dashboard/json/application/update";
        var method = "POST";
        this.computeSig(url, method, {name: name});
    },

    /**
     * TODO: NOT WORKING Requested URL was not found. Please check http://docs.authy.com/ to see the valid URLs
     */
    getApplicationLogos: function () {
        var url = "https://api.authy.com/dashboard/json/application/assets";
        var method = "POST";
        this.computeSig(url, method);

        var curl = 'curl -H "X-Authy-Signature: ' + this.computed_sig + '"'
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' -d app_api_key="' + this.app_api_key + '"'
            + ' -d access_key="' + this.access_key + '"'
            + ' "' + url + '"';

        this.callCurl(curl);

    },

    listUsers: function () {
        var url = "https://api.authy.com/dashboard/json/application/users";
        var method = "GET";
        var params = {
            page: 0,
            per_page: 10
        };

        this.computeSig(url, method, params);
        var curl = 'curl -H "X-Authy-Signature: ' + this.computed_sig + '"'
            + ' -H "X-Authy-Signature-Nonce:' + this.nonce + '"'
            + ' -d app_api_key="' + this.app_api_key + '"'
            + ' -d access_key="' + this.access_key + '"'
            + ' "' + url + "?app_api_key=" + this.app_api_key +'&access_key=' + this.access_key + '"';

        this.callCurl(curl);

    }
};
