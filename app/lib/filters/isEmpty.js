module.exports = function isEmpty(value) {
	if (
		value === undefined ||
		value === null ||
		(typeof value === 'string' && value.trim() === '') ||
		(Array.isArray(value) && value.length === 0) ||
		(typeof value === 'object' && Object.keys(value).length === 0)
	) {
		return undefined;
	}
	return value;
};
