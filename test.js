'use strict';

var assert = require('assert');
var expressPublicIp = require('./');

function createReq(xff) {
	return {
		headers: {
			'x-forwarded-for': xff
		}
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
		var req = createReq(ip);
		expressPublicIp()(req, {}, function () {
			assert.equal(req.headers['x-forwarded-for'], '');
		});
	});
});

it('should keep public address', function () {
	var req = createReq('172.16.2.236, 1.3.3.7');
	expressPublicIp()(req, {}, function () {
		assert.equal(req.headers['x-forwarded-for'], '1.3.3.7');
	});
});

it('should remove not ip-like stuff', function () {
	var req = createReq('wow, 1.3.3.7');
	expressPublicIp()(req, {}, function () {
		assert.equal(req.headers['x-forwarded-for'], '1.3.3.7');
	});
});

it('should keep x-forwarded-for order', function () {
	var req = createReq('1.3.3.8, 1.3.3.7');
	expressPublicIp()(req, {}, function () {
		assert.equal(req.headers['x-forwarded-for'], '1.3.3.8, 1.3.3.7');
	});
});
