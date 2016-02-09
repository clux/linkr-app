#!/bin/sh
alias psql="psql linkr"
export DATABASE_URL=postgres://$USER@localhost:5432/linkr
export LINKR_USER=clux
export LINKR_EMAIL=h@x.io
export LINKR_PASSWORD=heythere
export NODE_ENV=development
