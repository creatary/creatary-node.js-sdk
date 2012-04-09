var shared = require("./shared");
var sendURL;

exports.init = function() {
	sendURL = shared.apiURL + "location/getcoord";
	return this;
}

/*
 * toToken: token of the recipient
 * callback: function(data)
 * 		data: {
 * 			    latitude:
 *  			longitude: 
 *  			accuracy: 
 *  			timestamp:
 * 		}
 */
exports.getCoordinates = function(toToken, callback) {
    shared.Logger.info("getCoordinates ", toToken);
    var myCb = undefined;
    if(typeof callback === "function") {
        myCb = function(request, response) {
            try {
                var data = JSON.parse(response);
                callback(data.body);
            } catch(e) {
                shared.Logger.warn("getCoordinates exception", e);
            }
        };
    }
    shared.OAuthUtil.get(toToken, sendURL, myCb);
};
