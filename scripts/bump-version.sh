#!/bin/bash

VERSION=$1

sed -i.bak s/\"version\"\:\ \".*\"/\"version\"\:\ \"$VERSION\"/ ./src/package.json
sed -i.bak s/\"version\"\:\ \".*\"/\"version\"\:\ \"$VERSION\"/ ./package.json

rm ./src/package.json.bak
rm ./package.json.bak

./node_modules/.bin/conventional-changelog -p angular -i CHANGELOG.md -s -k ./web/package.json

git commit -a -m "chore: bump version to $VERSION"

conventional-changelog -p angular -i CHANGELOG.md -s -k web/package.json

git commit -a -m 'chore: update changelog'
