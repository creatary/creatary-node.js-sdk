## Pay-by-mobile app

This is a sample application to demonstrate how you can use
the Creatary node.js module.

## How it Works

The user send in an SMS like "START LICPLATE123" when he/she parks his/her car, and finally sends "STOP"
when he/she finishes.
Then, based on his geolocation, a tariff; and the length of parking, an amount is calculated, and charged
to the user. 
The node.js RTC capabilities are demonstrated in a simple web interface for parking officers. Opening the
webpage on their smartphones, they can see the list of parking cars real-time dynamically updated without
dirty hacks like periodic polling.
There is also a web interface for users to be able to authorize the application with the oAuth flow.

## How to Launch

The file `parking-server.js` is the node.js application logic.

First, install the dependencies with:

    $ npm install express socket.io jade
    
Then substitute in the required fields:
* Your application's `consumer_key` and `consumer_secret` in `parking-server.js` (That you acquire from
https://creatary.com. While you are there, change the oAuth and SMS callback URLs to your server's address.)
* If you need to, also change the `io.connect('/')` expression in `index_admin.html`,
and the URLs in the `creataryConfig` object to your server's address in `parking-server.js`

Then run it with the command:

    $ [sudo] node parking-server.js
		    
Once it binds to the port 80, you can access the application with a browser (preferably smartphone):
`/` is the user interface, and `/admin` is the parking officer's admin interface.

On the user interface, a subscriber is able to authorize this application, thus enabling it to charge him/her.
On the admin interface, `socket.io` is utilized to display a dynamic list of currently parking cars (users).

## How to Use

* Login to the web interface for users to authorize application
  http://localhost/
* Open the admin interface for parking officers
  http://localhost/admin
* Send an SMS to the app with sg. like this: "START abc123"
  -> Notice how the user appeared on the admin interface
* Send an SMS with text "STOP"
  -> User has been charged and disappeared from admin interface
