const fs = require('fs');
const path = require('path');
const filters = {};
// the name of filters directory containing modules
const modulesPath = path.join(__dirname, 'lib/filters');

const loadFilters = function (directoryPath, targetObject) {
	// Read files synchronously for simplicity
	const files = fs.readdirSync(directoryPath);
	files.forEach((file) => {
		if (path.extname(file) === '.js') {
			// Use the file name without extension as the key
			const moduleName = path.basename(file, '.js');
			const filePath = path.join(directoryPath, file);
			// Attach the required module as a property of the filters object
			targetObject[moduleName] = require(filePath);
			console.log(`Loaded module: ${moduleName}`);
		}
	});
};

// Load the modules into the filter object
loadFilters(modulesPath, filters);

module.exports = function (env) {
	return filters;
};
