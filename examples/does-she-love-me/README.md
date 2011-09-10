# Does-she-love-me SMS App

This is a sample application to demonstrate how you can use
the Creatary node.js module.

## How it Works

Any mobile subscriber sending an SMS to this application gets
a simple "Yes!" or "No :(" response from the application.

## How to Launch

The file `loves-me.js` is the node.js application logic.

Then substitute in the required fields:
* Your application's `consumer_key` and `consumer_secret` in `loves-me.js` (That you acquire from
https://creatary.com. While you are there, change the SMS callback URLs to your server's address.)
* If you need to, also change the URL in the `receiveSms { url: }` property to your server's address

Then run it with the command:

    $ node loves-me.js

Once it binds to the port 80, you can SMS the application.
Note: The application does not provide a web interface.

## How to Use

* Send an SMS to the application like "Really?"
  -> Watch the reply SMS arriving.
