const nunjucks = require('nunjucks');

/**
 * callMacro filter
 * Allows calling a macro function directly:
 * Usage in template:
 *   {% import "macros.njk" as macros %}
 *   {{ macros.myMacro | callMacro(arg1, arg2) }}
 */
function callMacro(macroFn, ...args) {
  if (typeof macroFn !== 'function') {
    throw new Error('callMacro filter requires a macro function as the first argument');
  }
  // Invoke the macro with provided arguments
  const result = macroFn(...args);
  // Wrap output as SafeString if necessary (e.g. HTML)
  if (result && typeof result.toString === 'function') {
    return new nunjucks.runtime.SafeString(result.toString());
  }
  return result;
}

module.exports = callMacro
