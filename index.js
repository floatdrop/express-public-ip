'use strict';

var forwarded = require('forwarded');
var ip = require('ip');

module.exports = function (opts) {
	opts = opts || {};

	return function expressPublicIp(req, res, next) {
		var addresses = forwarded(req);
		req.headers['x-forwarded-for'] = addresses.filter(ip.isPublic).join(', ');
		next();
	};
};
