/**
 * togglePOV supports 3 call patterns:
 *
 * 1) Whole-string mode (NEW):
 *    togglePOV(input, pov, options?)
 *
 * 2) Targeted replace-in-string mode:
 *    togglePOV(input, word, pov, replacementString?, options?)
 *
 * 3) Word-only mode:
 *    togglePOV(word, pov, replacementString?, options?)
 *
 * Case-preserving:
 *   you -> they, You -> They, YOU -> THEY
 *
 * Whole-token matching (default) supports tokens like "I'm" by using
 * negative lookbehind/ahead boundaries rather than \b.
 */
const config = require('../../config.js');

const defaultReplacements = {
  you: 'they',
  your: 'their',
  yours: 'theirs',
  yourself: 'themselves',
  // Add more if needed, e.g.:
  // i: 'they', // if you want "I forgot" -> "They forgot"
};

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyCase(source, target) {
  const s = String(source);
  const t = String(target);

  // Single-letter tokens like "I" should behave like Title Case
  if (s.length === 1) {
    return t[0].toUpperCase() + t.slice(1).toLowerCase();
  }

  // ALL CAPS
  if (s === s.toUpperCase()) return t.toUpperCase();

  // Title case
  if (s[0] === s[0].toUpperCase() && s.slice(1) === s.slice(1).toLowerCase()) {
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

function buildPattern(search, { wholeWord, useLookbehindBoundaries }) {
  const escaped = escapeRegExp(search);

  if (!wholeWord) return escaped;

  // Preferred: supports "I'm", "you're", "NHS-111", etc.
  if (useLookbehindBoundaries) {
    return `(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`;
  }

  // Fallback if lookbehind isn’t available (older Node):
  // Use a non-capturing group for "start or non-wordchar" and capture it
  // so we can re-insert it in replacement.
  // NOTE: this is less precise for some punctuation cases, but avoids lookbehind.
  return `(^|[^A-Za-z0-9_])(${escaped})(?![A-Za-z0-9_])`;
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

function replaceAllInString(text, search, baseReplacement, options) {
  const { wholeWord = true, caseInsensitive = true } = options || {};
  const useLookbehindBoundaries = supportsLookbehind();
  const pattern = buildPattern(search, { wholeWord, useLookbehindBoundaries });
  const flags = caseInsensitive ? 'gi' : 'g';
  const re = new RegExp(pattern, flags);

  if (wholeWord && !useLookbehindBoundaries) {
    // Fallback pattern has 2 groups: (prefix)(match)
    return String(text).replace(re, (full, prefix, match) => {
      return `${prefix}${applyCase(match, baseReplacement)}`;
    });
  }

  return String(text).replace(re, (match) => applyCase(match, baseReplacement));
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

      // Replace longer keys first to avoid partial overlaps (e.g. "yourself" before "your")
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
  const { caseInsensitive = true } = opts;

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

    // Word-only
    if (input == null) {
      return applyCase(search, baseReplacement);
    }

    // Targeted replace within string
    return replaceAllInString(String(input), search, baseReplacement, opts);
  }

  return input == null ? search : String(input ?? '');
};

/* -------------------------
   Examples
-------------------------- */

// 1) Whole-string mode (NEW):
// Requires a mapping for "i" if you want "I forgot" -> "They forgot"
// e.g. set in config.togglePOV.replacements: { "i": "they" }
//
// togglePOV("I forgot", "third-person") -> "They forgot" (if "i" -> "they" exists)

// 2) Default pronouns:
// togglePOV("You forgot your keys.", "third-person")
// -> "They forgot their keys."

// 3) Token with apostrophe:
// togglePOV("I'm ready. I'm here.", "third-person", { wholeWord: true })
// -> unchanged unless you map "i'm" -> "they're" (example)

// 4) Targeted mode with explicit replacement:
// togglePOV("I'm ready. I'm here.", "I'm", "third-person", "they're")
// -> "They're ready. They're here."

// 5) Word-only mode:
// togglePOV("YOU", "third-person") -> "THEY"
