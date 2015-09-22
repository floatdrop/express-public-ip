'use strict';

var assert = require('assert');
var expressPublicIp = require('./');

function createReq(socketAddr, headers) {
	return {
		connection: {
			remoteAddress: socketAddr
		},
		headers: headers || {}
	};
}

var privateAddresses = [
	'192.168.1.1',
	'172.30.16.189',
	'10.46.244.1',
	'127.0.0.1',
	'10.0.0.94',
	'172.16.2.236'
];

it('should filter private addresses', function () {
	privateAddresses.forEach(function (ip) {
		var req = createReq('127.0.0.1', {'x-forwarded-for': ip});
		expressPublicIp()(req, {}, function () {
			assert.equal(req.headers['x-forwarded-for'], '');
		});
	});
});

it('should keep public address', function () {
	var req = createReq('127.0.0.1', {'x-forwarded-for': '172.16.2.236, 1.3.3.7'});
	expressPublicIp()(req, {}, function () {
		assert.equal(req.headers['x-forwarded-for'], '1.3.3.7');
	});
});
