const nunjucks = require('nunjucks');
const EmbedExtension = require('./extensions/embed');

exports.addNunjucksFiltersWithContext = function(env) {

  /**
   * callByName filter
   * Allows calling a macro by name with flexible context var name:
   * Forms:
   * 1) Provide macros object directly:
   *    {{ macros | callByName('myMacro', arg1, arg2) }}
   * 2) Provide macro name string, using default `macros` var:
   *    {% import "macros.njk" as macros %}
   *    {{ 'myMacro' | callByName(arg1, arg2) }}
   * 3) Provide macro name and custom context var name:
   *    {% import "macros.njk" as customMacros %}
   *    {{ 'myMacro' | callByName('customMacros', arg1, arg2) }}
   */
  env.addFilter('callByName', function(input, ...args) {
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

      // If first arg is a context var name mapping to an object, use it
      if (args.length > 0 && typeof args[0] === 'string' && this.ctx && typeof this.ctx[args[0]] === 'object') {
        macroObj = this.ctx[args.shift()];
      } else {
        // Default to `macros` in context
        macroObj = (this.ctx && this.ctx.macros) || {};
      }
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
  });

}

exports.addExtensions = function(env) {
  // register it under the name “embed”
  env.addExtension('EmbedExtension', new EmbedExtension());
}
