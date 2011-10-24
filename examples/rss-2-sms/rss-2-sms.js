/**
 * RSS-2-SMS Sample Application
 * Provided for Creatary node.JS SDK
 *
 * @author Attila Incze <attila.incze@nsn.com>
 * 
 * Copyright (c) 2011 Nokia Siemens Networks
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


// Require neccessary modules (express: web server, socket.io: real-time (websocket-like) browser-server communication)
var express = require('express');
var srv = express.createServer(
    express.cookieParser(),
    express.session({secret:"session_secret"})
);
var io = require('socket.io').listen(srv);
var url = require('url'), http = require('http');

// Creatary configuration object
var creataryConfig = {
    server: srv,
    oAuth2: {
        redirectUri: "http://localhost"
    }
};
// Init Creatary module with the application consumer key and secret
var creatary = require('../../lib/creatary').init('consumer_key', 'consumer_secret', creataryConfig);

// Mount index page
srv.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

// Mount index page
srv.get('/creatary.js', function (req, res) {
    res.sendfile(__dirname + '/creatary.js');
});


// Let our webserver listen on the specified port
srv.listen(80);

// The list of RSS feeds
var memStore = {};

// Handle browser connections
io.sockets.on('connection', function (socket) {
    socket.on('rss-list-req', function(data) {
        var rec = memStore[data.cookie] ? memStore[data.cookie] : (memStore[data.cookie] = { access_token: null, rss: {} });
        socket.emit('rss-list-resp', rec.rss);
    });
    
    socket.on('rss-add', function(data) {
        var rec = memStore[data.cookie] ? memStore[data.cookie] : (memStore[data.cookie] = { access_token: null, rss: {} });
        getPage(data.rss, function(content) {
            rec.rss[data.rss] = content;
            socket.emit('rss-list-resp', rec.rss);
        });
    });
    
    socket.on('rss-del', function(data) {
        var rec = memStore[data.cookie] ? memStore[data.cookie] : (memStore[data.cookie] = { access_token: null, rss: {} });
        delete rec.rss[data.rss];
        socket.emit('rss-list-resp', rec.rss);
    });
    
    socket.on('need-access-token', function(data) {
        var rec = memStore[data.cookie] ? memStore[data.cookie] : (memStore[data.cookie] = { access_token: null, rss: {} });
        socket.emit('need-access-token', (rec.access_token === null));
    });
    
    socket.on('auth-done', function(data) {
        var rec = memStore[data.cookie] ? memStore[data.cookie] : (memStore[data.cookie] = { access_token: null, rss: {} });
        creatary.OAuth.getAccessToken(data.code, function(oauth) {
            rec.access_token = oauth.access_token;
        });
    });
});

var pageCache = {};

var getPage = function(urll, cb) {
    var siteUrl = url.parse(urll);
    var site = http.createClient(siteUrl.port || 80, siteUrl.host);
    site.on('error', function(){});

    var request = site.request("GET", siteUrl.pathname, {'Host' : siteUrl.host});
    request.on('error', function(){});
    
    var data = '';
    request.on('response', function(response) {
        response.on('data', function(chunk) {
            data += chunk;
        });
      response.on('end', function() {
          cb(data);
      });
    });

    request.end();
}

var pollFeeds = function() {
    for (var user in memStore) {
        var rec = memStore[user];
        for (var rss in rec.rss) {
            getPage(rss, function() {  // put it in a closure
                var _rss = rss;
                var _rec = rec;
                return function(content) {
                    if (content !== rec.rss[_rss]) {
                        _rec.rss[_rss] = content;
                        creatary.Sms.send(_rec.access_token, 'RSS feed updated: ' + _rss);
                    }
                };
            }());
        }
    }
    setTimeout(pollFeeds, 60000); // Check feeds every minute
}

pollFeeds();
