
var shared;
var http = require('http');
var url = require('url');
var httpServer;
// Currently only one is supported
var callback;

exports._init = function(_shared) {
    shared = _shared;
    return this;
};

exports.listen = function(urlStr, _callback) {
    callback = _callback;
    if(!httpServer) {
        httpServer = http.createServer(httpListener);
    }
    var urlParsed = url.parse(urlStr);
    shared.Logger.info("HTTP server - start listening", urlParsed);
    httpServer.listen(urlParsed.port);
};

var httpListener = function (req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    });
    
    req.on('end', function() {
        shared.Logger.debug("HTTP server - data received", data);
        try {
            // Parsing JSON body
            req.body = JSON.parse(data);
            if(typeof callback === "function") {
                callback(req, res);
            }
        } catch(e) {
            shared.Logger.warn();
        }
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end();
};
