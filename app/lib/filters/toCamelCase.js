module.exports = function toCamelCase(text) {
  return text
    .toString()
    .normalize('NFKD')                    // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '')      // Remove diacritics
    .toLowerCase()
    .trim()
    .match(/[a-z0-9]+/g)                  // Extract words
    // Check if match result is not null before mapping
    ? text
        .toString()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .match(/[a-z0-9]+/g)
        .map((word, index) =>
          index === 0
            ? word
            : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('')
    : '';
}
