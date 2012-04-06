var origin = 'https://telcoassetmarketplace.com';

var shared = require("./shared");

/**
 * Initialization function
 *
 * @params
 * consumerKey                              - also called client id
 * consumerSecret                           - also called client secret
 * config = {                               - optional
 *   server: srv,                           - optional
 *   receiveSms : {                         - optional
 *       url: 'http://localhost:10001/sms',             
 *       callBack: onSms                                
 *   },
 *   oAuth : {                              - optional if you use oAuth 1.0 mode, do not provide otherwise
 *       connectUrl : '/connect',                       
 *       url: 'http://173.203.109.105:10001/callback',  
 *       callback: onAuthed                             
 *   },
 *   oAuth2 : true                          - if you use oAuth 2.0 mode, do not provide otherwise
 * }
 */
 
exports.init = function(consumerKey, consumerSecret, config) {
    config = config || {};
    shared.oAuth2 = (config.oAuth2 === true) ? true : false;
    // Running in OAuth2 mode
    if (shared.oAuth2) {
        shared.apiURL += '/2/';
        shared.oAuth2ClientId = consumerKey;
        shared.oAuth2ClientSecret = consumerSecret;
        shared.oAuth2AccessURL = shared.apiURL + "oauth/token";
        //shared.oAuth2RedirectUri = config.oAuth2.redirectUri;
        // export additional API
        exports.OAuth = {
            getAccessToken: shared.OAuth2.getAccessToken
        };
    // Running in OAuth1 mode
    } else {
        shared.apiURL += '/1/';
        shared.oAuth1ConsumerKey = consumerKey;
        shared.oAuth1ConsumerSecret = consumerSecret;
        shared.oAuth1RequestURL = shared.apiURL + "oauth/request_token";
        shared.oAuth1AccessURL = shared.apiURL + "oauth/access_token";
    }

    shared.Express = config.server;
    if(shared.Express) {
        shared.ServerUtil.initExpress(shared.Express);
    }
    
    // Init helper libraries
    var Sms = require('./sms');
    var Location = require('./location')._init(shared);
    var Charging = require('./charging')._init(shared);
    
    // API Open for public
    exports.Sms = {
        send : Sms.send,
        receive: Sms.receive
    };
    exports.Location = {
        getCoordinates: Location.getCoordinates
    };
    exports.Charging = {
        chargeAmount : Charging.chargeAmount,
        chargeCode : Charging.chargeCode
    };
    
    if (config.receiveSms) {
        Sms.receive(config.receiveSms.callBack, {
            "url": config.receiveSms.url
        });
    }
    
    if (config.oAuth) {
        shared.OAuth1.setup(config.oAuth.connectUrl, config.oAuth.url, config.oAuth.callback);
    }
    
    return this;
};
