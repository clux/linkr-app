# linkr-app
[![build status](https://secure.travis-ci.org/clux/linkr-app.svg)](http://travis-ci.org/clux/linkr-app)
[![coverage status](http://img.shields.io/coveralls/clux/linkr-app.svg)](https://coveralls.io/r/clux/linkr-app)
[![dependency status](https://david-dm.org/clux/linkr-app.svg)](https://david-dm.org/clux/linkr-app)
[![development dependency status](https://david-dm.org/clux/linkr-app/dev-status.svg)](https://david-dm.org/clux/linkr-app#info=devDependencies)

A link sharing site built on top of express, postgresql, and polymer based web components using local passport authentication.

## Install
Ensure you have node, postgres and bower installed. Then clone and install dependencies:

```sh
git clone git@github.com:clux/linkr-app.git
bower install
npm install
npm build
# create a postgres database, and expose its location:
export DATABASE_URL=postgres://localhost:5432/testdb
npm start
```
