#!/usr/bin/env bash
node app.js &
pid=$!

npm test

