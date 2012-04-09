var oauth = require('oauth');
var shared = require("./shared.js");
var oauthTable = shared.OAuthTable;
var sendURL;

exports.init = function() {
	sendURL = shared.apiURL + "charge/request";
	return this;
}

/*
 * toToken: the identifier of the user you want to charge
 * params:  {
 *              method:
                amount:
                charging_code:
            }
 */

var request = function(toToken, params) {
    params = params || {};
    var body = {
            method: params.method,
            amount: params.amount,
            charging_code: params.charging_code
    };
    shared.OAuthUtil.post(toToken, sendURL, body);
};

exports.chargeAmount = function(toToken, amount) {
    shared.Logger.info("Charge amount ", toToken, amount);
    request(toToken, {
        "method": "AMOUNT",
        "amount": amount
    });
};

exports.chargeCode = function(toToken, code) {
    shared.Logger.info("Charge code ", toToken, amount);
    request(toToken, {
        "method": "CODE",
        "charging_code": code
    });
};