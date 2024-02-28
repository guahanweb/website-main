const Prism = require("prismjs");
const PrismLoader = require("./PrismLoader");
const HighlightLinesGroup = require("./HighlightLinesGroup");
const getAttributes = require("./getAttributes");
const htmlencode = require('htmlencode');

module.exports = function (options = {}) {
  return function(str, language) {
    if(!language) {
      // empty string means defer to the upstream escaping code built into markdown lib.
      return "";
    }

    // mermaid support
    if (language === 'mermaid') {
        return `<pre class="mermaid">${htmlencode.htmlEncode(str)}</pre>`;
    }

    let split = language.split("/");
    if( split.length ) {
      language = split.shift();
    }

    let html;
    if(language === "text") {
      html = str;
    } else {
      let loader = PrismLoader(language, options)
      if(!loader) {
        html = str;
      } else {
        html = Prism.highlight(str, loader, language);
      }
    }

    let hasHighlightNumbers = split.length > 0;
    let highlights = new HighlightLinesGroup(split.join("/"), "/");
    let lines = html.split("\n");

    // Trim last line if it is empty
    if (lines[lines.length - 1] === "") {
      lines = lines.slice(0, -1);
    }

    lines = lines.map(function(line, j) {
      if(options.alwaysWrapLineHighlights || hasHighlightNumbers) {
        let lineContent = highlights.getLineMarkup(j, line);
        return lineContent;
      }
      return line;
    });

    const context = { content: str, language: language, options: options };
    const preAttributes = getAttributes(options.preAttributes, context);
    const codeAttributes = getAttributes(options.codeAttributes, context);

    return `<pre${preAttributes}><code${codeAttributes}>${lines.join(options.lineSeparator || "<br>")}</code></pre>`;
  };
};