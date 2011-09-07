var sendURL;
var shared;

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
    var myCb;
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

exports._init = function(_shared) {
    shared = _shared;
    sendURL = shared.apiURL + "location/getcoord";
    return this;
};
