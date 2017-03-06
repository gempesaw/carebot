set -e
SEED=$(date +%Y-%m-%d:%H:%M:%S)
rm lib/config_backup_*.js
cp lib/config.js lib/config_backup_$SEED.js
git fetch origin
git reset --hard origin/master
npm install
npm test
cp lib/config_backup_$SEED.js lib/config.js

set +e
screen -S flowbot -X quit
screen -dmS flowbot bash -c "npm start > log"
screen -ls

exit 0
