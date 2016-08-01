import loaderUtils from 'loader-utils';
import path from 'path';

module.exports = function cssLocalLoader(source, map) {
  this.cacheable();
  const pathToSheet = loaderUtils.stringifyRequest(this, require.resolve(path.join(__dirname, './sheet.js')));
  const requireWrapper = `

  var sheet = require(${pathToSheet})(module.exports);

  if (typeof global.Proxy !== 'undefined') {
    sheet.locals =  new Proxy(module.exports, {
      get: function(target, name) {
        return sheet.cf(name)
      }
    });
  }

  module.exports = sheet;
`;

  source = `${source}\n\n${requireWrapper}`;

  this.callback(null, source, map);
};
