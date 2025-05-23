/**
 * Merges multiple objects into a single object using the `mergician` library.
 * Arrays are not appended; later values overwrite earlier ones.
 *
 * @function
 * @param {...Object} objects - The objects to merge.
 * @returns {Object} The merged object.
 */

// https://jhildenbiddle.github.io/mergician/
const { mergician } = require('mergician');

module.exports = function merge(...objects) {
  return mergician({
    appendArrays: false
  })(...objects);
};
