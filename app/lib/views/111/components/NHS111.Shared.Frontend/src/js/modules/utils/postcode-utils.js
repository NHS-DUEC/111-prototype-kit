function lastIndexOfDigit(str) {
  const lastIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) =>
    str.lastIndexOf(digit)
  );
  const indices = lastIndices.sort((a, b) => {
    return a - b;
  });
  return indices[indices.length - 1];
}

export function getPartPostCode(postcode) {
  const postcodeWithoutWhitespace = postcode.replace(/\s/g, "");

  if (postcodeWithoutWhitespace.length - 3 <= 1)
    return postcodeWithoutWhitespace;

  const lastDigit = lastIndexOfDigit(postcodeWithoutWhitespace);

  if (lastDigit === -1) {
    return postcodeWithoutWhitespace;
  }

  if (lastDigit < postcodeWithoutWhitespace.length - 1)
    return postcodeWithoutWhitespace.substring(0, lastDigit);

  return postcodeWithoutWhitespace;
}
