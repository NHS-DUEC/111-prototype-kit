const config = require("./config");

module.exports = function (req, res, next) {
  res.locals.layouts = config.layouts;
  res.locals.debug = config.debug;
  res.locals.componentDoc = config.displayComponentPath;
  res.locals.codeBlock = config.codeBlockPath;
  next();
};
