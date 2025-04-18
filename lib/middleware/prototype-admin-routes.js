const express = require('express');

const router = express.Router();

const password = process.env.PROTOTYPE_PASSWORD;

const { encryptPassword } = require('../utils');

router.get('/password', (req, res) => {
	const returnURL = req.query.returnURL || '/';
	const { error } = req.query;
	res.render('password', {
		returnURL,
		error,
	});
});

// Check authentication password
router.post('/password', (req, res) => {
	const submittedPassword = req.body.password;
	const { returnURL } = req.body;

	if (submittedPassword === password) {
		// see lib/middleware/authentication.js for explanation
		res.cookie('authentication', encryptPassword(password), {
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
			sameSite: 'None', // Allows GET and POST requests from other domains
			httpOnly: true,
			secure: true,
		});
		res.redirect(returnURL);
	} else {
		res.redirect(`/prototype-admin/password?error=wrong-password&returnURL=${encodeURIComponent(returnURL)}`);
	}
});

router.get('/reset-session-data', (req, res) => {
	res.locals.referrer = req.get('Referrer');
	res.render('reset-session-data');
});

router.all('/reset-session-data', (req, res) => {
	let referrer = req.session.data.refurl;
	req.session.data = {};
	res.redirect(referrer);
});

module.exports = router;
