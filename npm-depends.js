#!/usr/bin/env node

'use strict';

var agent = require('superagent');
var program = require('commander');
var semver = require('semver');

var registryURL = 'https://skimdb.npmjs.com/registry/';

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

var range = semver.Range(version);

var known = {};
var tree = {name: name, deps: []};

getDependents(name, range, tree).then(function (deps) {
    require('fs').writeFileSync('./test.json', JSON.stringify(tree, null, 2));
    console.error('finished');
}, function (err) {
    console.error(err);
});

function getDependents(name, range, tree) {
    return getPackageInfo(name).then(function (info) {
        var versions = [];
        if (range) {
            for (var version in info.versions) {
                if (semver.satisfies(version, range)) {
                    versions.push(version);
                }
            }
        } else {
            versions.push(info['dist-tags'].latest);
        }

        if (versions.length === 0) {
            throw new Error('found no version of ' + name + ' satisfying ' + range);
        }
        return requestNPM('_design/app/_view/dependentVersions?startkey=%5B%22' + name + '%22%5D&endkey=%5B%22' + name + '%22%2C%7B%7D%5D&reduce=false').then(function (result) {
            var packages = result.rows.filter(function (pack) {
                for(var i = 0; i < versions.length; i++) {
                    if (semver.satisfies(versions[i], pack.key[1]))
                        return true;
                }
            }).map(function (pack) {
                return pack.id;
            });
            return Promise.all(packages.map(function (name) {
                if (known[name]) {
                    //tree.deps.push(known[name]);
                } else {
                    var newDep = {name: name, deps: []};
                    known[name] = newDep;
                    tree.deps.push(newDep);
                    return getDependents(name, false, newDep);
                }
            }));
        });
    });
}

function getPackageInfo(name) {
    return requestNPM(name).then(function (info) {
        if (info.error) throw new Error('package ' + name + ' not found');
        return info;
    });
}

function requestNPM(url) {
    return new Promise(function (resolve, reject) {
        agent.get(registryURL + url)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (res) return resolve(res.body);
                reject(err);
            });
    });
}
