// embed-via-twig.js
const nunjucks = require('nunjucks');
const Twig     = require('twig').twig;

class EmbedViaTwig {
  constructor() {
    this.tags = ['embed'];
  }

  parse(parser, nodes, lexer) {
    // --- patch this parser instance to never error on advanceAfterBlockEnd ---
    if (!parser._embedPatched) {
      const orig = parser.advanceAfterBlockEnd.bind(parser);
      parser.advanceAfterBlockEnd = (name) =>
        orig(name || lexer.TOKEN_BLOCK_END);
      parser._embedPatched = true;
    }

    // 1) consume '{% embed'
    const tok = parser.nextToken();
    const args = new nodes.NodeList(tok.lineno, tok.colno);

    // 2) parse the template-name expr
    args.addChild(parser.parseExpression());

    // 3) optional `with {…}`
    let dataExpr = new nodes.Literal(tok.lineno, tok.colno, null);
    if (parser.skipValue(lexer.TOKEN_SYMBOL, 'with')) {
      dataExpr = parser.parseExpression();
    }
    args.addChild(dataExpr);

    // 4) optional `only`
    const onlyFlag = parser.skipValue(lexer.TOKEN_SYMBOL, 'only');
    args.addChild(new nodes.Literal(tok.lineno, tok.colno, onlyFlag));

    // 5) skip the '%}' ending the start‑tag
    parser.advanceAfterBlockEnd();

    // 6) manually grab *all* tokens up through the matching '{% endembed %}'
    //    (inner embeds recurse back into this same `parse()` automatically)
    let raw = '';
    let depth = 1;
    while (depth > 0) {
      const tk = parser.nextToken();
      raw += tk.value;

      if (tk.type === lexer.TOKEN_BLOCK_START) {
        // read the block name
        const nameTk = parser.nextToken();
        raw += nameTk.value;

        if (nameTk.type === lexer.TOKEN_SYMBOL) {
          if (nameTk.value === 'embed') depth++;
          else if (nameTk.value === 'endembed') depth--;
        }

        // consume until the close '%}'
        let closeTk;
        do {
          closeTk = parser.nextToken();
          raw += closeTk.value;
        } while (closeTk.type !== lexer.TOKEN_BLOCK_END);
      }
    }

    // 7) hand that raw string into run()
    const rawNode = new nodes.Literal(tok.lineno, tok.colno, raw);
    return new nodes.CallExtension(this, 'run', args, [ rawNode ]);
  }

  run(context, templateName, data, only, raw) {
    // 1) rebuild the full Twig embed signature
    const parts = [`"${templateName}"`];
    if (data) parts.push(`with ${JSON.stringify(data)}`);
    if (only) parts.push('only');
    const sig = `{% embed ${parts.join(' ')} %}`;

    // 2) full Twig source (raw includes the '{% endembed %}')
    const twigSrc = sig + raw();

    // 3) choose the context
    const renderCtx = only
      ? (data || {})
      : Object.assign({}, context.ctx, data || {});

    // 4) let Twig.js do the heavy lifting (nested embeds, blocks, etc.)
    const tpl  = Twig({ data: twigSrc, allowInlineIncludes: true });
    const html = tpl.render(renderCtx);

    // 5) return it as a Nunjucks SafeString
    return new nunjucks.runtime.SafeString(html);
  }
}

module.exports = EmbedViaTwig;
