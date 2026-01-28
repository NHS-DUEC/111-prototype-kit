/**
 * togglePOV supports 3 call patterns:
 *
 * 1) Whole-string mode:
 *    togglePOV(input, pov, options?)
 *
 * 2) Targeted replace-in-string mode:
 *    togglePOV(input, word, pov, replacementString?, options?)
 *
 * 3) Word-only mode:
 *    togglePOV(word, pov, replacementString?, options?)
 *
 * Options:
 *  - wholeWord (default true): replace whole tokens only
 *  - caseInsensitive (default true): match regardless of case
 *  - caseMode (default 'preserve'): 'preserve' | 'lower' | 'upper'
 *
 * Case-preserving rules:
 *  - "you" -> "they"
 *  - "You" -> "They"
 *  - "YOU" -> "THEY"
 *  - Special-case: single-letter tokens like "I" behave like Title Case -> "They"
 *
 * Whole-token matching supports punctuation tokens like "I'm" using lookbehind boundaries
 * when available (with a safe fallback for older Node versions).
 */
const config = require('../../config.js');

const defaultReplacements = {
  // second-person -> third-person plural
  you: 'they',
  your: 'their',
  yours: 'theirs',
  yourself: 'themselves',

  // first-person -> third-person plural (safe, token-level)
  i: 'they',
  me: 'them',
  my: 'their',
  mine: 'theirs',
  myself: 'themselves',
  "i'm": "they're",
  "i’ve": "they’ve",
  "i'd": "they’d",
  "i’ll": "they’ll",
  "i’m": "they’re", // curly apostrophe
};

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyCase(source, target, caseMode = 'preserve') {
  const s = String(source);
  const t = String(target);

  // Explicit override
  if (caseMode === 'lower') return t.toLowerCase();
  if (caseMode === 'upper') return t.toUpperCase();

  // preserve (default)

  // Single-letter tokens like "I" should behave like Title Case, not ALL CAPS
  if (s.length === 1) {
    return t[0].toUpperCase() + t.slice(1).toLowerCase();
  }

  // ALL CAPS
  if (s === s.toUpperCase()) return t.toUpperCase();

  // Title case
  if (
    s[0] === s[0].toUpperCase() &&
    s.slice(1) === s.slice(1).toLowerCase()
  ) {
    return t[0].toUpperCase() + t.slice(1).toLowerCase();
  }

  // default: lower
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
    new RegExp('(?<!a)b');
    return true;
  } catch {
    return false;
  }
}

function buildPattern(search, { wholeWord, useLookbehindBoundaries }) {
  const escaped = escapeRegExp(search);

  if (!wholeWord) return escaped;

  // Preferred: supports "I'm", "you're", "NHS-111", etc.
  if (useLookbehindBoundaries) {
    return `(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`;
  }

  // Fallback if lookbehind isn’t available (older Node):
  // Capture "start or non-word char" prefix so we can re-insert it.
  return `(^|[^A-Za-z0-9_])(${escaped})(?![A-Za-z0-9_])`;
}

function replaceAllInString(text, search, baseReplacement, options) {
  const {
    wholeWord = true,
    caseInsensitive = true,
    caseMode = 'preserve',
  } = options || {};

  const useLookbehindBoundaries = supportsLookbehind();
  const pattern = buildPattern(search, { wholeWord, useLookbehindBoundaries });
  const flags = caseInsensitive ? 'gi' : 'g';
  const re = new RegExp(pattern, flags);

  if (wholeWord && !useLookbehindBoundaries) {
    // Fallback pattern has 2 groups: (prefix)(match)
    return String(text).replace(re, (full, prefix, match) => {
      return `${prefix}${applyCase(match, baseReplacement, caseMode)}`;
    });
  }

  return String(text).replace(re, (match) => {
    return applyCase(match, baseReplacement, caseMode);
  });
}

module.exports = function togglePOV(...args) {
  // Detect call shape:
  // A) (input, pov, options?) -> whole-string mode
  // B) (input, word, pov, replacementString?, options?) -> targeted string mode
  // C) (word, pov, replacementString?, options?) -> word-only mode

  let input;
  let word;
  let pov;
  let replacementString;
  let options;

  const argCount = args.length;

  // Whole-string mode: (input, pov, options?)
  // Identify by: 2 args OR 3 args where 3rd is an object (options)
  // AND second arg looks like pov (string/boolean)
  if (
    (argCount === 2 || (argCount === 3 && typeof args[2] === 'object')) &&
    (typeof args[1] === 'string' || typeof args[1] === 'boolean')
  ) {
    input = args[0];
    pov = args[1];
    options = argCount === 3 ? args[2] : {};

    const text = String(input ?? '');

    // First-person: no change
    if (pov === 'first-person' || pov === true) return text;

    // Third-person: apply ALL replacements found in the string
    if (pov === 'third-person' || pov === false) {
      const replacements = getReplacements();

      // Replace longer keys first to avoid overlaps (e.g. "yourself" before "your")
      const keys = Object.keys(replacements).sort((a, b) => b.length - a.length);

      return keys.reduce((acc, key) => {
        const baseReplacement = resolveReplacement(key, undefined);
        return replaceAllInString(acc, key, baseReplacement, options);
      }, text);
    }

    return text;
  }

  // Targeted or word-only mode
  if (argCount >= 3) {
    // (input, word, pov, replacementString?, options?)
    [input, word, pov, replacementString, options] = args;
  } else {
    // (word, pov, replacementString?, options?)
    [word, pov, replacementString, options] = args;
    input = undefined;
  }

  const opts = options || {};
  const { caseInsensitive = true, caseMode = 'preserve' } = opts;

  const search = String(word ?? '');
  if (!search) return input == null ? '' : String(input ?? '');

  // First-person: no change
  if (pov === 'first-person' || pov === true) {
    return input == null ? search : String(input ?? '');
  }

  // Third-person: replace
  if (pov === 'third-person' || pov === false) {
    const searchKey = caseInsensitive ? search.toLowerCase() : search;
    const baseReplacement = resolveReplacement(searchKey, replacementString);

    // Word-only mode
    if (input == null) {
      return applyCase(search, baseReplacement, caseMode);
    }

    // Targeted replace within string mode
    return replaceAllInString(String(input), search, baseReplacement, opts);
  }

  // Unknown pov: no change
  return input == null ? search : String(input ?? '');
};

/* -------------------------
   Examples (copy/paste)
-------------------------- */

// Whole-string mode
// togglePOV("I forgot", "third-person");
// -> "They forgot"

// togglePOV("I forgot. You lost your keys.", "third-person");
// -> "They forgot. They lost their keys."

// Force casing for replacements
// togglePOV("I forgot. You lost your keys.", "third-person", { caseMode: "lower" });
// -> "they forgot. they lost their keys."

// togglePOV("I forgot. You lost your keys.", "third-person", { caseMode: "upper" });
// -> "THEY forgot. THEY lost THEIR keys."

// Token with apostrophe (whole-string mode)
// togglePOV("I'm ready. I'm here.", "third-person");
// -> "They're ready. They're here."

// Targeted replace in string with explicit replacement
// togglePOV("I'm ready. I'm here.", "I'm", "third-person", "they're");
// -> "They're ready. They're here."

// Word-only mode
// togglePOV("YOU", "third-person"); // "THEY"
// togglePOV("I", "third-person");   // "They"
