
/**
 * Toggles point of view (POV) for pronouns based on the specified perspective.
 *
 * @param {string} povString - The point of view to use ('first-person' or 'third-person')
 * @param {string} word - The word/pronoun to potentially transform
 * @returns {string} The transformed word if in third-person mode and word matches a pronoun, otherwise returns the original word
 *
 * @example
 * togglePOV('third-person', 'you') // returns 'they'
 * togglePOV('third-person', 'your') // returns 'their'
 * togglePOV('first-person', 'you') // returns 'you'
 */
module.exports = function togglePOV(pov, word, replacementString) {
  if (pov === 'first-person' || pov === true) {
    return word;
  } else if (pov === 'third-person' || pov === false) {
    if (replacementString) {
      return replacementString;
    } else {
      switch (word) {
        case 'you':
          return 'they';
        case 'your':
          return 'their';
        case 'yours':
          return 'theirs';
        case 'yourself':
          return 'themselves';
        default:
          return word;
      }
    }
  } else {
    return word;
  }
}
