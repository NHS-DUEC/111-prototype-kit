const nunjucks = require('nunjucks');
const EmbedExtension = require('./extensions/embed');
const RepeatExtension = require('./extensions/repeat');

exports.addExtensions = function(env) {
  // register it under the name “embed”
  env.addExtension('EmbedExtension', new EmbedExtension());
  env.addExtension('RepeatExtension', new RepeatExtension());
}
