var shared = {
    OAuthTable : {},
    oAuthRequestURL : null,
    oAuthAccessURL: null,
    oAuthAuthorizeURL: "https://telcoassetmarketplace.com/web/authorize?oauth_token=",
    oAuthConsumerKey : null,
    oAuthConsumerSecret : null,
    oAuthVersion : "1.0",
    oAuthSignatureMethod : "HMAC-SHA1",
    apiURL: "https://telcoassetmarketplace.com/api/1/",
    Logger : null,
    Utils: null,
    OAuthUtil : null,
    ServerUtil : null,
    Express: null
};

shared.Utils = require("./utils");
shared.Logger = new shared.Utils.Logger(0);
shared.OAuthUtil = require("./oauth_util")._init(shared);
shared.ServerUtil = new require("./server_util")._init(shared);

var Sms = require('./sms')._init(shared);
var Location = require('./location')._init(shared);
var Charging = require('./charging')._init(shared);
var Http = require('http');
var OAuth = require('./oauth')._init(shared);

// Open for public
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
exports.OAuth = {
    setup: OAuth.setup
};
// Initialization of the library
/*
 * config = {
    server: srv,
    receiveSms : {
        url: 'http://localhost:10001/sms',
        callBack: onSms
    },
    oAuth : {
        connectUrl : '/connect',
        url: 'http://173.203.109.105:10001/callback',
        callback: onAuthed
    }
};
 */
exports.init = function(consumerKey, consumerSecret, config) {
    config = config || {};
    shared.oAuthConsumerKey = consumerKey;
    shared.oAuthConsumerSecret = consumerSecret;
    shared.oAuthRequestURL = shared.apiURL + "oauth/request_token";
    shared.oAuthAccessURL = shared.apiURL + "oauth/access_token";
    shared.Express = config.server;
    if(shared.Express) {
        shared.ServerUtil.initExpress(shared.Express);
    }
    if(config.receiveSms) {
        Sms.receive(config.receiveSms.callBack, {
            "url": config.receiveSms.url
        });
    }
    if(config.oAuth) {
        exports.OAuth.setup(config.oAuth.connectUrl, config.oAuth.url, config.oAuth.callback);
    }
    return this;
};
