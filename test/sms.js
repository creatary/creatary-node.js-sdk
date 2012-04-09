var sinon = require("sinon"), 
	assert = require("assert"), 
	test_load = require("../loader").load;


describe('Sms', function() {
	// it's not the final url which is used in real environment
	var SMS_SEND_URL = "https://telcoassetmarketplace.com/api/1/sms/send";
	
	var shared;
	var sms;
	var sandbox;
	
	before(function() {
		shared = test_load("shared");
		shared.apiURL = "https://telcoassetmarketplace.com/api/1/";
		sms = test_load("sms").init();
		sandbox = sinon.sandbox.create();
	})
	
	afterEach(function() {
		sandbox.restore();
	})

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
			var callback = function() {};
			// when
			sms.receive(callback);

			// then
			assert(stub.calledOnce);
			assert(stub.calledWith("http://localhost:80/sms"));
		})
		
		it("should listen on parameter URL", function() {
			// given
			var stub = sandbox.stub(shared.ServerUtil, "listen");
			var callback = function() {};
			// when
			sms.receive(callback, {
				url : "http://localhost:8181/listen"
			});

			// then
			assert(stub.calledOnce);
			assert(stub.calledWith("http://localhost:8181/listen"));
		})
		
		it("should call callback", function() {
			// given
			var api_response = {
				"to" : "to",
				"body" : "body",
				"access_token" : "access_token",
				"transaction_id" : "transaction_id",
				"token_secret" : "token_secret"
			};
			var stub = sandbox.stub(shared.ServerUtil, "listen", function(url, callback) {
				callback(api_response);
			});
			var callback = function(data) {
				assert.deepEqual(data, api_response);
			};
			
			// when
			sms.receive(callback);
			
			// then
			assert.equal(shared.oAuth1SecretTable["access_token"], "token_secret"); 
		})
		
		it("should log if response not valid", function() {
			// given
			var spy = sandbox.spy(shared.Logger, "warn");
			var stub = sandbox.stub(shared.ServerUtil, "listen", function(url, callback) {
				callback("this is not JSON");
			});
			var callback_spy = sinon.spy();
			
			// when
			sms.receive(callback_spy);
			
			// then
			assert(spy.calledOnce);
			assert.equal(callback_spy.callCount, 0);
		})
		
		it("should copy OAuthv2 access token", function(done) {
			// given
			shared.oAuthv2 = true;
			var api_response = {
				"oauthv2_access_token" : "oauth2_token",
			};
			var stub = sandbox.stub(shared.ServerUtil, "listen", function(url, callback) {
				callback(api_response);
			});
			var callback = function(data) {
				assert.equal("oauth2_token", data.access_token);
				done();
			};
			
			// when
			sms.receive(callback);
		})
	});
})