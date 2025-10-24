// https://jhildenbiddle.github.io/mergician/
const { mergician } = require('mergician');

module.exports = function mergeAppendArrays(...objects) {
  return mergician({
    appendArrays: true
  })(...objects);
};
