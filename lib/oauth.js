var sys = require('sys');
var url = require('url');

var shared;

var tokenTmpStore = {};

exports._init = function(_shared) {
    shared = _shared;
    return this;
};

exports.setup = function(connectURL, callbackURL, callback) {
    if(shared.Express) {
        // Setup connect listener
        connectURL = connectURL || "/connect";
        
        shared.Express.get(connectURL, function(req, res){
            var client = shared.OAuthUtil.getClient(shared.oAuthAccessURL, callbackURL);
            client.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
                if (error) {
                    res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
                } else {
                    // Saving temporary token's secret
                    tokenTmpStore[oauthToken] = oauthTokenSecret;
                    res.redirect(shared.oAuthAuthorizeURL + oauthToken);
                }
            });
        });
        
        // Setup callback listener
        var callbackPath = url.parse(callbackURL)['pathname'] || "/callback";

        shared.Express.get(callbackPath, function(req, res){
            var client = shared.OAuthUtil.getClient(shared.oAuthAccessURL);
            client.getOAuthAccessToken(req.query.request_token, tokenTmpStore[req.query.request_token], req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
                if (error) {
                    res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
                } else {
                    // Saving permanent secret for the user
                    shared.OAuthUtil.setSecretToken(oauthAccessToken, oauthAccessTokenSecret);
                    if(typeof callback === "function") {
                        callback(req, res, {
                            access_token: oauthAccessToken
                        });
                    }
                }
            });
            // Removing temporary token was created just for one shot
            delete tokenTmpStore[req.query.request_token];
        });
    } else {
        shared.error("Give me an Express instance with init()");
    }
};

exports.getAccessToken = function(oauth_params, callback, errorCallback) {
    var client = shared.OAuthUtil.getClient(shared.oAuthAccessURL);
    client.getOAuthAccessToken(oauth_params.oauth_token, oauth_params.oauth_token_secret, oauth_params.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
        if (error) {
            if(typeof callback === "function") {
                errorCallback();
            }
        } else {
            // Saving permanent secret for the user
            shared.OAuthUtil.setSecretToken(oauthAccessToken, oauthAccessTokenSecret);
            if(typeof callback === "function") {
                callback.call( { access_token: oauthAccessToken } );
            }
        }
    });
};
