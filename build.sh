#!/usr/bin/env bash
set -eu

PATH="$(npm bin):${PATH}"
VER=$(git log | head -1 | cut -d " " -f 2)
NENV=${NODE_ENV-development}

linkr_assets() { #HELP Generate assets:\nLINKR assets
  mkdir -p assets/js assets/css assets/images assets/html
  cp bower_components/webcomponentsjs/webcomponents-lite.* assets/js
  cp bower_components/platinum-sw/service-worker.js assets/js
  # TODO: shouldn't this be in main after an event rather?
  echo "importScripts('js/service-worker.js');" > assets/sw-import.js
  browserify app/main.js > assets/js/main.js
  uglifyjs assets/js/main.js > assets/js/main.min.js
  vulcanize app/elements.html > assets/html/components.html
}

linkr_cache () { #HELP Generate cache-config.json based on NODE_ENV:\nLINKR cache
  # all asset files, wrap in quotes with trailing comma, then add final "./"
  local cached
  cached=$(find assets/ -type f | sed 's/assets\///' | sed 's/\(.*\)/"\1",/g')
  local manifest="${cached} \"./\""
  echo '{ "cacheId": "linkr-app" }' \
     | json -e this.disabled="$([ "$NENV" = "development" ] && echo true || echo false)" \
     | json -e "this.precache=[${manifest}]" \
     | json -e "this.precacheFingerprint=\"${VER}\"" > assets/cache-config.json
}

linkr_all() { #HELP Generate everything:\nLINKR
  linkr_assets
  #linkr_cache
}

linkr_help() {
  sed -n "s/^.*#HELP\\s//p;" < "$1" | sed "s/\\\\n/\n\t/g;s/$/\n/;s!LINKR!${1/!/\\!}!g"
}

[[ -z "${1-}" ]] && linkr_all && exit 0
case $1 in
  assets|cache) linkr_"$1" "${@:2}" ;;
  *) linkr_help "$0" ;;
esac
