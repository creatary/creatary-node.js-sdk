
var shared;
var OAuthTable = {};
var oauth = require('oauth');

exports._init = function(_shared) {
    shared = _shared;
    return this;
};

exports.setSecretToken = function(token, secret) {
    shared.Logger.debug("Trying new secret token: ", token, secret);
    if(token && secret) {
        shared.Logger.info("New secret token: ", token, secret);
        OAuthTable[token] = secret;
    }
};

exports.post = function(toToken, sendURL, body, callback) {
    if(typeof OAuthTable[toToken] !== "undefined") {
        var client = new oauth.OAuth(
            shared.oAuthRequestURL, 
            sendURL, 
            shared.oAuthConsumerKey, 
            shared.oAuthConsumerSecret, 
            shared.oAuthVersion, 
            undefined, 
            shared.oAuthSignatureMethod
        );
        var myCb = callback || function(response) { shared.Logger.debug("OAuth callback", sendURL, arguments); };
        shared.Logger.debug("OAuth post: ", sendURL, toToken, OAuthTable[toToken], body);
        client.post(sendURL, toToken, OAuthTable[toToken], JSON.stringify(body), "application/json", myCb);
    } else {
        console.log(OAuthTable);
        throw new Error("toToken (" + toToken + ") unknown");
    }
};

exports.get = function(toToken, sendURL, callback) {
    if(typeof OAuthTable[toToken] !== "undefined") {
        var client = new oauth.OAuth(
            shared.oAuthRequestURL, 
            sendURL, 
            shared.oAuthConsumerKey, 
            shared.oAuthConsumerSecret, 
            shared.oAuthVersion, 
            undefined, 
            shared.oAuthSignatureMethod
        );
        var myCb = callback || function(response) { shared.Logger.debug("OAuth callback", sendURL, arguments); };
        shared.Logger.debug("OAuth get: ", sendURL, toToken, OAuthTable[toToken]);
        client.get(sendURL, toToken, OAuthTable[toToken], myCb);
    } else {
        console.log(OAuthTable);
        throw new Error("toToken (" + toToken + ") unknown");
    }
};
