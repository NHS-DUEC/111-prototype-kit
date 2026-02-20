/**
 * Apply common template locals for each request.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {object} config - App config module.
 * @returns {void}
 */
module.exports = function applyLocals(req, res, config) {
  res.locals.isFirstPerson = req.session?.data?.pov === "first-person";
  res.locals.layouts = config.layouts;
  res.locals.debug = config.debug;
  res.locals.componentDoc = config.displayComponentPath;
  res.locals.codeBlock = config.codeBlockPath;
};
