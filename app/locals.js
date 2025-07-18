module.exports = (config) => (req, res, next) => {
	res.locals.serviceName = config.serviceName;
	res.locals.debug = config.debug;
	res.locals.componentDoc = config.displayComponentPath;
  res.locals.codeBlock = config.codeBlockPath;
	next();
};
