/**
 * togglePOV uses an object-based config.
 *
 * Template usage:
 *   {{ "Text with your words" | togglePOV({ pov: isFirstPerson }) }}
 *   {{ "Text with your words" | togglePOV({ word: "your", pov: isFirstPerson }) }}
 *   {{ "you" | togglePOV({ word: "you", replacement: "them", pov: isFirstPerson }) }}
 *
 * Config keys:
 *   pov: 'first-person' | 'third-person' | true | false
 *   word: optional search term for targeted replacement
 *   replacement: optional replacement override for `word`
 *   wholeWord: default true
 *   caseInsensitive: default true
 *   caseMode: 'preserve' | 'lower' | 'upper'
 *
 * POV resolution:
 * 1) explicit `pov` (string or boolean)
 * 2) `ctx.data.answers.pov` (session answers)
 * 4) context fallbacks (`ctx.isFirstPerson`, `ctx.data.pov`, ...)
 */
const config = require("../../config.js");

const defaultReplacements = {
  // second-person -> third-person plural
  you: "they",
  your: "their",
  yours: "theirs",
  yourself: "themselves",

  // first-person -> third-person plural
  i: "they",
  me: "them",
  my: "their",
  mine: "theirs",
  myself: "themselves",
  "i'm": "they're",
  "i’ve": "they’ve",
  "i'd": "they’d",
  "i’ll": "they’ll",
  "i’m": "they’re", // curly apostrophe
};

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyCase(source, target, caseMode = "preserve") {
  const s = String(source);
  const t = String(target);

  if (caseMode === "lower") return t.toLowerCase();
  if (caseMode === "upper") return t.toUpperCase();

  // Single-letter tokens like "I" should behave like Title Case, not ALL CAPS.
  if (s.length === 1) {
    return t[0].toUpperCase() + t.slice(1).toLowerCase();
  }

  if (s === s.toUpperCase()) return t.toUpperCase();

  if (s[0] === s[0].toUpperCase() && s.slice(1) === s.slice(1).toLowerCase()) {
    return t[0].toUpperCase() + t.slice(1).toLowerCase();
  }

  return t.toLowerCase();
}

function getReplacements() {
  const configReplacements = config?.togglePOV?.replacements;
  return { ...defaultReplacements, ...(configReplacements || {}) };
}

function resolveReplacement(searchLower, replacementString) {
  if (replacementString !== undefined) return String(replacementString);
  const replacements = getReplacements();
  return replacements[searchLower] ?? searchLower;
}

function supportsLookbehind() {
  try {
    // eslint-disable-next-line no-new
    new RegExp("(?<!a)b");
    return true;
  } catch {
    return false;
  }
}

function buildPattern(search, { wholeWord, useLookbehindBoundaries }) {
  const escaped = escapeRegExp(search);

  if (!wholeWord) return escaped;

  if (useLookbehindBoundaries) {
    return `(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`;
  }

  // Fallback for runtimes without lookbehind support.
  return `(^|[^A-Za-z0-9_])(${escaped})(?![A-Za-z0-9_])`;
}

function replaceAllInString(text, search, baseReplacement, options) {
  const {
    wholeWord = true,
    caseInsensitive = true,
    caseMode = "preserve",
  } = options || {};

  const useLookbehindBoundaries = supportsLookbehind();
  const pattern = buildPattern(search, { wholeWord, useLookbehindBoundaries });
  const flags = caseInsensitive ? "gi" : "g";
  const re = new RegExp(pattern, flags);

  if (wholeWord && !useLookbehindBoundaries) {
    return String(text).replace(re, (full, prefix, match) => {
      return `${prefix}${applyCase(match, baseReplacement, caseMode)}`;
    });
  }

  return String(text).replace(re, (match) => {
    return applyCase(match, baseReplacement, caseMode);
  });
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined);
}

function normalizePov(value) {
  if (value === true || value === "first-person") return "first-person";
  if (value === false || value === "third-person") return "third-person";
  return undefined;
}

