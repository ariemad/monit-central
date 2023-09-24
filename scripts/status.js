const { Client } = require("ssh2");
const { files } = require("./files");
const { time } = require("./time");
const fs = require("fs");

class Status {
  constructor() {
    this.ok = true;
    this.config = files.getConfig();
    this.numberHosts = this.config.hosts.length;
    this.raw = new Array(this.numberHosts).fill(null);
    this.status = new Array(this.numberHosts);
  }

  getAllAndReport = async () => {
    await this.getAll();
  };

  getAll = () => {
    let promises = [];

    for (let i = 0; i < this.numberHosts; i++) {
      promises.push(this.get(i));
    }

    Promise.allSettled(promises).then(this.processAll);
  };

  get = (hostIndex) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.status[hostIndex] = { ok: false };

        reject();
      }, this.config.response * 1000);
      if (this.config.hosts[hostIndex].t == "ssh") {
        this.getSSH(hostIndex).then(resolve);
      }
    });
  };

  getSSH = async (hostIndex) => {
    return new Promise((resolve, reject) => {
      const conn = new Client();
      console.log("getSSh");
      conn
        .on("ready", () => {
          conn.exec("sudo monit status", (err, stream) => {
            if (err) throw err;
            stream
              .on("close", (code, signal) => {
                conn.end();
              })
              .on("data", (data) => {
                this.raw[hostIndex] = data.toString();
                resolve();
              })
              .stderr.on("data", (data) => {});
          });
        })
        .connect({
          host: this.config.hosts[hostIndex].ip,
          port: 22,
          username: this.config.hosts[hostIndex].u,
          privateKey: fs.readFileSync(this.config.hosts[hostIndex].path),
        });
    });
  };

  processAll = () => {
    console.log(this.raw);
  };

  report = () => {
    console.log("Report");
  };
}

const start = async () => {
  let status = new Status();

  await time.wait(status.config.delay * 1000);
  status.getAllAndReport();
  setInterval(status.getAllAndReport, status.config.interval * 1000);
};

module.exports = { start };
