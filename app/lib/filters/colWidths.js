/**
 * Returns an object containing the primary and secondary column widths
 * based on the provided width key. Supported width keys are:
 * 'two-thirds', 'one-third', 'one-half', 'one-quarter', and 'three-quarters'.
 * If the width key is not recognized, an empty object is returned.
 *
 * @param {string} width - The key representing the desired column width.
 * @returns {{primary_col_width: string, secondary_col_width: string}|{}}
 *   An object with `primary_col_width` and `secondary_col_width` properties,
 *   or an empty object if the width key is not supported.
 */
function colWidthsFilter(width) {
  const widths = {
    'two-thirds': { primary_col_width: 'two-thirds', secondary_col_width: 'one-third' },
    'one-third': { primary_col_width: 'one-third', secondary_col_width: 'two-thirds' },
    'one-half': { primary_col_width: 'one-half', secondary_col_width: 'one-half' },
    'one-quarter': { primary_col_width: 'one-quarter', secondary_col_width: 'three-quarters' },
    'three-quarters': { primary_col_width: 'three-quarters', secondary_col_width: 'one-quarter' },
  };

  return widths[width] || {};
}

module.exports = colWidthsFilter
