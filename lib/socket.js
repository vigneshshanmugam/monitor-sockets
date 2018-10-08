const shimmer = require("shimmer");

function getSocketName(options) {
  return `${options.host}:${options.port}`;
}

module.exports = function monitorAgent(agent, stats) {
  if (!agent) {
    return;
  }
  shimmer.wrap(agent.prototype, "createConnection", function(original) {
    return function() {
      const socketOpts = Array.from(arguments)[0];
      const socketName = getSocketName(socketOpts);

      let socketStats = stats.get(socketName);
      if (socketStats == null) {
        socketStats = {
          created: 0,
          inuse: 0,
          requests: 0,
          timeout: 0,
          destroyed: 0,
          error: 0
        };
        stats.set(socketName, socketStats);
      }

      const socket = original.apply(this, arguments);
      socketStats.created++;
      socketStats.inuse++;

      const cleanup = () => {
        if (socketStats.inuse > 0) {
          socketStats.inuse--;
        }
        socket.removeListener("free", onFree);
        socket.removeListener("timeout", onTimeout);
        socket.removeListener("error", onError);
        socket.removeListener("close", onClose);
      };
      const onTimeout = () => socketStats.timeout++;
      const onFree = () => socketStats.requests++;
      const onError = () => {
        socketStats.error++;
        cleanup();
      };
      const onClose = () => {
        socketStats.destroyed++;
        cleanup();
      };

      socket.on("free", onFree);
      socket.on("timeout", onTimeout);
      socket.on("close", onClose);
      socket.on("error", onError);
      return socket;
    };
  });
};
