var sendURL;

var oauthTable;
var oauth = require('oauth');
var shared;

exports._init = function(_shared) {
    shared = _shared;
    oauthTable = _shared.OAuthTable;
    sendURL = shared.apiURL + "charge/request";
    return this;
};

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