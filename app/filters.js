/**
 * @param {Environment} env
 */
module.exports = function (env) {

  const filters = {}
  const fs = require('fs');
  const path = require('path');

  // the name of filters directory containing modules
  const modulesPath = path.join(__dirname, 'lib/filters');

  /**
   *
   * @param {String} directoryPath The directory to be search for files
   * @param {Object} targetObject The object for the filters to be added to
   */
  function loadFilters(directoryPath, targetObject) {
    // Read files synchronously for simplicity
    const files = fs.readdirSync(directoryPath);
    files.forEach((file) => {
      if (path.extname(file) === '.js') {
        // Use the file name without extension as the key
        const moduleName = path.basename(file, '.js');
        const filePath = path.join(directoryPath, file);
        // Attach the required module as a property of the filters object
        targetObject[moduleName] = require(filePath);
        // console.log(`Loaded filter: ${moduleName}`);
      }
    });
  }

// Load the modules into the filter object
loadFilters(modulesPath, filters)

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

  /* keep the following line to return your filters to the app  */
  return filters
}

/**
 * @import { Environment } from 'nunjucks'
 */
