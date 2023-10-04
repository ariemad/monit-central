const reportCLI = () => {
  for (let hostIndex = 0; hostIndex < this.numberHosts; hostIndex++) {
    let table = new CliTable3({
      head: ["Host", "Service Type", "Service Name", "Status"],
    });
    if (!this.processed[hostIndex]) continue;
    for (
      let serviceIndex = 0;
      serviceIndex < this.processed[hostIndex].services.length;
      serviceIndex++
    ) {
      table.push([
        this.processed[hostIndex].services[serviceIndex].type,
        this.processed[hostIndex].services[serviceIndex].name,
        this.processed[hostIndex].services[serviceIndex].status,
      ]);
    }
    console.log(table.toString());
  }

  let overallMessage;
  if (this.status) {
    overallMessage = "Overall Status: " + chalk.green("OK");
  } else {
    overallMessage = "Overall Status: " + chalk.red("NOK");
  }

  message("", { introMessage: true });
  console.log(overallMessage);
  console.table(table);
};

module.exports = { reportCLI };
