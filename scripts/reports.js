const chalk = require("chalk");
const { message } = require("./message");
const CliTable3 = require("cli-table3");

const reportCLI = (status, processed) => {
  message("", { introMessage: true });
  reportOverall(status.overall);
  reportHosts(status.hosts);
  reportServices(status.services, processed);
};

const reportOverall = (overallStatus) => {
  const table = new CliTable3({
    head: ["Overall\nStatus"],
    style: {},
  });
  table.push([
    overallStatus ? chalk.bgGreenBright("      ") : chalk.bgRedBright("      "),
  ]);
  console.log(table.toString());
  console.log();
};

const reportHosts = (hostStatus) => {
  const table = new CliTable3({
    head: ["Status", "Host"],
    style: {},
  });
  hostStatus.map((host, index) =>
    table.push([
      host ? chalk.bgGreenBright("      ") : chalk.bgRedBright("      "),
      `Host ${index + 1}`,
    ])
  );
  console.log(table.toString());
  console.log();
};

const reportServices = (serviceStatus, serviceDetails) => {
  for (let hostIndex = 0; hostIndex < serviceStatus.length; hostIndex++) {
    if (serviceStatus[hostIndex].length == 0) continue;
    const table = new CliTable3({
      head: [],
      style: {},
    });
    table.push([{ colSpan: 3, content: chalk.blue(`Host ${hostIndex + 1}`) }]);
    table.push([
      chalk.red("Status"),
      chalk.red("Service Name"),
      chalk.red("Service Type"),
    ]);
    serviceStatus[hostIndex].map((status, index) =>
      table.push([
        status ? chalk.bgGreenBright("      ") : chalk.bgRedBright("      "),
        serviceDetails[hostIndex][index].name,
        serviceDetails[hostIndex][index].type,
      ])
    );
    console.log(table.toString());
    console.log();
  }
};

module.exports = { reportCLI };
