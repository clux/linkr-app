# linkr-app
[![build status](https://secure.travis-ci.org/clux/linkr-app.svg)](http://travis-ci.org/clux/linkr-app)
[![coverage status](http://img.shields.io/coveralls/clux/linkr-app.svg)](https://coveralls.io/r/clux/linkr-app)
[![dependency status](https://david-dm.org/clux/linkr-app.svg)](https://david-dm.org/clux/linkr-app)
[![development dependency status](https://david-dm.org/clux/linkr-app/dev-status.svg)](https://david-dm.org/clux/linkr-app#info=devDependencies)

A link sharing site built on top of iojs, koa, postgresql, and polymer based web components using jwt for authentication.

## Setup
Clone and perform a set of steps inside the repo:

```sh
# generate keys for jwt
openssl genrsa -out server.rsa 2048
openssl rsa -in server.rsa -pubout > server.rsa.pub
# install dependencies
bower install
npm install
# create a postgres database, and expose its location:
psql -c 'create database linkr;' -U postgres
export DATABASE_URL=postgres://localhost:5432/linkr
# initialize the database with a single administrator
export LINKR_USER=clux
export LINKR_EMAIL=h@x.io
export LINKR_PASSWORD=heythere
npm run setup
# build client app
npm run build
# start the server
npm start
```

## Client App
[In development](#3).

## API
### Authentication
Authenticate with the credentials exported before calling `npm run setup`:

```sh
curl -X POST -H "Content-Type: application/json" localhost:8000/login -d '{"username": "clux", "password": "heythere"}'
curl -X GET -H "Authorization: Bearer $TOKEN" localhost:8000/links
```

Any request other than `GET /` or `POST /login` will require the `Authorization: Bearer $TOKEN` header.

### Methods
### GET /links
Fetches a selection of links.
### GET /links/:id
Fetches a single link.
### POST /links
Creates a new link.
