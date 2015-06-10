#!/bin/sh
set -e
abort() {
  echo "$@" 1>&2
  exit 1
}

res=$(curl -s -X POST -H "Content-Type: application/json" localhost:8000/login -d '{"username": "clux", "password":"heythere"}')
test $? -eq 0 || abort request failed
success=$(echo "$res" | json success)
test "$success" = "true" || abort login failed
TOKEN=$(echo "$res" | json token)
echo "With auth:"
curl -X GET -H "Authorization: Bearer $TOKEN" localhost:8000/links -I
#curl -X POST -H "Authorization: Bearer $TOKEN" localhost:8000/links -d '{}'

echo "Without auth:"
curl -X GET localhost:8000/links
