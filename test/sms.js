var sinon = require("sinon"), 
	assert = require("assert"), 
	test_load = require("../loader").load;

// it's not the final url which is used in real environment
var SMS_SEND_URL = "https://telcoassetmarketplace.com/api/sms/send";

var sms = test_load("sms.js");
var shared = test_load("shared.js");

describe('Sms', function() {
	
	var sandbox = sinon.sandbox.create();
	
	afterEach(function() {
		sandbox.restore();
	});
	
	describe(".send", function() {
		it('should post sms', function() {
			// given
			var stub = sandbox.stub(shared.OAuthUtil, "post");

			// when
			sms.send("token", "message");

			// then
			assert(stub.calledOnce);
			assert(stub.calledWith("token", SMS_SEND_URL, {
				body : 'message',
				from : undefined,
				transaction_id : undefined
			}));
		})
	});
	
	describe(".receive", function() {
		
		it("should listen on default", function() {
			// given
			var stub = sandbox.stub(shared.ServerUtil, "listen");
			var callback = function(){};
			
			// when
			sms.receive(callback);
			
			// then
			assert(stub.calledOnce);
			assert(stub.calledWith("http://localhost:80/sms"));
		});
		
		it("should listen on parameter URL", function() {
			// given
			var stub = sandbox.stub(shared.ServerUtil, "listen");
			var callback = function(){};
			
			// when
			sms.receive(callback, {
				url: "http://localhost:8181/listen"
			});
			
			// then
			assert(stub.calledOnce);
			assert(stub.calledWith("http://localhost:8181/listen"));
		});	
	});
})