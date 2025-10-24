/**
 * Converts a JavaScript object to a JSON string.
 *
 * @param {*} obj - The object to convert to a JSON string.
 * @param {(function|string[]|null|boolean)} [replace=false] - A replacer function, array of properties to include, or false for default behavior.
 * @param {number} [spaces=2] - The number of spaces to use for indentation in the output JSON string.
 * @returns {string|null} The JSON string representation of the object, or null if conversion fails.
 */
module.exports = function convertToJson(obj,replace=false,spaces=2) {
  try {
    return JSON.stringify(obj,replace,spaces)
  } catch (error) {
    console.error("Error converting object to JSON string:", error);
    return null;
  }
}
