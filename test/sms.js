var sinon = require("sinon"),
	assert = require("assert"),
	test_load = require("../loader").load;
	
var SMS_URL = "https://telcoassetmarketplace.com/api/sms/send";

describe('sms', function() {

	var sms = test_load("sms.js");
	var shared = test_load("shared.js");

	it('should post sms', function() {

		// given
		var stub = sinon.stub(shared.OAuthUtil, "post");

		// when
		sms.send("token", "message");

		// then
		assert(stub.calledOnce);
		assert(stub.calledWith("token", SMS_URL, {
			body : 'message',
			from : undefined,
			transaction_id : undefined
		}));
	})
})