function resolvePov(explicitPov, templateState) {
  const ctx = templateState?.ctx || {};
  const explicit = normalizePov(explicitPov);
  if (explicit) return explicit;

  // New preferred source: session answers POV.
  const fromAnswersPov =
    normalizePov(ctx.data?.answers?.pov) || normalizePov(ctx.answers?.pov);
  if (fromAnswersPov) return fromAnswersPov;

  const fromIsFirstPerson = normalizePov(ctx.isFirstPerson);
  if (fromIsFirstPerson) return fromIsFirstPerson;

  const fromSessionPov = normalizePov(ctx.data?.pov);
  if (fromSessionPov) return fromSessionPov;

  const fromSessionIsFirstPerson = normalizePov(ctx.data?.isFirstPerson);
  if (fromSessionIsFirstPerson) return fromSessionIsFirstPerson;

  const fromAnswersIsFirstPerson =
    normalizePov(ctx.data?.answers?.isFirstPerson) ||
    normalizePov(ctx.answers?.isFirstPerson);
  if (fromAnswersIsFirstPerson) return fromAnswersIsFirstPerson;

  return undefined;
}

function applyWholeString(text, options) {
  const replacements = getReplacements();
  const keys = Object.keys(replacements).sort((a, b) => b.length - a.length);

  return keys.reduce((acc, key) => {
    const baseReplacement = resolveReplacement(key, undefined);
    return replaceAllInString(acc, key, baseReplacement, options);
  }, text);
}

function executeToggle(
  { input, word, pov, replacementString, options },
  templateState,
) {
  const opts = options || {};
  const { caseInsensitive = true, caseMode = "preserve" } = opts;
  const resolvedPov = resolvePov(pov, templateState);

  const hasWord = word !== undefined && word !== null;
  const textInput = input == null ? undefined : String(input ?? "");

  // Whole-string mode
  if (!hasWord) {
    const text = String(input ?? "");

    if (resolvedPov === "third-person") {
      return applyWholeString(text, opts);
    }

    return text;
  }

  const search = String(word ?? "");
  if (!search) return textInput == null ? "" : textInput;

  if (resolvedPov === "first-person") {
    return textInput == null ? search : textInput;
  }

  if (resolvedPov === "third-person") {
    const searchKey = caseInsensitive ? search.toLowerCase() : search;
    const baseReplacement = resolveReplacement(searchKey, replacementString);

    if (textInput == null) {
      return applyCase(search, baseReplacement, caseMode);
    }

    return replaceAllInString(textInput, search, baseReplacement, opts);
  }

  return textInput == null ? search : textInput;
}

function toOptions(cfg) {
  const nestedOptions = isPlainObject(cfg.options) ? cfg.options : {};
  const options = { ...nestedOptions };

  if (hasOwn(cfg, "wholeWord")) options.wholeWord = cfg.wholeWord;
  if (hasOwn(cfg, "caseInsensitive"))
    options.caseInsensitive = cfg.caseInsensitive;
  if (hasOwn(cfg, "caseMode")) options.caseMode = cfg.caseMode;

  return options;
}

function parseObjectConfig(inputFromPipe, configArg) {
  const cfg = isPlainObject(configArg) ? configArg : {};
  const options = toOptions(cfg);

  const hasInputOverride =
    hasOwn(cfg, "input") || hasOwn(cfg, "text") || hasOwn(cfg, "value");
  const explicitInput = hasOwn(cfg, "input")
    ? cfg.input
    : hasOwn(cfg, "text")
      ? cfg.text
      : cfg.value;

  return {
    input: hasInputOverride ? explicitInput : inputFromPipe,
    word: firstDefined(cfg.word, cfg.search, cfg.target, cfg.find),
    pov: cfg.pov,
    replacementString: firstDefined(
      cfg.replacement,
      cfg.replacementString,
      cfg.replaceWith,
    ),
    options,
  };
}

function parseInvocation(input, config) {
  // Direct object-only mode for JS callers:
  // togglePOV({ input, pov, word, replacement, ...options })
  if (config === undefined && isPlainObject(input)) {
    return parseObjectConfig(undefined, input);
  }

  // Template mode:
  // {{ "text" | togglePOV({ pov, word, replacement, ...options }) }}
  // {{ "text" | togglePOV }}
  return parseObjectConfig(input, config);
}

module.exports = function togglePOV(input, config) {
  return executeToggle(parseInvocation(input, config), this);
};
