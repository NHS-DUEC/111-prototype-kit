const fs = require("node:fs");
const path = require("node:path");

/**
 * Check whether a value is a plain object.
 *
 * @param {unknown} value - Value to evaluate.
 * @returns {boolean} True when the value is a non-null, non-array object.
 */
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Recursively merge source object keys into a target object.
 * Nested plain objects are deep-merged, while other values overwrite.
 *
 * @param {Record<string, any>} target - Base object.
 * @param {Record<string, any>} source - Object to merge into the base object.
 * @returns {Record<string, any>} The merged object.
 */
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

/**
 * Resolve the Nunjucks extension registration name for a loaded extension.
 *
 * @param {string} extensionPath - Absolute path to the extension module.
 * @param {unknown} extensionExport - Raw module export.
 * @param {object} extensionInstance - Instantiated extension object.
 * @returns {string} Extension name used when calling addExtension.
 */
function getExtensionName(extensionPath, extensionExport, extensionInstance) {
  if (typeof extensionExport === "function" && extensionExport.name) {
    return extensionExport.name;
  }

  const constructorName = extensionInstance?.constructor?.name;
  if (constructorName && constructorName !== "Object") {
    return constructorName;
  }

  return path.basename(extensionPath, ".js");
}

/**
 * Discover, instantiate and register all Nunjucks extensions in ./extensions.
 *
 * Each .js file can export either:
 * - a class or constructor function, or
 * - a pre-built extension object.
 *
 * @param {{ addExtension: (name: string, extension: object) => void }} env - Nunjucks environment.
 * @returns {void}
 * @throws {TypeError} When an extension module does not export a valid extension.
 */
exports.addExtensions = function (env) {
  const extensionsDirectory = path.join(__dirname, "extensions");
  const extensionFiles = fs
    .readdirSync(extensionsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .map((entry) => path.join(extensionsDirectory, entry.name))
    .sort();

  for (const extensionPath of extensionFiles) {
    const loadedExtension = require(extensionPath);
    const extensionExport = loadedExtension?.default ?? loadedExtension;
    const extensionInstance =
      typeof extensionExport === "function"
        ? new extensionExport()
        : extensionExport;

    if (!extensionInstance || typeof extensionInstance !== "object") {
      throw new TypeError(
        `Nunjucks extension "${extensionPath}" must export a class, constructor function, or object`,
      );
    }

    const extensionName = getExtensionName(
      extensionPath,
      extensionExport,
      extensionInstance,
    );
    env.addExtension(extensionName, extensionInstance);
  }
};
