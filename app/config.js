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
    'component': '111/layouts/component.html',
    'start': '111/layouts/start.html',
    'check-your-symptoms': '111/layouts/check-your-symptoms.html',
    'question': '111/layouts/patterns/question.html',
    'date': '111/layouts/patterns/date.html',
    'yesno': '111/layouts/patterns/yes-no.html',
    'radios': '111/layouts/patterns/radios.html',
    'checkboxes': '111/layouts/patterns/checkboxes.html',
    'modzero': '111/layouts/patterns/confirm-it-is-not.html',
    'postcode': '111/layouts/patterns/postcode.html',
    'optionsList': '111/layouts/patterns/choose-an-option.html',
    'textinput': '111/layouts/patterns/text-input.html'
  },

  // alias the paths to common embed templates
	displayComponentPath: '111/embeds/display_component.html',
	codeBlockPath: '111/embeds/code_block.html',

  // Configure point-of-view replacements for the togglePOV filter
  togglePOV: {
    replacements: {
      "you": 'they',
      "your": 'their',
      "yours": 'theirs',
      "I": 'they',
      "I'm": 'they are',
      "was": 'were',
      "my": 'their',
      "yourself": 'themselves'
    }
  }

}
