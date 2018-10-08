# monitor-sockets

Monitor socket connections in Node.js

### Installation

```js
yarn add monitor-sockets
```

### Use

```js
// In your application index.js file before starting the server
const monitor = require("monitor-sockets");

monitor.start({ interval: 2000 });

// Renders the table on the terminal
┌────────────────┬─────────┬────────┬──────────┬─────────┬───────────┬───────┐
│ Socket Name    │ Created │ In Use │ Requests │ Timeout │ Destroyed │ Error │
├────────────────┼─────────┼────────┼──────────┼─────────┼───────────┼───────┤
│ localhost:8082 │ 20      │ 18     │ 200      │ 0       │ 0         │ 2     │
├────────────────┼─────────┼────────┼──────────┼─────────┼───────────┼───────┤
│ localhost:8085 │ 20      │ 20     │ 500      │ 0       │ 0         │ 0     │
├────────────────┼─────────┼────────┼──────────┼─────────┼───────────┼───────┤
│ localhost:8086 │ 20      │ 0      │ 0        │ 0       │ 0         │ 20    │
└────────────────┴─────────┴────────┴──────────┴─────────┴───────────┴───────┘
```

### API

### start(options)

Starts monitoring the socket connections for both HTTP and HTTPS.

- `options` {Object}

  - `interval` - Refresh interval to update the data on the Terminal

## LICENSE

MIT
