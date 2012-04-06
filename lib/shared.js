var origin = 'https://telcoassetmarketplace.com';

exports = {
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

exports.Utils = require("./utils");
exports.Logger = new exports.Utils.Logger(3);
exports.OAuthUtil = require("./oauth_util")._init(exports);
exports.ServerUtil = require("./server_util")._init(exports);
exports.OAuth1 = require('./oauth1')._init(exports);
exports.OAuth2 = require('./oauth2')._init(exports);

module.exports = exports;
