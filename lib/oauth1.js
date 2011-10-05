var sys = require('sys');
var url = require('url');
var oauth = require('oauth');

var shared;

var tokenTmpStore = {};

exports._init = function(_shared) {
    shared = _shared;
    return this;
};

exports.setSecretToken = function(token, secret) {
    shared.Logger.debug("Trying new secret token: ", token, secret);
    if(token && secret) {
        shared.Logger.info("New secret token: ", token, secret);
        shared.oAuth1SecretTable[token] = secret;
    }
};

exports.getClient = function(accessURL, callbackURL) {
    return new oauth.OAuth(
        shared.oAuth1RequestURL,
        accessURL,
        shared.oAuth1ConsumerKey,
        shared.oAuth1ConsumerSecret,
        shared.oAuth1Version,
        callbackURL,
        shared.oAuth1SignatureMethod
    );
};

exports.setup = function(connectURL, callbackURL, callback) {
    if(shared.Express) {
        // Setup connect listener
        connectURL = connectURL || "/connect";
        
        shared.Express.get(connectURL, function(req, res){
            var client = shared.OAuth1.getClient(shared.oAuth1AccessURL, callbackURL);
            client.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
                if (error) {
                    res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
                } else {
                    // Saving temporary token's secret
                    tokenTmpStore[oauthToken] = oauthTokenSecret;
                    res.redirect(shared.oAuth1AuthorizeURL + oauthToken);
                }
            });
        });
        
        // Setup callback listener
        var callbackPath = url.parse(callbackURL)['pathname'] || "/callback";

        shared.Express.get(callbackPath, function(req, res){
            var client = shared.OAuth1.getClient(shared.oAuth1AccessURL);
            client.getOAuthAccessToken(req.query.request_token, tokenTmpStore[req.query.request_token], req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
                if (error) {
                    res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
                } else {
                    // Saving permanent secret for the user
                    shared.OAuth1.setSecretToken(oauthAccessToken, oauthAccessTokenSecret);
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
