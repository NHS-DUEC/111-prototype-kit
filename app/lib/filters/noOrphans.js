const _ = require('lodash');

/**
 * Insert non-breaking space between the last two words of a string. This
 * prevents an orphaned word appearing by itself at the end of a paragraph.
 *
 * @example noOrphans('Cabinet Office') // Cabinet&nbspOffice
 * @param {string} string - Value to transform
 * @returns {string} `string` with non-breaking space inserted
 */
module.exports = function noOrphans(string) {

  const indexOfLastSpace = string.lastIndexOf(' ')

  // If there’s only one word, we don’t need this filter
  if (indexOfLastSpace === -1) {
    return string
  }

  const begin = string.substring(0, indexOfLastSpace)
  const end = string.substring(indexOfLastSpace + 1)
  return `${begin}&nbsp;${end}`
}
