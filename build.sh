#!/usr/bin/env bash
set -ex

mkdir -p assets

# all components we require (specified in components.html) into one file
$(npm bin)/vulcanize components.html > assets/components.html

# web component polyfill
cp bower_components/webcomponentsjs/webcomponents-lite.* assets
