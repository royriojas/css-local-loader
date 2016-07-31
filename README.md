# css-local-loader
a webpack loader to enhance the style-loader to throw when attempting to access undefined local classnames and allow
combining both local and global css classnames.

It can also be used as an alternative of the classnames module.

IMPORTANT: This module uses ES6 Proxy to be able to throw when the selector required is undefined, in browsers without
Proxy support this will just default to the normal behavior. In any case the usage of the helper functions `cf` and `g`
should still work on all browsers.

## motivation
check: https://github.com/css-modules/css-modules/issues/146

**TODO:** Add tests

## install

```bash
npm i -D css-local-loader
```

## Usage

```javascript
module: {
  loaders: [{
    // only files that match .m.scss
    // this is to make the transition easier
    // since now the code will change from
    //
    // import styles from './file.scss'
    // styles.foo // might be undefined
    //
    // to
    //
    // import { locals as styles } from './file.m.scss'
    // styles.foo // will throw if foo is undefined
    //
    test: /\.m\.scss$/,
    loader: 'css-local',
  },
  // important style loader should come after
  {
    test: /\.scss$/,
    exclude: /node_modules/,
    loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss!sass?outputStyle=expanded&sourceMap',
  }]
}
```

## cf (classFor) an g (globalClassFor)

Two functions are also exported when a file containing local css is imported:

### cf (classFor)

`cf` is abbreviation for `classFor`. This method will return the local identifier for the provided className.

Example:

Given `test.m.scss`

```
.test {
  display: block;
}

.demo {
  display: inline-block;
}

.foo {
  width: 100%;
}
```

then using `cf`:

```javascript
import { locals, cf } from './test.m.scss';

// NOTE: __xxxx is just a placeholder for whatever renaming strategy is selected

locals.test; // will return something like test__xxxx
locals.foo; // will return something like foo__xxxx
locals.demo // will return something like demo__xxxx
locals.iDontExist // will throw becasue it does not exists

cf('test demo'); // will return something like 'test__xxxx demo__xxx'
cf('test notfound') // will throw because of not found
cf({ test: true, notFound: false }); // will not throw since notFound is not accessed
cf({ test: true, demo: true }); // will return something like 'test__xxxx demo__xxx'
cf({ test: true, notFound: true }); // will throw because notFound is not defined in the file
```

### g or (globalClassFor)

`g` is the abbreviation for `globalClassFor` this is handy when a global class need to be mixed with the local classes.
This function return an object, so it is actually intended to be used in combination with `cf` like described below

```javascript
import { cf, g } from './test.m.css';
cf('test demo', g('global classes')) // will return something like 'test__xxxx demo__xxxx global classes'
cf('test demo', g({ globalClass: true, button: false })); // will return 'test__xxxx demo__xxxx globalClass'
```

## Changelog
[changelog](./changelog.md)

## License
MIT