/**
 * Use this code to test the dashboard API.
 * Uncomment specific calls below to test them.  Only test on a non-production sites.
 */

var app_api_key = process.env.DASHBOARD_APP_API_KEY;
var access_key = process.env.DASHBOARD_ACCESS_KEY;
var api_signing_key = process.env.DASHBOARD_API_SIGNING_KEY;
var which_dashboard = process.env.DASHBOARD_WHICH_ONE;
var integration_key = process.env.DASHBOARD_INTEGRATION_KEY;

/**
 * Setting PROD to true calculate a unique nonce every time
 * Setting DEBUG to true outputs everything that is going on.
 * @type {{PROD: boolean, DEBUG: boolean}}
 */
var options = {
    PROD: false,
    DEBUG: true
};

var dashboard = require('./dashboard-api.js')(app_api_key, access_key, api_signing_key, options);

if(!dashboard){
    console.log("You need to setup the API keys in demo.env then `source demo.env`");
    console.log("You can find these API keys in your Authy Dashboard under the API keys.");
    console.log("If the 3 keys are not present, you need to create a ticket requesting them to be enabled");
    process.exit(1);
} else {
    console.log("You're testing " + which_dashboard);
}


/**
 * Set contact info and create a new application
 *
 * Request the integration key from Henry.
 *
 */
// if(integration_key){
//     dashboard.integration_key = integration_key;
//     dashboard.email = 'josh@twilio.com';
//     dashboard.country_code = '1';
//     dashboard.phone = '8439011978';
//     dashboard.createDashboardApplication('Happy App 2FA');
// } else {
//     console.log("Integration key is not set");
// }

/**
 * Example uploading the sidebar and main logos
 * The logos it will use are main.png and sidebar_logo.png in this directory
 */
// dashboard.updateAssets();


/**
 * Example showing how to change the background color
 */
// dashboard.updateColors('#00ff00');

/**
 * Simple GET request for dashboard details.
 */
// dashboard.getApplicationUIDetails();

/**
 * Get details for application
 */
// dashboard.getApplicationDetails();

/**
 * Update application details.
 */
// dashboard.updateAppDetails();



/**
 * Get JSON of application logo locations
 * */
// dashboard.getApplicationLogos();


/**
 * List users
 */
// dashboard.listUsers();



