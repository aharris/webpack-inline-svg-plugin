const fs = require('fs');

function WebpackInlineSvgPlugin(options) {
  this.options = options;
};

WebpackInlineSvgPlugin.prototype.apply = function (compiler) {
  let self = this;

  function doReplace(module, pattern) {
    if (module.rawRequest && module.rawRequest.indexOf( pattern ) !== -1) {
      const regex = /<img(\\n)?\s[^>]*?src\s*=\s*['\\"]([^'\"]*?)['\"][^>]*?>/g;

      let matches = module._source._value.match(regex);

      if ( matches) {
        for (let i = 0; i < matches.length; i ++) {
          if (matches[i].indexOf( 'inline-svg' ) !== -1) {
						let classes = matches[i].split('class=\\"')[1] ? matches[i].split('class=\\"')[1].split('\\"')[0] : '';
						let title = matches[i].split('title=\\"')[1] ? matches[i].split('title=\\"')[1].split('\\"')[0] : '';
									let svgContents = fs.readFileSync( self.options.basePath + matches[i].split('src=\\"')[1].split('\\"')[0]);

						let newSvg = svgContents.toString().replace('<svg', `<svg class="${classes}" title="${title}"`);

						module._source._value = module._source._value.replace(matches[i], newSvg.toString()
							.replace(/\n|\t/g, ' ')
							.replace(/"/g, '\\"').trim());
          }
        }
      }
    }
  }

  compiler.plugin("compilation", function(compilation) {
    compilation.plugin('optimize-chunks', function(chunks) {

      chunks.forEach(function (chunk) {
        chunk.modules.forEach(function (module){
          for (let i = 0; i < self.options.patterns.length; i++ ) {
            doReplace(module, self.options.patterns[i]);
          }
        });
      });
    });
  });
}

module.exports = WebpackInlineSvgPlugin;
