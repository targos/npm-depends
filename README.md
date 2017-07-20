# npm-depends

Find which packages on npm depend on another one

## Installation

`npm install -g npm-depends`

## Usage

`% npm-depends <name> [version]`

If specified, the version argument has to be a valid semver number. The version is used to filter the result and show
only the packages for which this version is in the semver range.

## Options

* `--invert` - Invert the output. Prints the list of packages that depend on another version than the one provided.
* `--print-ranges` - Print the semver ranges of the matching packages. Output will be tab-delimited.
* `--count` - Print the number of matching packages instead of the list.

## Example

```
% npm-depends graceful-fs 4.1.11 --invert --print-ranges
component-builder2      ^2.0.1
component-manifest      ^2.0.1
component-resolver      ^2.0.1
faiton-builder  ^2.0.1
component-downloader    ^2.0.2
component-remotes       ^2.0.2
npm2    ^2.0.2
remotes ^2.0.2
anvil-cli       ^2.0.3
cartapacio.core.writer  ^2.0.3
component-builder       ^2.0.3
component-checkout      ^2.0.3
component-compare       ^2.0.3
dupe-finder     ^2.0.3
epm-cli ^2.0.3
file-gateway    ^2.0.3
grunt-localizr  ^2.0.3
jest-cli-browser-support        ^2.0.3
package-write   ^2.0.3
registry-static ^2.0.3
xinix-pax       ^2.0.3
primeng-custom  ^3.0.11
...
```

## License

[MIT](./LICENSE)
