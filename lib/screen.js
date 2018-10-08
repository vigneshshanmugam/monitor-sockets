const Table = require("cli-table");

module.exports = class Screen {
  constructor(tableOpts, interval) {
    this.table = new Table(tableOpts);
  }

  refresh(map, interval) {
    const timer = setInterval(() => this.render(map), interval);
    timer.unref();
  }

  render(map) {
    this.clear();
    for (const [host, socketObj] of map.entries()) {
      const { created, inuse, requests, timeout, destroyed, error } = socketObj;
      this.table.push([
        host,
        created,
        inuse,
        requests,
        timeout,
        destroyed,
        error
      ]);
    }
    process.stderr.write(this.table.toString());
  }

  clear() {
    this.table.length = 0;
    process.stderr.write("\x1b[0f");
  }
};
