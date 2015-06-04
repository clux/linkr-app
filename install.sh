#!/bin/sh
sudo apt-get install postgresql-9.4
sudo apt-get install postgresql-contrib-9.4
pg_isready
#sudo -u postgres psql # maybe set root \password in here
sudo -u postgres createuser $USER --pwprompt # enter PASSWORD
sudo -u postgres createdb linkr --owner=$USER

# can now connect to
echo "postgres://${USER}:PASSWORD@localhost:5432/linkr"

