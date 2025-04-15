const he = require('he')

module.exports = function decode(str) {
 return he.decode(str)
}
