// # App Api Key: QDvt27fueAi66nDoy7Km2GlXfFUlhptU
// # Your Access Key: LcLVht30n7bGRHWF2xsARspJDS84MYN2UjFyu0thCvk
// # Api Signing Key: Adg3Gm25yGQZAgicSUnce7BAHFVRgxuV

// curl -H "X-Authy-Signature: <signature>" 
// 	 -H "X-Authy-Signature-Nonce: <nonce>" \
//      -F app_api_key="QDvt27fueAi66nDoy7Km2GlXfFUlhptU" \
//      -F access_key="LcLVht30n7bGRHWF2xsARspJDS84MYN2UjFyu0thCvk" \
//      -F main_logo="@main.png" \
//      -F sidebar_logo="@menu.png" \
//      "https://api.authy.com/dashboard/json/application/assets/update"


const qs = require('qs');
const crypto = require('crypto');
// const Curl = require( 'node-libcurl' ).Curl;
const n = require('nonce')();
const exec = require('child_process').exec;

// var curl = new Curl(),
//     close = curl.close.bind( curl );
 
// curl.setOpt( curl.option.URL, '127.0.0.1/upload.php' );
// curl.setOpt( curl.option.HTTPPOST, [
//     { name: 'input-name', file: '/file/path', type: 'text/html' },
//     { name: 'input-name2', contents: 'field-contents' }
// ]);
 
// curl.on( 'end', close );
// curl.on( 'error', close );

var app_api_key = "QDvt27fueAi66nDoy7Km2GlXfFUlhptU";
var api_signing_key = "Adg3Gm25yGQZAgicSUnce7BAHFVRgxuV";
var access_key = "LcLVht30n7bGRHWF2xsARspJDS84MYN2UjFyu0thCvk";
var params = "";

function computeSig() {

    var comp_nonce = n() + "." + n();

    // sort the params
    var sorted_params = qs.stringify(params).split("&").sort().join("&").replace(/%20/g, '+');

    var data = comp_nonce + "|" + method + "|" + url + "|" + sorted_params;

    var computed_sig = crypto.createHmac('sha256', api_signing_key).update(data).digest('base64');

	console.log("Nonce:");
	console.log(comp_nonce);
	console.log("SIG:");
	console.log(computed_sig);
}

function updateColors(nonce, computed_sig, url);

function updateAssets(nonce, computed_sig, url){

	var curl = 'curl -H "X-Authy-Signature: ' + computed_sig + '"'
			 + ' -H "X-Authy-Signature-Nonce: ' + nonce + '"' 
			 + ' -F app_api_key="' + app_api_key + '"' 
		     + ' -F access_key="'+ access_key + '"' 
		     + ' -F main_logo="@./main.png" ' 
		     + ' -F sidebar_logo="@./menu.png" '
		     + '"' + url + '"';

		     callCurl(curl);
}

function callCurl(curl){
		     console.log('CURL:\n' + curl);

		     exec(curl, (error, stdout, stderr) => {
		        console.log(`stdout: ${stdout}`);
		        console.log(`stderr: ${stderr}`);
		        if (error !== null) {
		            console.log(`exec error: ${error}`);
		        }
		     });
}

var url = "https://api.authy.com/dashboard/json/application/assets/update";
var method = "POST";
var sorted_params = "";  // there are no params here so ... empty string?


verifyCallback();
updateAssets(comp_nonce, computed_sig, url);
