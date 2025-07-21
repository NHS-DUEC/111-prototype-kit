// Use this file to change prototype configuration.
module.exports = {
	// Service name
	serviceName: '111 online',

	// Port to run nodemon on locally
	port: 2000,

	// Automatically stores form data, and send to all views
	useAutoStoreData: 'true',

	// Enable cookie-based session store (persists on restart)
	// Please note 4KB cookie limit per domain, cookies too large will silently be ignored
	useCookieSessionStore: 'false',

	// when true will log some useful variables to the template
	debug: true,

  // alias common layouts here
  layouts: {
    'base': '111/layouts/base.html',
    'question': '111/layouts/patterns/question.html',
    'component': '111/layouts/component.html',
    'check-your-symptoms': '111/layouts/check-your-symptoms.html',
    'date': '111/layouts/patterns/date.html',
  },

	// alias the paths to common embed templates
	displayComponentPath: '111/embeds/display_component.html',
	codeBlockPath: '111/embeds/code_block.html',

};
