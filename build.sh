#!/usr/bin/env bash
set -euo pipefail

PATH="$(npm bin):${PATH}"
VER=$(git log | head -1 | cut -d " " -f 2)

assets() {
  mkdir -p assets/js assets/css assets/images assets/html
  cp bower_components/webcomponentsjs/webcomponents-lite.* assets/js
  cp bower_components/platinum-sw/service-worker.js assets/js
  browserify app/main.js > assets/js/main.js
  uglifyjs assets/js/main.js > assets/js/main.min.js
  vulcanize app/elements.html > assets/html/components.html
}

cache () {
  # all asset files, wrap in quotes with trailing comma, then add final "./"
  local cached=$(find assets/ -type f | sed 's/assets\///' | sed 's/\(.*\)/"\1",/g')
  local manifest="${cached} \"./\""
  echo '{ "cacheId": "linkr-app", "disabled": true }' \
     | json -e "this.precache=[${manifest}]" \
     | json -e "this.precacheFingerprint=\"${VER}\"" > assets/cache-config.json
}

assets
cache
