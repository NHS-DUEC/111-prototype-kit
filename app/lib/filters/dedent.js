module.exports = function dedent(str) {
  if (!str) return str;

  const lines = str.split('\n');

  // Find leading whitespace from the first non-empty line
  const firstNonEmpty = lines.find(line => line.trim().length > 0);
  if (!firstNonEmpty) return str;

  const leadingWhitespace = firstNonEmpty.match(/^(\s*)/)[0].length;

  // Remove up to that amount of leading whitespace from each line
  const dedentedLines = lines.map(line => {
    return line.replace(new RegExp(`^\\s{0,${leadingWhitespace}}`), '');
  });

  return dedentedLines.join('\n');
}
