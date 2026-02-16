/**
 * Retrieves the value from a nested object using a string path with bracket notation.
 *
 * @param {Object} obj - The object to retrieve the value from.
 * @param {string} path - The path string using bracket notation (e.g., "a[b][c]").
 * @returns {*} The value at the specified path, or undefined if the path is invalid or not found.
 */
function getValueFromPath(obj, path) {
  if (!path) return undefined;

  const keys = path
    .replace(/\]/g, "")
    .split("[")
    .filter(Boolean);

  return keys.reduce((current, key) => {
    if (current == null) return undefined;
    return current[key];
  }, obj);
}

module.exports = getValueFromPath;
