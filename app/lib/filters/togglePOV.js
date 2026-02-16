/**
 * togglePOV supports 3 call patterns:
 *
 * 1) Whole-string mode (explicit POV):
 *    togglePOV(input, pov, options?)
 *
 * 1b) Whole-string mode (infer POV from template context):
 *    togglePOV(input, options?)
 *
 * 2) Targeted replace-in-string mode (explicit POV):
 *    togglePOV(input, word, pov, replacementString?, options?)
 *
 * 2b) Targeted replace-in-string mode (infer POV from template context):
 *    togglePOV(input, word, replacementString?, options?)
 *
 * 3) Word-only mode:
 *    togglePOV(word, pov?)
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

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizePov(value) {
  if (value === true || value === 'first-person') return 'first-person';
  if (value === false || value === 'third-person') return 'third-person';
  return undefined;
}

function resolvePov(explicitPov, templateState) {
  const explicit = normalizePov(explicitPov);
  if (explicit) return explicit;

  const ctx = templateState?.ctx || {};
  const fromIsFirstPerson = normalizePov(ctx.isFirstPerson);
  if (fromIsFirstPerson) return fromIsFirstPerson;

  const fromSessionPov = normalizePov(ctx.data?.pov);
  if (fromSessionPov) return fromSessionPov;

  const fromSessionIsFirstPerson = normalizePov(ctx.data?.isFirstPerson);
  if (fromSessionIsFirstPerson) return fromSessionIsFirstPerson;

  return undefined;
}

module.exports = function togglePOV(...args) {
  // Detect call shape:
  // A) (input, pov?, options?) -> whole-string mode
  // B) (input, word, pov?, replacementString?, options?) -> targeted string mode
  // C) (word, pov?) -> word-only mode

  let input;
  let word;
  let pov;
  let replacementString;
  let options;

  const argCount = args.length;
  const second = args[1];
  const third = args[2];
  const secondIsPov = normalizePov(second) !== undefined;
  const thirdIsPov = normalizePov(third) !== undefined;
  const secondIsOptions = isPlainObject(second);
  const thirdIsOptions = isPlainObject(third);
  const isWholeStringMode =
    argCount === 1 ||
    (argCount === 2 && (secondIsPov || secondIsOptions)) ||
    (argCount === 3 && secondIsPov && thirdIsOptions);

  if (isWholeStringMode) {
    input = args[0];
    pov = secondIsPov ? second : undefined;
    options =
      (argCount === 2 && secondIsOptions)
        ? second
        : (argCount === 3 && thirdIsOptions)
          ? third
          : {};
    const resolvedPov = resolvePov(pov, this);

    const text = String(input ?? '');

    // First-person: no change
    if (resolvedPov === 'first-person') return text;

    // Third-person: apply ALL replacements found in the string
    if (resolvedPov === 'third-person') {
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
    // (input, word, pov?, replacementString?, options?)
    [input, word] = args;

    if (thirdIsPov) {
      pov = third;
      if (isPlainObject(args[3])) {
        options = args[3];
      } else {
        replacementString = args[3];
        options = args[4];
      }
    } else {
      if (thirdIsOptions) {
        options = third;
      } else {
        replacementString = third;
        options = args[3];
      }
    }
  } else {
    // (input, word?) in templates OR (word, pov?) when called directly
    if (secondIsPov || second === undefined) {
      [word, pov] = args;
      input = undefined;
    } else {
      [input, word] = args;
    }
  }

  const opts = options || {};
  const { caseInsensitive = true, caseMode = 'preserve' } = opts;
  const resolvedPov = resolvePov(pov, this);

  const search = String(word ?? '');
  if (!search) return input == null ? '' : String(input ?? '');

  // First-person: no change
  if (resolvedPov === 'first-person') {
    return input == null ? search : String(input ?? '');
  }

  // Third-person: replace
  if (resolvedPov === 'third-person') {
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

// Whole-string mode (POV inferred from this.ctx.isFirstPerson / this.ctx.data.pov)
// {{ "I forgot. You lost your keys." | togglePOV }}
// -> "They forgot. They lost their keys." (when third-person)

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

// Targeted replace in string (POV inferred)
// {{ "What is your name?" | togglePOV("your") }}
// -> "What is their name?" (when third-person)

// Word-only mode
// togglePOV("YOU", "third-person"); // "THEY"
// togglePOV("I", "third-person");   // "They"
