import loaderUtils from 'loader-utils';
import path from 'path';

module.exports = function cssLocalLoader(source, map) {
  this.cacheable();
  const pathToSheet = loaderUtils.stringifyRequest(this, require.resolve(path.join(__dirname, './sheet.js')));
  const requireWrapper = `

  var sheet = require(${pathToSheet})(module.exports);

  if (typeof global.Proxy === 'undefined' || process.env.NODE_ENV === 'production') {
    sheet.locals = module.exports;
  } else {
    sheet.locals =  new Proxy(module.exports, {
      get: function(target, name) {
        return sheet.cf(name)
      }
    });
  }

  module.exports = sheet;

  if (module.hot && process.env.NODE_ENV !== 'production') {
    module.hot.accept();
  }
`;

  source = `${source}\n\n${requireWrapper}`;

  this.callback(null, source, map);
};
