/**
 * Converts point-of-view specific words based on the desired POV.
 *
 * @param {'first-person' | 'third-person' | boolean} pov - Desired POV or boolean flag for first-person (true) or third-person (false).
 * @param {string} word - The original word to potentially replace.
 * @param {string} [replacementString] - Optional explicit replacement that overrides default mappings.
 * @returns {string} The original word or its POV-appropriate replacement.
 */
const config = require('../../config.js');

const defaultReplacements = {
  you: 'they',
  your: 'their',
  yours: 'theirs',
  yourself: 'themselves',
};

module.exports = function togglePOV(pov, word, replacementString) {
  if (pov === 'first-person' || pov === true) {
    return word;
  } else if (pov === 'third-person' || pov === false) {
    if (replacementString) {
      return replacementString;
    } else {
      const configReplacements = config?.togglePOV?.replacements;
      const replacements = {
        ...defaultReplacements,
        ...(configReplacements || {}),
      };
      return replacements[word] || word;
    }
  } else {
    return word;
  }
}
