var shared;
var oauth = require('oauth');

exports._init = function(_shared) {
    shared = _shared;
    return this;
};

/**
 * Accesses a protected resource with an HTTTP POST request
 * Provides a single wrapper, and encapsulates the OAuth1 and OAuth2 calls
 */
exports.post = function(toToken, sendURL, body, callback) {
    if(!shared.oAuth2 && typeof shared.oAuth1SecretTable[toToken] === "undefined") {
        return shared.Logger.error("toToken (" + toToken + ") unknown");
    }
    var myCb = callback || function(response) { shared.Logger.debug("OAuth callback", sendURL, arguments); };
    shared.Logger.debug("OAuth post: ", sendURL, toToken, body);
    if (shared.oAuth2) {
        shared.OAuth2.post(sendURL, body, { 'Content-type': 'application/json' }, toToken, myCb);
    } else {
        var client = shared.OAuth1.getClient(sendURL);
        client.post(sendURL, toToken, shared.oAuth1SecretTable[toToken], JSON.stringify(body), "application/json", myCb);
    }
};

/**
 * Accesses a protected resource with an HTTTP GET request
 * Provides a single wrapper, and encapsulates the OAuth1 and OAuth2 calls
 */
exports.get = function(toToken, sendURL, callback) {
    if(!shared.oAuth2 && typeof shared.oAuth1SecretTable[toToken] === "undefined") {
        return shared.Logger.error("toToken (" + toToken + ") unknown");
    }
    var myCb = callback || function(response) { shared.Logger.debug("OAuth callback", sendURL, arguments); };
    shared.Logger.debug("OAuth get: ", sendURL, toToken);
    if (shared.oAuth2) {
        shared.OAuth2.get(sendURL, {}, toToken, myCb);
    } else {
        var client = shared.OAuth1.getClient(sendURL);
        client.get(sendURL, toToken, shared.oAuth1SecretTable[toToken], myCb);
    }
};
