module.exports = function convertToJson(obj,replace=false,spaces=2) {
  try {
    return JSON.stringify(obj,replace,spaces)
  } catch (error) {
    console.error("Error converting object to JSON string:", error);
    return null;
  }
}
