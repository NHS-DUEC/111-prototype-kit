const { getPartPostCode } = require("./postcode-utils");

describe("getPartPostCode method", () => {
  test.each([
    { input: "AA9A 9AA", expected: "AA9A" },
    { input: "A9A 9AA", expected: "A9A" },
    { input: "A9 9AA", expected: "A9" },
    { input: "A99 9AA", expected: "A99" },
    { input: "AA9 9AA", expected: "AA9" },
    { input: "AA99 9AA", expected: "AA99" },
    { input: "AA0 0AA", expected: "AA0" },
    { input: "AA0 1AA", expected: "AA0" },
    { input: "AA1 0AA", expected: "AA1" },
    { input: "SW1A 0AA", expected: "SW1A" },
    { input: "AA9A", expected: "AA9A" },
    { input: "A9A", expected: "A9A" },
    { input: "A9", expected: "A9" },
    { input: "A99", expected: "A99" },
    { input: "AA9", expected: "AA9" },
    { input: "AA99", expected: "AA99" },
    { input: "AA0", expected: "AA0" },
    { input: "AA0", expected: "AA0" },
    { input: "AA1", expected: "AA1" },
    { input: "SW1A", expected: "SW1A" },
  ])(
    "returns correct partial postcode ($expected) for input postcode ($input)",
    ({ input, expected }) => {
      expect(getPartPostCode(input)).toBe(expected);
    }
  );
});
