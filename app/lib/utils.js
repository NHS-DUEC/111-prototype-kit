const fs = require("node:fs");
const path = require("node:path");
const templateRoots = [
  path.join(__dirname, "../views"),
  path.join(__dirname, "views"),
];

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
 * Normalise a request path into a safe, relative template path.
 *
 * @param {string} requestPath - URL path from the request.
 * @returns {string | null} Relative path, empty string for root, or null when unsafe.
 */
function normalizeTemplatePath(requestPath) {
  const trimmed = String(requestPath || "").replace(/^\/+|\/+$/g, "");
  if (!trimmed) return "";

  const segments = trimmed.split("/").filter(Boolean);
  if (segments.some((segment) => segment === "..")) return null;

  return segments.join("/");
}

/**
 * Determine whether a relative path maps to an existing template directory.
 *
 * @param {string} relativePath - Relative template path.
 * @returns {boolean} True when a matching directory exists in a template root.
 */
function isExistingTemplateDirectory(relativePath) {
  if (!relativePath) return false;

  return templateRoots.some((root) => {
    const absolutePath = path.join(root, relativePath);
    return (
      fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()
    );
  });
}

/**
 * Determine whether a relative path maps to an existing template file.
 *
 * @param {string} relativePath - Relative template path without extension.
 * @returns {boolean} True when a matching `.html` template exists in a template root.
 */
function isExistingTemplateFile(relativePath) {
  if (!relativePath) return false;

  return templateRoots.some((root) => {
    return fs.existsSync(path.join(root, `${relativePath}.html`));
  });
}

/**
 * Decide if a request should be canonicalised to a trailing-slash URL.
 *
 * Redirects only for GET/HEAD routes that map to a template directory,
 * and skips file-like paths and paths that already map to concrete `.html` pages.
 *
 * @param {{ method?: string, path?: string }} requestLike - Request-like object.
 * @returns {boolean} True when the request should be redirected.
 */
function shouldRedirectToTrailingSlash(requestLike) {
  const method = String(requestLike?.method || "").toUpperCase();
  const requestPath = String(requestLike?.path || "");

  if (method !== "GET" && method !== "HEAD") return false;
  if (requestPath === "/" || requestPath.endsWith("/")) return false;
  if (requestPath.includes(".")) return false;

  const relativePath = normalizeTemplatePath(requestPath);
  if (!relativePath) return false;
  if (isExistingTemplateFile(relativePath)) return false;

  return isExistingTemplateDirectory(relativePath);
}

exports.normalizeTemplatePath = normalizeTemplatePath;
exports.isExistingTemplateDirectory = isExistingTemplateDirectory;
exports.isExistingTemplateFile = isExistingTemplateFile;
exports.shouldRedirectToTrailingSlash = shouldRedirectToTrailingSlash;

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
