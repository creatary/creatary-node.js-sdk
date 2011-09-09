var shared;
var express = require('express');
var http = require('http');
var url = require('url');
var server;

exports._init = function(_shared) {
    shared = _shared;
    return this;
};

// Create Server or reuse existing one
exports.listen = function(urlStr, callback) {
    server = server || shared.Express;
    var urlParsed = url.parse(urlStr);
    if(!server) {
        // create http server if application doesn't have it
        server = express.createServer();
        exports.initExpress(server);
        shared.Logger.info("HTTP server - start listening", urlParsed);
        // we can listen only once on one server
        server.listen(urlParsed.port || 80);
    }
    server.post(urlParsed.pathname, function(req, res) {
        res.writeHead(200);
        res.end();
        callback(req.body);
    });
};

// Configure Express for Creatary
exports.initExpress = function(server) {
    server.use(express.bodyParser()); // Necessary to parse request body JSON
};
