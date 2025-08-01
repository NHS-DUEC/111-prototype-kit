// ########################################################
// External dependancies
// ########################################################
const express = require('express');
const router = express.Router();

// ########################################################
// Your routes beneath here
// ########################################################

router.use('/version-1', require('./routes/version-1'));

// ########################################################
module.exports = router;
// ########################################################
