#!/bin/sh

echo The following happened on remote server:

ssh wangyu2165@73.222.137.165 $(cat <<EOF
    set -e;
    echo Pulling Git changes;
    cd \$HOME/StructMineDataInfra/www;
    git pull;
    /home/wangyu2165/.nvm/versions/node/v8.9.4/bin/pm2 restart pm2-service.json;
    echo Done.
EOF)
