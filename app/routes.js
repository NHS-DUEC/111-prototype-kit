// External dependencies
const express = require('express');
const router = express.Router();
const config = require('./config.js');

// make some basic request information available to views
router.all('*', (req, res, next) => {
	const { path, params, originalUrl, body } = req;
	let pathClasses;

	/**
	 * Checks if the provided `path` string is non-empty and processes it to build a dashed string.
	 *
	 * The code does the following:
	 * 1. Verifies that the `path` string has a non-zero length.
	 * 2. Splits the `path` by the "/" character into an array of segments.
	 * 3. Filters out any empty segments that may result from leading or trailing slashes.
	 * 4. Iterates through the filtered segments and builds a string (`pathClasses`)
	 *    by concatenating each segment, inserting a dash ("-") between segments.
	 *
	 * Example:
	 *   If path = "/foo/bar/", the resulting `pathClasses` will be "foo-bar".
	 */
	if (path.length) {
		path
			.split('/')
			.filter((segment) => segment !== '')
			.forEach((segment, index, array) => {
				// Append the current segment to the result string.
				pathClasses += segment;
				// Append a dash if it is not the last segment.
				if (index < array.length - 1) {
					pathClasses += '-';
				}
			});
	}

	res.locals.req = { path, params, originalUrl, body };
	res.locals.pathClasses = pathClasses;
	res.locals.defaults = {
		layout: {
			file: config.defaults.layout,
		},
	};

	next();
});

// if edge page requested anywhere in this app render the edge.html page
router.get(/(^|\/)_edge(\/|$)/, (req, res) => {
	res.render('edge.html');
});

module.exports = router;
