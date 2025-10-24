const nunjucks = require('nunjucks');

class RepeatExtension {
  constructor() {
    this.tags = ['repeat'];
  }

  parse(parser, nodes) {
    const tok = parser.nextToken(); // {% repeat ... %}
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    const body = parser.parseUntilBlocks('endrepeat');
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'run', args, [body]);
  }

  run(context, times, body) {
    let output = '';
    times = parseInt(times);

    for (let i = 0; i < times; i++) {
      context.setVariable('loop', {
        index: i,
        first: i === 0,
        last: i === times - 1,
      });
      output += body();
    }

    return new nunjucks.runtime.SafeString(output);
  }
}

module.exports = RepeatExtension;
