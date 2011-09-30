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

// Creatary configuration object
var creataryConfig = {
    server: srv
};
// Init Creatary module with the application consumer key and secret
var creatary = require('../../lib/creatary').init('consumer_key', 'consumer_secret', creataryConfig);

// Mount index page
srv.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

// Let our webserver listen on the specified port
srv.listen(80);

// The list of RSS feeds
var memStore = {};

// Handle browser connections
io.sockets.on('connection', function (socket) {
    socket.on('rss-list-req', function(data) {
        var rec = memStore[data.cookie] ? memStore[data.cookie] : (memStore[data.cookie] = { oauth_token: null, rss: {} });
        socket.emit('rss-list-resp', rec.rss);
    });
    
    socket.on('rss-add', function(data) {
        var rec = memStore[data.cookie] ? memStore[data.cookie] : (memStore[data.cookie] = { oauth_token: null, rss: {} });
        rec.rss[data.rss] = {};
        socket.emit('rss-list-resp', rec.rss);
    });
    
    socket.on('rss-del', function(data) {
        var rec = memStore[data.cookie] ? memStore[data.cookie] : (memStore[data.cookie] = { oauth_token: null, rss: {} });
        delete rec.rss[data.rss];
        socket.emit('rss-list-resp', rec.rss);
    });
    
    socket.on('auth-done', function(data) {
        var rec = memStore[data.cookie] ? memStore[data.cookie] : (memStore[data.cookie] = { oauth_token: null, rss: {} });
        creatary.Oauth.getAccessToken(data.oauth_params, function(oauth) {
            rec.oauth_token = oath.access_token;
        });
    });
});

var getPage = function(urll) {    
    var siteUrl = url.parse(urll);
    var site = http.createClient(siteUrl.port || 80, siteUrl.host);

    var request = site.request("GET", siteUrl.pathname, {'Host' : siteUrl.host})
    request.end();

    request.on('response', function(response) {
        response.on('data', function(chunk) {
        });
      response.on('end', function() {
      });
    });

    request.end();
}

var pollFeeds = function() {
    //setTimeout(pollFeeds, 1000);
}

pollFeeds();
