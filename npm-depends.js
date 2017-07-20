#!/usr/bin/env node

'use strict';

var agent = require('superagent');
var program = require('commander');
var semver = require('semver');

var name, version;

program
    .version(require('./package.json').version)
    .arguments('<name> [version]')
    .option('--invert')
    .option('--print-ranges')
    .option('--count')
    .action(function (name_, version_) {
        name = name_;
        version = version_;
    })
    .parse(process.argv);

// TODO shouldn't be needed, probably a bug in commander
if (!name) program.missingArgument('name');

if (version && !semver.valid(version)) {
    console.error('invalid version number: ' + version);
    process.exit(1);
}

const invert = program.invert;

var encodedName = encodeURIComponent(name);
var npmURL = 'https://skimdb.npmjs.com/registry/_design/app/_view/dependentVersions?startkey=%5B%22' + encodedName + '%22%5D&endkey=%5B%22' + encodedName + '%22%2C%7B%7D%5D&reduce=false';
agent.get(npmURL)
    .set('Accept', 'application/json')
    .end(function (error, response) {
        if (error) {
            throw error;
        }

        var packages = response.body.rows;
        if (version) {
            packages = packages.filter(function (pack) {
                const satisfies = semver.satisfies(version, pack.key[1]);
                return invert ? !satisfies : satisfies;
            });
        }

        if (program.count) {
            console.log(packages.length);
        } else {
            packages = packages.map(function (pack) {
                return pack.id + (program.printRanges ? ('\t' + pack.key[1]) : '');
            });

            if (packages.length) {
                console.log(packages.join('\n'));
            }
        }
    });
