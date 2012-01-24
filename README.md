# creatary-node.js-sdk

A node.js module for accessing Creatary API.

*Receive & send SMS, query location and charge subscribers all through their mobile operator,
in a revenue share, no upfront investment model.*

https://creatary.com

## How to Install

    npm install creatary-sdk

## How to Use

### Initialization

Init Creatary module with your application consumer key and secret (also called client_id and client_secret: (that you obtain from https://creatary.com)

```js
var creatary = require('creatary-sdk').init(consumer_key, consumer_secret, [optional_parameters]);
```

```js
optional_parameters = {
    server: srv, // (optional) Pass your Express instance, Creatary module will reuse it for OAuth and listening for SMS
    receiveSms : { // (optional) Parameters for receiving SMS
        url: 'http://localhost/sms', // (mandatory) SMS callback url
        callBack: onSms // (mandatory) Callback function for incoming SMS
    },
    oAuth : { // (optional if you use OAuth 1.0 mode) Do NOT supply otherwise
        connectUrl : '/connect', // (mandatory) Relative URL, used to initiate the OAuth authorization for your app
        url: 'http://localhost/callback', // (mandatory) Absolute URL, used redirect back the user after authorization
        callback: onAuthed // (mandatory) Callback function after successful oAuth flow
    },
    oAuth2 : true // (mandatory if you use OAuth 2.0 mode) Do NOT supply otherwise
}
```
And you're ready to use self-describing API calls:

### SMS

```js
// Send SMS
creatary.Sms.send(toToken, "Hello World SMS");
// Receive SMS
creatary.Sms.receive(function(data), [params]);

data = {
    to: destination MSISDN
    body: messages
    access_token: token which identifies the sender, it can be used for response
    transaction_id: transaction id of the SMS, use it in order to keep the SMS session
}

params = {
    url: "http://localhost:80/sms" // it's used to open the server port and bind the path
}
```

### Location

```js
// Query Location
creatary.Location.getCoordinates(userToken, function(locData));

locData = {
    latitude:
    longitude: 
    accuracy: 
    timestamp:
}
```

### Charging

```js
// Charge User for 1.00 USD
creatary.Charging.chargeAmount(userToken, 100);
// Charge User with a service code
creatary.Charging.chargeCode(userToken, "MO");
```

## License

(The MIT License)

Copyright (c) 2011 Nokia Siemens Networks
 
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.