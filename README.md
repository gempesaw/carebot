# flowbot [![Build Status](https://travis-ci.org/gempesaw/flowbot.svg?branch=master)](https://travis-ci.org/gempesaw/flowbot)

This is a Flowdock chatbot that handles some repetitive tasks. It's a
toy project that is an excuse to play with some new ES2015/6/7
features like async/await, the import/export stuff, etc. It uses
[node-flowdock] to interface with Flowdock.

[node-flowdock]: https://github.com/flowdock/node-flowdock

# usage

You need to add a Flowdock API token to `/lib/config.js`, or else the
service will crash with a 401. Afterwards, `npm start` will start the
bot. `npm run start-watch` will start the app and watch for file
changes to restart the app.

# tests

`npm test` will run all the tests once.

`npm run test-watch` will run the tests and watch for file changes and
re-run the tests.

# license

MIT
