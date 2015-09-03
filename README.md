# npm-depends
Find which packages on npm depend on another one

## Installation

`npm install -g npm-depends`

## Usage

`% npm-depends <name> <version>`

The version argument has to be a valid semver number.

## Example

```
% npm-depends koa 1.0.0
koa-opinion
opinion
riverside
component-boilerplate-koa
fitjs
fora
glace
hitchslap
hive-rest-api
icejs
...
```

## License

[MIT](./LICENSE)
