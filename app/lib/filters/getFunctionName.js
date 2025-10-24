module.exports = function(targetFunction) {
  if (typeof targetFunction !== 'function') {
    throw new Error('getMacroName filter requires a macro function as the argument');
  }
  // JavaScript functions have a `name` property matching the macro name
  return targetFunction.name || '';
}
