const config = require("./config");
const applyLocals = require("./lib/locals");

module.exports = function (req, res, next) {
  // these are default 111 prototype kit locals, which are applied to every request
  applyLocals(req, res, config);

  // ###############################################################
  // add your own custom locals here, for example:
  // res.locals.myValue = "some value";
  // which can be used in your views/templates as {{ myValue }}
  // ###############################################################

  res.locals.myValue = "some value";

  // ###############################################################
  // keep this at the end of the function to ensure all locals are
  // applied before rendering views
  // ###############################################################
  next();
};
