const { readFileSync } = require("fs");

const { Client } = require("ssh2");

const conn = new Client();
conn
  .on("ready", () => {
    console.log("Client :: ready");
    conn.exec("sudo monit status", (err, stream) => {
      if (err) throw err;
      stream
        .on("close", (code, signal) => {
          console.log(
            "Stream :: close :: code: " + code + ", signal: " + signal
          );
          conn.end();
        })
        .on("data", (data) => {
          console.log("STDOUT: " + data);
        })
        .stderr.on("data", (data) => {
          console.log("STDERR: " + data);
        });
    });
  })
  .connect({
    host: "52.47.130.31",
    port: 22,
    username: "ubuntu",
    privateKey: readFileSync("/home/daniel/Downloads/Projects.pem"),
  });
