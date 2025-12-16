const express = require("express");
const router = express.Router();

/**
 * Catch-all POST route for handling redirect logic
 * within /versions only.
 */
router.post(/(.*)/, (req, res, next) => {
  const { redirectTo } = req.body;

  const cleaned =
    !Array.isArray(redirectTo) && typeof redirectTo === "string"
      ? redirectTo.trim()
      : "";

  // Default to the /versions root if nothing valid is supplied
  req.redirectTo = cleaned
    ? (cleaned.startsWith("/") ? cleaned : `/${cleaned}`)
    : `${req.baseUrl}/`;

  next();
}, (req, res) => {
  res.redirect(req.redirectTo || `${req.baseUrl}/`);
});

module.exports = router;
