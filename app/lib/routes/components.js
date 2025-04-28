var express = require('express');
var router = express.Router();

// ################################################
// components routes
// ################################################

router.all(/(.*)/, (req, res, next) => {
	res.locals.component = {};
	next();
});

module.exports = router;
