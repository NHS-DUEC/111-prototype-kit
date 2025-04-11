// External dependencies
const express = require('express');
const router = express.Router();

router.use('/components', require('./lib/routes/components'));
router.use('/', require('./lib/routes/misc'));

module.exports = router;
