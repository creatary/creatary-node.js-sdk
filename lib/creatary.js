var shared = {
    OAuthTable : {},
    oAuthRequestURL : null,
    oAuthConsumerKey : null,
    oAuthConsumerSecret : null,
    oAuthVersion : "1.0",
    oAuthSignatureMethod : "HMAC-SHA1",
    apiURL: "https://telcoassetmarketplace.com/api/1/",
    Logger : null,
    Utils: null,
    OAuthUtil : null,
    ServerUtil : null,
};

shared.Utils = require("./utils");
shared.Logger = new Logger(1);
shared.OAuthUtil = require("./oauth_util")._init(shared);
shared.ServerUtil = new require("./server_util")._init(shared);

var Sms = require('./sms')._init(shared);
var Location = require('./location')._init(shared);
var Charging = require('./charging')._init(shared);
var Http = require('http');

exports.Sms = Sms;
exports.Location = Location;
exports.Charging = Charging;

exports.init = function(consumerKey, consumerSecret) {
    shared.oAuthConsumerKey = consumerKey;
    shared.oAuthConsumerSecret = consumerSecret;
    shared.oAuthRequestURL = shared.apiURL + "oauth/request_token";
    return this;
};

function Logger(level) {
    var DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3;

    var doLog = function() {
        console.log(shared.Utils.toArray(arguments));
    };
    var doNothing = function() {
    };

    this.debug = level <= DEBUG ? doLog : doNothing;
    this.info = level <= INFO ? doLog : doNothing;
    this.warn = level <= WARN ? doLog : doNothing;
    this.error = level <= ERROR ? doLog : doNothing;
};
