var origin = 'https://telcoassetmarketplace.com';

var shared = {
    // oAuth general variables
    oAuth2: false,
    // oAuth 1.0A variables
    oAuth1ConsumerKey: '',
    oAuth1ConsumerSecret: '',
    oAuth1AuthorizeURL: origin + "/web/authorize?oauth_token=",
    oAuth1SecretTable: {},
    oAuth1RequestURL: '',
    oAuth1AccessURL: '',
    oAuth1Version: "1.0",
    oAuth1SignatureMethod: "HMAC-SHA1",
    // oAuth 2.0 variables
    oAuth2ClientId: '',
    oAuth2ClientSecret: '',
    oAuth2AuthorizeURL: origin + "/web/authorize?client_id=",
    oAuth2AccessURL: '',
    oAuth2RedirectUri: '',
    // Misc.
    apiURL: origin + '/api',
    Logger: null,
    Utils: null,
    OAuthUtil: null,
    ServerUtil: null,
    Express: null
};

shared.Utils = require("./utils");
shared.Logger = new shared.Utils.Logger(0);
shared.OAuthUtil = require("./oauth_util")(shared);
shared.ServerUtil = require("./server_util")(shared);

shared.OAuth1 = require('./oauth1')._init(shared);
shared.OAuth2 = require('./oauth2')._init(shared);

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
    var Sms = require('./sms')._init(shared);
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
