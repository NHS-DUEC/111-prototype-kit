const nunjucks = require('nunjucks');

/**
 * callByName filter
 * Allows calling a macro by name from an imported macro object:
 * Usage in template:
 *   {% import "macros.njk" as macros %}
 *   {{ macros | callByName('myMacro', arg1, arg2) }}
 */
function callByName(input, ...args) {
  let macroObj;
  let macroName;
  let macroArgs;
  // Case 1: input is macros object
  if (input && typeof input === 'object') {
    macroObj = input;
    macroName = args.shift();
    macroArgs = args;
  // Case 2: input is macro name string
  } else if (typeof input === 'string') {
    macroName = input;
    macroObj = this.ctx;
    macroArgs = args;
  } else {
    throw new Error('callByName filter requires a macro object or macro name string');
  }
  const fn = macroObj[macroName];
  if (typeof fn !== 'function') {
    throw new Error(`callByName: Macro '${macroName}' is not defined on the provided object`);
  }
  const result = fn(...macroArgs);
  return new nunjucks.runtime.SafeString(result.toString());
}

module.exports = callByName
