const EmbedExtension = require("./extensions/embed");
const RepeatExtension = require("./extensions/repeat");

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isObject(targetValue) && isObject(sourceValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  }

  return result;
}

exports.deepMerge = deepMerge;

exports.addExtensions = function (env) {
  // register it under the name “embed”
  env.addExtension("EmbedExtension", new EmbedExtension());
  env.addExtension("RepeatExtension", new RepeatExtension());
};
