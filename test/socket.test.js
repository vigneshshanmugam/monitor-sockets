const assert = require("assert");
const http = require("http");
const monitorSocket = require("../lib/socket");

describe("Monitor Socket", () => {
  let server = null;
  let port = null;
  let stats = new Map();
  before(done => {
    server = http.createServer((req, res) => {
      return res.end(req.url);
    });
    server.listen(0, () => {
      port = server.address().port;
      done();
    });
    monitorSocket(http.Agent, stats);
  });

  it("monitor http socket stats", done => {
    const request = http.request(`http://localhost:${port}/`, response => {
      response.resume();

      response.on("end", () => {
        const hostname = Array.from(stats.keys())[0];
        assert.equal(hostname, `localhost:${port}`);
        const values = Array.from(stats.values())[0];
        assert.deepStrictEqual(values, {
          created: 1,
          inuse: 1,
          requests: 0,
          timeout: 0,
          destroyed: 0,
          error: 0
        });
      });

      response.on("close", () => {
        const values = Array.from(stats.values())[0];
        assert.deepStrictEqual(values, {
          created: 1,
          inuse: 0,
          requests: 0,
          timeout: 0,
          destroyed: 1,
          error: 0
        });
        done();
      });
    });
    request.end();
  });

  it("monitor stats for errors", done => {
    const request = http.request(`http://localhost:2/`, response => {
      response.resume();
    });

    request.on("error", () => {
      const hostname = Array.from(stats.keys())[1];
      assert.equal(hostname, `localhost:2`);
      const values = Array.from(stats.values())[1];
      assert.deepStrictEqual(values, {
        created: 1,
        inuse: 0,
        requests: 0,
        timeout: 0,
        destroyed: 0,
        error: 1
      });
      done();
    });
    request.end();
  });
});
