## Rss-2-Sms app

This is a sample application to demonstrate how you can use
the Creatary node.js module.

## How it Works

The subscribers navigate to the website of the application, authorize the application
with the OAuth2 iframe or OAuth2 popup method, then enters RSS feed addresses (URLs)
he would like to receive SMS notifications of.

## How to Launch

The file `rss-2-sms.js` is the node.js application logic.

First, install the dependencies with:

    $ npm install express socket.io

Then substitute in the required fields:
* Your application's `consumer_key` and `consumer_secret` in `rss-2-sms.js` (That you acquire from
https://creatary.com. While you are there, change the oAuth callback URL to your server's address.)
* If you need to, also change the `io.connect('/')` expression in `index_admin.html`,
and the URLs in the `creataryConfig` object to your server's address in `rss-2-sms.js`

Then run it with the command:

    $ [sudo] node rss-2-sms.js

Once it binds to the port 80, you can access the application with a browser.

On the user interface, a subscriber is able to authorize the application, with the OAuth2 iframe method,
thus enabling it to send SMS to him/her. The subscriber can also add (and remove) URLs (RSS feeds), that
will be monitored for him.
If a page refresh occurs, the URLs are restored on the GUI, as the node.js application identifies them by
a cookie stored in the browser.

## How to Use

* Login to the web interface for users to authorize application
  http://localhost/
* Add different URLs to the RSS entry form
  -> Notice they are transferred to node.js realtime with `socket.io`
* Wait until one of the URLs change content
  -> An SMS with the update should be sent to the involved subscriber(s)
