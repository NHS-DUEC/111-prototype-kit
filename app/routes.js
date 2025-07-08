// ########################################################
// External dependancies
// ########################################################
const express = require('express');
const router = express.Router();

// ########################################################
// 111 online prototype kit shared routes
// ########################################################
router.use('/components', require('./lib/routes/components'));
router.use('/', require('./lib/routes/misc'));

// ########################################################
// Your routes beneath here
// ########################################################


// ########################################################
// End and export routes
// ########################################################
module.exports = router;
