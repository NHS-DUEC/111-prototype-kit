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
