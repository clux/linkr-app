# linkr-app
[![build status](https://secure.travis-ci.org/clux/linkr-app.svg)](http://travis-ci.org/clux/linkr-app)
[![coverage status](http://img.shields.io/coveralls/clux/linkr-app.svg)](https://coveralls.io/r/clux/linkr-app)
[![dependency status](https://david-dm.org/clux/linkr-app.svg)](https://david-dm.org/clux/linkr-app)
[![development dependency status](https://david-dm.org/clux/linkr-app/dev-status.svg)](https://david-dm.org/clux/linkr-app#info=devDependencies)

A link sharing site built on top of iojs, koa, postgresql, and polymer based web components using jwt for authentication.

## Usage
Clone, generate rsa keys for jwt, set up database, and start:

```sh
git clone git@github.com:clux/linkr-app.git && cd linkr-app
openssl genrsa -out server.rsa 2048
openssl rsa -in server.rsa -pubout > server.rsa.pub
bower install
npm install
npm build
# create a postgres database, and expose its location:
export DATABASE_URL=postgres://localhost:5432/testdb
node app.js
```

## Logging in
Login with static username and password, then you have access to `/post` resources:

```sh
curl -X POST -H "Content-Type: application/json" localhost:8000/login -d
curl -X GET -H "Authorization: Bearer $TOKEN" localhost:8000/post
```
