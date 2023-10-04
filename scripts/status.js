const { Client } = require("ssh2");
const { files } = require("./files");
const { time } = require("./time");
const fs = require("fs");
const { reportCLI } = require("./reports");

class Status {
  constructor() {
    this.status = {};
    this.config = files.getConfig();
    this.numberHosts = this.config.hosts.length;
    this.raw = new Array(this.numberHosts).fill(null);
    this.processed = Array.from(new Array(this.numberHosts));
  }

  start = async () => {
    await time.wait(this.config.delay * 1000);
    this.getProcessReport();
    setInterval(this.getProcessReport, this.config.interval * 1000);
  };

  getProcessReport = async () => {
    await this.getAll();
    this.processAll();
    this.updateStatus();
    reportCLI(
      this.status,
      this.processed.map((host) =>
        host?.services.map((service) => {
          return { name: service.name, type: service.type };
        })
      )
    );
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
        reject();
      }, this.config.response * 1000);

      if (this.config.hosts[hostIndex].t == "ssh") {
        this.getSSH(hostIndex)
          .then(resolve)
          .catch(() => resolve());
      }
    });
  };

  getSSH = async (hostIndex) => {
    return new Promise((resolve, reject) => {
      const conn = new Client();
      let accBuffer = Buffer.alloc(0);

      // Handle errors that occur during the connection setup
      conn.on("error", (err) => {
        reject(err); // Reject the promise with the error
      });

      conn
        .on("ready", () => {
          conn.exec("sudo monit status", (err, stream) => {
            if (err) {
              conn.end();
              reject(err); // Reject the promise with the error
              return;
            }
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
        this.processed[hostIndex] = null;
      } else {
        this.process(hostIndex);
      }
    }
  };

  process = (hostIndex) => {
    if (this.config.hosts[hostIndex].t == "ssh") {
      this.processSSH(hostIndex);
    }
  };

  processSSH = (hostIndex) => {
    this.processed[hostIndex] = { services: [] };

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
  };

  updateStatus = () => {
    this.buildStatus();
    this.getStatus();
  };

  buildStatus = () => {
    this.status.overall = false;
    this.status.hosts = new Array(this.numberHosts).fill(false);
    this.status.services = new Array(this.numberHosts);
    this.processed.map((process, index) => {
      if (!process) this.status.services[index] = [];
      else {
        this.status.services[index] = new Array(process.services.length).fill(
          false
        );
      }
    });
  };

  getStatus = () => {
    for (let hostIndex = 0; hostIndex < this.numberHosts; hostIndex++) {
      if (!this.processed[hostIndex]) this.status.hosts[hostIndex] = false;
      else if (this.processed[hostIndex].services.length == 0) {
        this.status[hostIndex].status = false;
      } else {
        this.processed[hostIndex].services.map(
          (service, serviceIndex) =>
            (this.status.services[hostIndex][serviceIndex] =
              service.status == "OK")
        );

        this.status.hosts[hostIndex] = this.status.services[hostIndex].every(
          (status) => status
        );
      }
    }

    this.status.overall = this.status.hosts.every((host) => host);
  };
}

module.exports = { Status };
