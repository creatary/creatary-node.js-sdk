## Pay-by-mobile app

This is a sample application to demonstrate how you can use
the Creatary node.js module.

## How it Works

Any mobile subscriber sending his license plate number to the
specified short number will signal that he or she has started
parking.
When finished parking, he/she should send a 'STOP' message, and
the system computes the parking time and charges the appropriate
amount to the subscriber via his operator.

## How to Use

### `parking-server.js``

The node.js application logic.
Install the dependencies with:

    $ npm install express socket.io
    
Then run it with the command:

    $ node parking-server.js
		    
### `index.html`

The client management interface for the parking application.
It is served by the above script.
