// TODO: This should be moved to its own module and published
// in npm as css-local-loader
import loaderUtils from 'loader-utils';
import path from 'path';

/**
 * This loader will prepend every call to
 * console methods with the name of the module
 */
export default function cssLocalLoader(source, map) {
  this.cacheable();

  const pathToSheet = loaderUtils.stringifyRequest(this, require.resolve(path.join(__dirname, './sheet.js')));
  const requireWrapper = `
if (content.locals) {
  var sheet = require(${pathToSheet})(content.locals);

  sheet.tokens = content.locals;
  if (typeof global.Proxy !== 'undefined') {
    sheet.tokens =  new Proxy(content.locals, {
      get: function(target, name) {
        return sheet.cf(name)
      }
    });
  }

  module.exports = sheet;
}
`;

  source = `${source}\n\n${requireWrapper}`;

  this.callback(null, source, map);
}
