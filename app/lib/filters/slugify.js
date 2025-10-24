module.exports = function slugify(text) {
  return text
    .toString()
    .normalize('NFKD')                    // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '')      // Remove diacritics
    .toLowerCase()                        // Convert to lowercase
    .trim()                               // Remove leading/trailing whitespace
    .replace(/[^a-z0-9]+/g, '-')          // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '');             // Remove leading/trailing hyphens
}
