// ########################################################
// External dependancies
// ########################################################
const express = require("express");
const router = express.Router();

// ########################################################
// Your routes here
// ########################################################

// ########################################################
// 111 Prototype Kit Routes here
// ########################################################

// generic 111 prototype kit routes
router.use("/ep", require("./routes/ep"));

// generic 111 prototype kit routes
router.use(require("./lib/routes/ooo-routes"));

// ########################################################
module.exports = router;
// ########################################################
