/**
 * Does she love me? advisor application
 * Provided for Creatary JS SDK
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


// Init Creatary module with the application consumer key and secret
var creatary = require('../../lib/creatary').init('insert_consumer_key_here', 'insert_consumer_secret_here');

// Require neccessary modules (express: web server, socket.io: real-time (websocket-like) browser-server communication)
var express = require('express');
var app = express.createServer();

// Set up incoming SMS URL and our callback
app.use(express.bodyParser()); // Necessary to parse request body JSON
app.post('/creatary/sms', creatary.Sms.createListener(onSms));

// Let our webserver listen on the specified port
app.listen(10001);


// This function gets called when our application receives an SMS
function onSms(params) {
    // Let's send our professional response
    creatary.Sms.send(params.access_token, Math.round(Math.random()) ? "Yes!" : "No :(");
}
