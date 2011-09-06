# node-creatary

A node.js module for accessing Creatary API.
*Receive & send SMS, query location and charge subscribers all through their mobile operator,
in a revenue share, no upfront investment model.*
https://creatary.com

## How to Install

    npm install creatary

## How to Use

Init Creatary module with your application consumer key and secret: (that you obtain from https://creatary.com)

```js
var creatary = require('creatary').init('consumer_key', 'consumer_secret');
```

And you're ready to use self-describing API calls:

```js
// Send SMS
creatary.Sms.send(userToken, "Hello World SMS");
// Query Location
creatary.Location.getCoordinates(userToken, function(locData) { /* yay, i have it! */ });
// Charge User for 1.00 USD
creatary.Charging.chargeAmount(userToken, "100");
// Receive SMS
creatary.Sms.createListener(userToken, { url: "https://myserver.com/sms" });
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