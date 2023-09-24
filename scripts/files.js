const fs = require("fs");
const path = require("path");
const { vars } = require("./vars");
const { message } = require("./message");
const { argsAux } = require("./argsAux");

const verifyPaths = () => {
  for (const name in vars.defaultFiles) {
    let defaultFile = vars.defaultFiles[name];
    let dirPath = path.dirname(defaultFile.path);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(defaultFile.path)) {
      fs.writeFileSync(defaultFile.path, defaultFile.content);
    }
  }
};

const getConfig = () => {
  let raw = fs.readFileSync(vars.defaultFiles.config.path);
  let data = JSON.parse(raw);
  return data;
};

const saveConfig = (config) => {
  fs.writeFileSync(
    vars.defaultFiles.config.path,
    JSON.stringify(config, null, 2)
  );
};

const add = (args) => {
  if (args.length == 0) {
    message('"add" has no arguments.', { all: true });
  }

  let dict = argsAux.process(args);
  if (argsAux.check(dict, ["t", "ip", "u", "path"])) {
    let config = getConfig();
    config.hosts.push(dict);
    saveConfig(config);

    message("Host successfully add.", { all: true });
  } else {
    message('"add" arguments are not valid.', { all: true });
  }
};

const clear = () => {
  let config = getConfig();
  config.hosts = [];
  saveConfig(config);

  message("All hosts removed", { all: true });
};

const list = () => {
  let config = getConfig();

  message("", { introMessage: true });
  console.table(config.hosts);
  message("", { exitMessage: true, exitProcess: true });
};

const files = {
  getConfig,
  saveConfig,
  verifyPaths,
  add,
  clear,
  list,
};

module.exports = { files };
