/**
 * Pay-by-mobile parking application
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


// Require neccessary modules (express: web server, socket.io: real-time (websocket-like) browser-server communication)
var express = require('express');
var srv = express.createServer();
var io = require('socket.io').listen(srv);

// Creatary configuration object
var creataryConfig = {
    server: srv,
    receiveSms : {
        url: 'http://localhost/creatary/sms',
        callBack: onSms
    },
    oAuth : {
        connectUrl : 'http://localhost/connect',
        url: 'http://localhost/callback',
        callback: onAuthed
    }
};
// Init Creatary module with the application consumer key and secret
var creatary = require('../../lib/creatary').init('4wc3w7g9nlavytem', 'dbvo6jw9x8bf1uro', creataryConfig);

// We are acting as a web server: serve html files
srv.get(/^\/users?(\?sms)/, function(req, res) {
    // Display user page based on authentication status
    if (typeof req.session.user === "undefined") {
        res.sendfile(__dirname + '/index_user.html');
    } else {
        if (req.params[0] !== null) {
            creatary.Sms.send(req.session.user, "Test SMS to verify your account.");
        }
        res.sendfile(__dirname + '/index_user_authed.html');
    }
});

// Display admin page
srv.get('/admin', function (req, res) {
    res.sendfile(__dirname + '/index_admin.html');
});

// The list of currently parking cars
var parkingCars = {};

// Handle browser connections
io.sockets.on('connection', function (socket) {
    socket.emit('parking-cars', parkingCars); // Tell him the list of parking cars
});

// Let our webserver listen on the specified port
srv.listen(80);

// After oAuth authorization, store user in session and redirect to root
function onAuthed(req, res, oath) {
    req.session.user = oath.access_token;
    res.redirect("/");
}

// This function gets called when our application receives an SMS
function onSms(params) {
    // Extract the SMS message itself, and the token identifying the sender subscriber
    var message = params.body;
    var from = params.access_token;
    
    // STOP message => finished parking
    if (message.indexOf('STOP') != -1) {
        var record = parkingCars[from];
        var toTime = new Date();
        var timeDiff = toTime.getTime() - record.fromTime.getTime(); // In milliseconds
        var pricePerHour = 10;
        var cost = Math.round(timeDiff / (1000*60*60) * pricePerHour * 100); // in cents
        creatary.Sms.send(from, "Thanks for using Mobile Parking! Your parked from " +
            prettyTime(record.fromTime) + " till " + prettyTime(toTime) + ". You have been charged $" + cost + ".");
        creatary.Charging.chargeAmount(from, cost); // Charge the user. Are you enjoying this, right ?
        delete parkingCars[from]; // Delete user(car) from list
        io.sockets.emit('parking-cars', parkingCars); // Update every browser client
    } else
    
    // START message => started parking
    if (message.indexOf('START') != -1) {
        parkingCars[from] = {}; // Add user(car) to list
        parkingCars[from].plate = message.replace('START', '');
        parkingCars[from].fromTime = new Date();
        parkingCars[from].fromPrettyTime = prettyTime(parkingCars[from].fromTime);
        //parkingCars[message].location = creatary.Location.coordinates();
        creatary.Sms.send(from, "Thanks for using Mobile Parking! Please text 'STOP' as soon as you finished parking.");
        io.sockets.emit('parking-cars', parkingCars); // Update every browser client
        creatary.Location.getCoordinates(from);
    } else
    // Unknown message
    {
        creatary.Sms.send(from, "Incorrect message. Please send 'START ABC123' (your license plate) to start, and 'STOP' to stop parking.");
    }
}

// Just a helper to print time user-friendly
var prettyTime = function(time) { 
    var hours = time.getHours();
    var minutes = time.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var amPM = (hours > 11) ? "PM" : "AM";
    return hours + ":" + minutes + " " + amPM;
};
