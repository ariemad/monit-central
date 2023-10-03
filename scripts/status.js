const { Client } = require("ssh2");
const { files } = require("./files");
const { time } = require("./time");
const fs = require("fs");
const { log } = require("console");

class Status {
  constructor() {
    this.ok = false;
    this.config = files.getConfig();
    this.numberHosts = this.config.hosts.length;
    this.raw = new Array(this.numberHosts).fill(null);
    this.processed = Array.from(new Array(this.numberHosts), () => {
      return { status: false, services: [] };
    });
  }

  start = async () => {
    console.log("Hey");
    await time.wait(this.config.delay * 1000);
    this.getProcessReport();
    setInterval(this.getProcessReport, this.config.interval * 1000);
  };

  getProcessReport = async () => {
    await this.getAll();
    this.processAll();
    this.reportAll();
  };

  getAll = () => {
    let promises = [];

    for (let i = 0; i < this.numberHosts; i++) {
      promises.push(this.get(i));
    }

    return Promise.allSettled(promises);
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
      let accBuffer = Buffer.alloc(0);
      conn
        .on("ready", () => {
          conn.exec("sudo monit status", (err, stream) => {
            if (err) throw err;
            stream
              .on("close", (code, signal) => {
                conn.end();
                this.raw[hostIndex] = accBuffer;
                resolve();
              })
              .on("data", (data) => {
                accBuffer = Buffer.concat([accBuffer, data]);
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
    for (let hostIndex = 0; hostIndex < this.numberHosts; hostIndex++) {
      if (this.raw[hostIndex] == null) {
        this.processed[hostIndex].status = {};
      }
      this.process(hostIndex);
    }
  };

  process = (hostIndex) => {
    if (this.config.hosts[hostIndex].t == "ssh") {
      this.processSSH(hostIndex);
    }
  };

  processSSH = (hostIndex) => {
    let temp = this.raw[hostIndex].toString().split("\n\n");
    temp[0] = temp[0].split(" ");
    this.processed[hostIndex].version = temp[0][1];
    this.processed[hostIndex].uptime = temp[0].slice(3).join(" ");
    for (let i = 1; i < temp.length - 1; i++) {
      let service = {};

      let tempService = temp[i].split("\n");
      tempService[0] = tempService[0].split(" ");
      service.type = tempService[0][0];
      service.name = tempService[0][1].slice(1, -1);

      for (let i = 1; i < tempService.length; i++) {
        let key = tempService[i].slice(0, 31).trim();
        let value = tempService[i].slice(31).trim();
        service[key] = value;
      }

      this.processed[hostIndex].services.push(service);
    }
    console.log(this.processed);
  };

  reportAll = () => {
    console.log("Report");
  };
}

module.exports = { Status };
