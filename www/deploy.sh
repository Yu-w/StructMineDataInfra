#!/bin/sh

echo The following happened on remote server:

ssh wangyu2165@73.222.137.165 $(cat <<EOF
    set -e;
    echo "Loading NVM...";
    export NVM_DIR="\$HOME/.nvm";
    . "\$NVM_DIR/nvm.sh";
    echo Pulling Git changes;
    cd \$HOME/StructMineDataInfra/www;
    git pull;
    yarn build --release;
    pm2 restart pm2-service.json;
    echo Done.
EOF)
