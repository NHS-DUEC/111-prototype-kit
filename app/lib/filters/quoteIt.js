module.exports = function quoteIt(input) {
	// Check if input is a string (this condition also covers string primitives)
	if (typeof input === 'string' || input instanceof String) {
		return `'${input}'`; // Return the string wrapped in single quotes
	}
	// Return the argument as is if it's not a string
	return input;
};
