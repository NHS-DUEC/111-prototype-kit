// embed-extension.js
const nunjucks = require('nunjucks');

class EmbedExtension {
  constructor() {
    this.tags = ['embed'];
  }

  parse(parser, nodes, lexer) {
    // 1) consume the 'embed' token
    const tok = parser.nextToken();   // e.g. { type: TOKEN_SYMBOL, value: 'embed' }

    // 2) pull out our arguments: template name, optional data object, optional "only"
    const args = new nodes.NodeList(tok.lineno, tok.colno);
    // 2a) the template name, e.g. "layout.html"
    const templateExpr = parser.parseExpression();
    args.addChild(templateExpr);
    // 2b) optional `with {…}`
    let dataExpr = new nodes.Literal(tok.lineno, tok.colno, null);
    if (parser.skipValue(lexer.TOKEN_SYMBOL, 'with')) {
      dataExpr = parser.parseExpression();
    }
    args.addChild(dataExpr);
    // 2c) optional `only`
    const onlyFlag = parser.skipValue(lexer.TOKEN_SYMBOL, 'only');
    args.addChild(new nodes.Literal(tok.lineno, tok.colno, onlyFlag));

    // 3) skip the "%}" that ends the start‑tag
    parser.advanceAfterBlockEnd(lexer.TOKEN_BLOCK_END);

    // ─── R A W   C A P T U R E ───────────────────────────────────────────────────
    // rewind and prime the parser so that parseRaw will grab everything up to {%- endembed %}
    parser.tokens.backN(2);
    parser.peeked    = tok;
    parser.tokens.in_code = true;

    // 4) grab the raw inner template (including your `{% block %}` overrides)
    const rawBody = parser.parseRaw('embed');
    // ─────────────────────────────────────────────────────────────────────────────

    // 5) generate a CallExtension node; at render time `run()` will be invoked
    return new nodes.CallExtension(this, 'run', args, [ rawBody ]);
  }

  run(context, templateName, dataObj, only, rawBody) {
    // 6) build up the merged context
    const parentCtx = only ? {} : context.ctx;
    const finalCtx  = (dataObj != null)
      ? Object.assign({}, parentCtx, dataObj)
      : parentCtx;

    // 7) stitch together an `{% extends %}` wrapper + your raw override blocks
    const wrapper = `{% extends ${JSON.stringify(templateName)} %}${rawBody()}`;

    // 8) render it and mark it safe so nunjucks won't re‑escape HTML
    const output = context.env.renderString(wrapper, finalCtx);
    return new nunjucks.runtime.SafeString(output);
  }
}

module.exports = EmbedExtension;
