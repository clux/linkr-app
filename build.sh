#!/usr/bin/env bash
set -ex

mkdir -p assets/js assets/css assets/images assets/html

# all components we require (specified in components.html) into one file
$(npm bin)/vulcanize components.html > assets/html/components.html

# web component polyfill
cp bower_components/webcomponentsjs/webcomponents-lite.* assets/js
