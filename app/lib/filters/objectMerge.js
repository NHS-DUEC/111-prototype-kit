// https://jhildenbiddle.github.io/mergician/
const { mergician } = require('mergician');

module.exports = function objectMerge(...objects) {
	return mergician({
		appendArrays: false,
	})(...objects);
};
