var express = require('express');
var router = express.Router();
const config = require('../../config.js');
var sessionDataDefaults = require('../../data/session-data-defaults');

// ################################################
// MISC
// ################################################

/**
 * Checks if the provided `path` string is non-empty and processes it to build a dashed string.
 * to be used as a dynmaic css-class name on the body tag
 *
 * The code does the following:
 * 1. Verifies that the `path` string has a non-zero length.
 * 2. Splits the `path` by the "/" character into an array of segments.
 * 3. Filters out any empty segments that may result from leading or trailing slashes.
 * 4. Iterates through the filtered segments and builds a string (`pathclasses`)
 *    by concatenating each segment, inserting a dash ("-") between segments.
 *
 * Example:
 *   If path = "/foo/bar/", the resulting `pathclasses` will be "foo-bar".
 */
const createPathClass = (path) => {
	let pathclasses = '';
	path
		.split('/')
		.filter((segment) => segment !== '')
		.forEach((segment, index, array) => {
			// Append the current segment to the result string.
			pathclasses += segment;
			// Append a dash if it is not the last segment.
			if (index < array.length - 1) {
				pathclasses += '-';
			}
		});
	return pathclasses;
};

// make some request information available to views
router.all(/(.*)/, (req, res, next) => {
	// obtain some values from the request object
	const { path, params, originalUrl, body } = req;

	if (path.length) {
		res.locals.pathclasses = createPathClass(path);
	}

	// send some request details to the view
	res.locals.request = { path, params, originalUrl };

  // create a layouts object from config
	res.locals.layouts = config.layouts;

	next();
});

// if edge page requested anywhere in this app render the edge.html page
router.get(/(.*)/, (req, res, next) => {
  if (/(^|\/)_edge(\/|$)/.test(req.path)) {
    return res.render('edge.html');
  }
  next();
});

router.get('/reset-session', (req, res) => {
	req.session.data = {};
	Object.assign(req.session.data, sessionDataDefaults);
	res.redirect('/');
});

module.exports = router;
