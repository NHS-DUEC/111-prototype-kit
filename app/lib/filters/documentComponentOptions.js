module.exports = function objectToKeyValueArray(obj) {
  // Use Object.entries to get an array of [key, value] pairs from the object.
  // Then map each pair to an object with "key" and "value" properties.
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
}
