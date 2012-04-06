var sinon = require("sinon"), 
	assert = require("assert"), 
	test_load = require("../loader").load;

// it's not the final url which is used in real environment
var LOCATION_URL = "https://telcoassetmarketplace.com/api/location/getcoord";

var location = test_load("location.js");
var shared = test_load("shared.js");

describe('Location', function() {

	var sandbox = sinon.sandbox.create();

	afterEach(function() {
		sandbox.restore();
	});

	describe(".getCoordinates", function() {
		
		it("should call oauth", function() {
			// given
			var callback_spy = sinon.spy();
			var stub = sandbox.stub(shared.OAuthUtil, "get");
			
			// when
			location.getCoordinates("toToken", callback_spy);
			
			// then
			stub.calledWith("toToken", LOCATION_URL, callback_spy);
		})
		
		it("should call callback", function(done) {
			// given
			var current_location = {
			    "latitude":52.52349,
			    "longitude":13.34294,
			    "accuracy":200, 
			    "timestamp":1288747339000
			};
			var response = {
				"status": {
					"code":"0",
					"message":"Request was handled succesfully" 
				},
				"body": current_location
			};
			var stub = sandbox.stub(shared.OAuthUtil, "get", function(toToken, sendURL, myCb) {
				myCb({}, JSON.stringify(response));
			});
			var callback_spy = sinon.spy(function(resp) {
				assert.deepEqual(resp, current_location);
				done();
			});
			
			// when
			location.getCoordinates("toToken", callback_spy);
		})
		
		it("should log if response not valid", function() {
			// given
			var spy = sandbox.spy(shared.Logger, "warn");
			var stub = sandbox.stub(shared.OAuthUtil, "get", function(toToken, sendURL, myCb) {
				myCb({}, "500 Internal Server Error");
			});
			var callback_spy = sinon.spy();
			
			// when
			location.getCoordinates("toToken", callback_spy);
			
			// then
			assert(spy.calledOnce);
			assert.equal(callback_spy.callCount, 0);
		})
		
	})
	
});