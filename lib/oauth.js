var sys = require('sys');

var shared;

exports._init = function(_shared) {
    shared = _shared;
    return this;
};

exports.setup = function(callbackURL, callback) {
    if(shared.Express) {
        shared.Express.get('/connect', function(req, res){
            var client = exports.getClient(shared.oAuthAccessURL);
            
            client.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
                if (error) {
                    res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
                } else {
                    req.session.oauthRequestToken = oauthToken;
                    req.session.oauthRequestTokenSecret = oauthTokenSecret;
                    res.redirect(shared.oAuthAuthorizeURL + req.session.oauthRequestToken);
                }
            });
        });

        shared.Express.get('/callback', function(req, res){
            var client = exports.getClient(shared.oAuthAccessURL);
            client.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
                if (error) {
                    res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
                } else {
                    req.session.oauthAccessToken = oauthAccessToken;
                    req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
                    if(typeof callback === "function") {
                        callback(req, res, {
                            access_token: oauthAccessToken,
                            access_token_secret: oauthAccessTokenSecret
                        });
                    }
                }
            });
        });
    } else {
        shared.error("Give me an express instance with init()");
    }
    
};