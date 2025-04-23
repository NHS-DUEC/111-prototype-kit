// https://jhildenbiddle.github.io/mergician/
const { mergician } = require('mergician');

module.exports = function merge(...objects) {
	return mergician({
		appendArrays: false,
	})(...objects);
};
