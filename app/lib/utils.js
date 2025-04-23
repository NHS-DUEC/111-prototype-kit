const nunjucks = require('nunjucks');
const EmbedExtension = require('./extensions/embed');

exports.addExtensions = function(env) {
  // register it under the name “embed”
  env.addExtension('EmbedExtension', new EmbedExtension());
}
