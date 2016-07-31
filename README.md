# webpack-css-loader
a cli tool to detect if a JSON file have changed since last time it was seen

**TODO:** Add tests

## install

```bash
npm i -g webpack-css-loader
```

## Usage

```bash
Usage: webpack-css-loader [options] jsonfile.json

Options:
  -x, --changed-cmd String  Command to execute if the file did change.
  -n, --not-changed-cmd String  Command to execute if the file did not change.
  --cache-id String         the cache id for this given command
  -p, --paths [String]      the keys to check in the json file
  -h, --help                Show this help
  -v, --version             Outputs the version number
  -q, --quiet               Show only the summary info - default: false
  --colored-output          Use colored output in logs
  --stack                   if true, uncaught errors will show the stack trace if available
```

## Example

```bash
# install deps only if the package.json `devDependencies` or `dependencies` have changed
# this will only execute `npm i` on the current directory if the dependencies changed
webpack-css-loader package.json -p 'devDependencies,dependencies' -x 'npm i'

# just print to the stdout if the file or section of the json file has changed
# this will print `true` to the stdout if the files changed or `false` if the
# file or section of the file hasn't changed. `-q,--quiet`
# will suppress all other output but the result of the check
webpack-css-loader package.json -p 'devDependencies,dependencies' -q
```

## Changelog
[changelog](./changelog.md)

## License
MIT