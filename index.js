const HttpAgent = require("http").Agent;
const HttpsAgent = require("https").Agent;
const Screen = require("./lib/screen");
const monitorSocket = require("./lib/socket");

function start(options) {
  const interval = options.interval || 3000;
  const stats = new Map();
  const screen = new Screen({
    head: [
      "Host",
      "Created",
      "In Use",
      "Requests",
      "Timeout",
      "Destroyed",
      "Error"
    ],
    colors: true
  });
  monitorSocket(HttpsAgent, stats);
  monitorSocket(HttpAgent, stats);
  screen.refresh(stats, interval);
}

module.exports = { start };
