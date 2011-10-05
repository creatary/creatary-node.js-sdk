var sendURL;

var oauth = require('oauth');
var shared;

exports._init = function(_shared) {
    shared = _shared;
    sendURL = shared.apiURL + "sms/send";
    return this;
};


/*
 * toToken: Token of recipient
 * msg: The message you want to send
 * params (optional):
 * 		{
 * 			from: Source MSISDN
 * 			transaction_id: Transaction id of previous message
 * 		}
 */
exports.send = function(toToken, msg, params) {
    shared.Logger.info("Send SMS ", toToken, msg);
    params = params || {};
    var body = {
            body: msg,
            from: params.from,
            transaction_id: params.transaction_id
    };
    shared.OAuthUtil.post(toToken, sendURL, body);
};

/*
 * Callback data:
 * { 
 *    to: Destination MSISDN
 *    body: Messages
 *    access_token: Token which identifies the sender, it can be used for response
 *    transaction_id: Transaction id of the SMS, use it in order to keep the SMS session
 *  }
 */

exports.receive = function(callback, params) {
    params = params || {};
    var url = params.url || "http://localhost:80/sms";
    shared.ServerUtil.listen(url, function(body) {
        shared.Logger.info("SMS received ", body);
        if(typeof body === "object") {
            if (shared.oAuthv2) {
                body.access_token = body.oauthv2_access_token;
            } else {
                shared.OAuthUtil.setSecretToken(body.access_token, body.token_secret);
            }
            callback(body);
        } else {
            shared.Logger.warn("SMS received not JSON");
        }
    });
};
