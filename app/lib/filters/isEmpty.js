/**
 * Checks if the provided value is considered "empty".
 * A value is considered empty if it is:
 *   - undefined
 *   - null
 *   - an empty string (after trimming whitespace)
 *   - an empty array
 *   - an empty object (no own enumerable properties)
 *
 * @param {*} value - The value to check for emptiness.
 * @returns {*} Returns `undefined` if the value is empty, otherwise returns the original value.
 */
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
