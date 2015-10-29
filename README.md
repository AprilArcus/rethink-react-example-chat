# example-chat

Example chat app using react-rethinkdb

Forked from [react-rethinkdb/examples/chat](https://github.com/mikemintz/react-rethinkdb/tree/master/examples/chat) by Mike Mintz. Work in ESNext or CoffeeScript, both Node
and webpack are configured to load .js, .json, .coffee, .coffee.md, .litcoffee
and .cson files.

Nodemon will ignore changes to `./client/src/*` such that
changes to client-side code will not reboot the API server; however the
reciprocal case does not yet hold: changes to server code will force an
unnecessary reboot and recompile of the dev server. You may work around this
by running `npm run watch:server` and `npm run watch:client` as separate
node instances in lieu of `npm start`. The client will bind port 3000 and
the server will bind port 3001. The client obtains the server's address from
a CONFIG global injected in `webpack.config.dev.js` by `DefinePlugin`.

## How do I run this?

* Start a RethinkDB server on `localhost` port `28015`
* Run `npm install` to set up the app
* Run `npm run resetdb` to reset a database with name `react_example_chat`
* Run `npm start` to start the web server
* Navigate to http://localhost:3000/ in your browser

You can edit `server/config.cson` if you want to use different parameters.

If you open two browsers, navigate to the app, and log in as two different
users, you can have them chat with each other in realtime.