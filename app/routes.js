// ########################################################
// External dependancies
// ########################################################
const express = require("express");
const router = express.Router();

// ########################################################
// Your routes here (line 10)
// ########################################################

// ########################################################
// 111 Prototype Kit Routes - keep these at the end of this
// file so they don't get in the way of your custom routes
// ########################################################

// Example Emergency Prescription routes - these are used
// in the EP section of the prototype
router.use("/ep", require("./routes/ep"));

// generic 111 prototype kit routes
router.use(require("./lib/routes/ooo-routes"));

// ########################################################
module.exports = router;
// ########################################################
