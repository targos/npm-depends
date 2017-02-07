#!/usr/bin/env node

'use strict';

var agent = require('superagent');
var program = require('commander');
var semver = require('semver');

var name, version;

program
    .version(require('./package.json').version)
    .arguments('<name> <version>')
    .action(function (name_, version_) {
        name = name_;
        version = version_;
    })
    .parse(process.argv);

// TODO shouldn't be needed, probably a bug in commander
if (!name) program.missingArgument('name');

if (!semver.valid(version)) {
    console.error('invalid version number: ' + version);
    process.exit(1);
}

var encodedName = encodeURIComponent(name);
var npmURL = 'https://skimdb.npmjs.com/registry/_design/app/_view/dependentVersions?startkey=%5B%22' + encodedName + '%22%5D&endkey=%5B%22' + encodedName + '%22%2C%7B%7D%5D&reduce=false';
agent.get(npmURL)
    .set('Accept', 'application/json')
    .end(function (error, response) {
        if (error) {
            throw error;
        }
        var packages = response.body.rows.filter(function (pack) {
            return semver.satisfies(version, pack.key[1]);
        }).map(function (pack) {
            return pack.id;
        });
        if (packages.length) {
            console.log(packages.join('\n'));
        }
    });
