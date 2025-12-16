var express = require('express');
var router = express.Router();
const config = require('../../config.js');

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

  // this is to help render prototype as though it is running in the NHS App
  if(req.session.data.appframe == 'true') {
    res.locals.appframe = true;
  } else {
    res.locals.appframe = false;
  }

	// send some request details to the view
	res.locals.request = { path, params, originalUrl };

  // create a layouts object from config
	res.locals.layouts = config.layouts;

	next();
});

router.post('/settings', (req, res) => {
  // toggle the appframe value in the session
  // req.session.data.appframe = req.session.data.appframe === 'true' ? 'false' : 'true';
  res.redirect(req.get('referer') || '/');
});

// if edge page requested anywhere in this app render the edge.html page
router.get(/(.*)/, (req, res, next) => {
  if (/(^|\/)_edge(\/|$)/.test(req.path)) {
    return res.render('edge.html');
  }
  next();
});


/**
 * Catch-all POST route for handling redirect logic.
 *
 * Skips execution entirely when the current request path matches one of the
 * entries in ignorePaths.
 *
 * Behavior:
 * - If req.path is in ignorePaths: falls through to next middleware without redirect.
 * - Else:
 *   - Extracts redirectTo from req.body.
 *   - Ignores redirectTo when it is an array or falsy.
 *   - Redirects to the cleaned value (empty string becomes "/").
 *
 * @constant {string[]} ignorePaths - Exact paths to skip.
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @example
 * // To ignore /settings and /health:
 * const ignorePaths = ['/settings', '/health'];
 */
const ignorePaths = [
  '/settings',
  '/reset',
  '/reset-session-data',
  '/reset-done',
  '/password',
  '/prototype-admin',
  '/prototype-admin/password'
];

router.post(/(.*)/, (req, res, next) => {
  if (ignorePaths.includes(req.path)) {
    return next(); // skip redirect logic
  }
  const { redirectTo } = req.body;
  req.redirectTo = (!Array.isArray(redirectTo) && redirectTo) ? redirectTo : '';
  next();
}, (req, res) => {
  return res.redirect(req.redirectTo || '/');
});

// supress dev tools 404
router.use('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end();
});

module.exports = router;
