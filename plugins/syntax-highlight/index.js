const htmlencode = require('htmlencode');
const Prism = require('prismjs');
const hasTemplateFormat = require('./src/hasTemplateFormat');
const HighlightPairedShortcode = require('./src/HighlightPairedShortcode');
const LiquidHighlightTag = require('./src/LiquidHighlightTag');
const markdownPrismJs = require('./src/markdownSyntaxHighlightOptions');

module.exports = {
    initArguments: { Prism },
    configFunction: function (eleventyConfig, options = {}) {
        options = Object.assign({
            lineSeparator: "\n",
            errorOnInvalidLanguage: false,
            alwaysWrapLineHighlights: false,
            preAttributes: {},
            codeAttributes: {},
            mermaid_js_src: "https://unpkg.com/mermaid@10/dist/mermaid.esm.min.mjs",
            mermaid_config: {
                loadOnSave: true,
            }
        }, options);

        // set up mermaid shortcode
        eleventyConfig.addShortcode('mermaid_js', () => {
            return `<script type="module" async>import mermaid from "${options.mermaid_js_src}";document.addEventListener('DOMContentLoaded', mermaid.initialize(${JSON.stringify(options.mermaid_config)}));</script>`;
        });

        if (hasTemplateFormat(options.templateFormats, "liquid")) {
            eleventyConfig.addLiquidTag("highlight", (liquidEngine) => {
                // {% highlight js 0 2 %}
                let highlight = new LiquidHighlightTag(liquidEngine);
                return highlight.getObject(options);
            });
        }

        if (hasTemplateFormat(options.templateFormats, "njk")) {
            eleventyConfig.addPairedNunjucksShortcode("highlight", (content, args) => {
                // {% highlight "js 0 2-3" %}
                let [language, ...highlightNumbers] = args.split(" ");
                return HighlightPairedShortcode(content, language, highlightNumbers.join(' '), options);
            });
        }

        if (hasTemplateFormat(options.templateFormats, "md")) {
            eleventyConfig.addMarkdownHighlighter(markdownPrismJs(options));
        }
    }
}
