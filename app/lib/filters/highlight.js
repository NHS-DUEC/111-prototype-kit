const hljs = require('highlight.js');

module.exports = function(code, lang='xml') {
  return hljs.highlight(code, {language: lang}).value
}
