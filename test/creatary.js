var sinon = require("sinon"), 
	assert = require("assert"),
	nock = require("nock"),
	http = require("http"),
	test_load = require("../loader").load;

var HOST = "https://telcoassetmarketplace.com";
var URL_SMS_SEND = "/api/1/sms/send";
var URL_OAUTH2_SMS_SEND = "/api/2/sms/send";
var URL_OAUTH2_ACCESS = "/api/2/oauth/token";
var URL_LOCATION = "/api/1/location/getcoord";

var creatary = test_load("creatary.js");
var shared = test_load("shared.js");

describe('Creatary', function() {
	
	var consumerKey = "consumerKey";
	var consumerSecret = "consumerSecret";
	creatary.init(consumerKey, consumerSecret);
	
	var sandbox = sinon.sandbox.create();
	var http_client = http.createClient(8181, 'localhost');
	var http_mock;

	afterEach(function() {
		sandbox.restore();
	});
	
	after(function() {
		nock.restore();
	})

	describe("Init", function() {
		it("should expose the proper interfaces", function() {
			assert.ok(creatary.init);
			assert.ok(creatary.Location);
			assert.ok(creatary.Sms);
			assert.ok(creatary.OAuth);
			assert.ok(creatary.Charging === undefined);
			assert.ok(Object.keys(creatary).length == 4);
		})
	})
	
	describe("Sms", function() {
		it("should send sms", function() {
			// given
			creatary.init(consumerKey, consumerSecret);
			creatary.OAuth.setSecretToken("toToken", "toSecret");
			var mock = nock(HOST)
			   .post(URL_SMS_SEND, {"body":"msg"})
			   .reply(200, {});
			
			// when
			creatary.Sms.send("toToken", "msg");
			mock.done();
		})
	
		it("should send sms with OAuth2", function() {
			// given
			creatary.init(consumerKey, consumerSecret, {
				oAuth2: true
			});
			var mock = nock(HOST)
			   .post(URL_OAUTH2_SMS_SEND + "?access_token=toToken", {"body":"msg"})
			   .reply(200, {});
			
			// // when
			creatary.Sms.send("toToken", "msg");
			mock.done();
		})
		
		it("should receive sms", function(done) {
			// given
			creatary.init(consumerKey, consumerSecret);
			
			var incoming_sms = {
				"to":"[to]",
				"body":"[body]",
				"access_token":"[access_token]",
				"transaction_id":"[transaction_id]",
				"token_secret":"[token_secret]"
			};
			
			var callback = function(params) {
				assert.deepEqual(params, incoming_sms);
				done();
			}
			
			creatary.init(consumerKey, consumerSecret, {
				receiveSms: {
			        url: 'http://localhost:8181/creatary/sms',
    				callBack: callback
				}
			});
			
			// when
			var request = http_client.request('POST', '/creatary/sms', {
				'Content-Type': 'application/json'
			});
			request.write(JSON.stringify(incoming_sms));
			request.end();
		})
	})
	
	describe("Location", function() {
		it("should request location", function(done) {
			// given
			creatary.init(consumerKey, consumerSecret, {
				
			});
			creatary.OAuth.setSecretToken("toToken", "toSecret");
			
			var current_location = {
			    "latitude":52.52349,
			    "longitude":13.34294,
			    "accuracy":200, 
			    "timestamp":1288747339000
			};
			
			var callback = function(params) {
				assert.deepEqual(params, current_location);
				done();
			}
			
			var mock = nock(HOST)
			   .get(URL_LOCATION, "")
			   .reply(200, {
  					"status": {
    					"code":"0",
    					"message":"Request was handled succesfully" 
  					},
					"body": current_location
				});
				
			// when
			creatary.Location.getCoordinates("toToken", callback);
		})
	})
	
	describe("OAuth2", function() {
		it("should request access token", function() {
			// given
			creatary.init(consumerKey, consumerSecret, {
				oAuth2: true
			});
			
			var mock = nock(HOST)
			   .post(URL_OAUTH2_ACCESS, "client_id=consumerKey&client_secret=consumerSecret&grant_type=authorization_code&code=my_code")
			   .reply(200, {});
			   
			// when
			creatary.OAuth.getAccessToken("my_code");
			
			// then
			mock.done();
		});
	});
});