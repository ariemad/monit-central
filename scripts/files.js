const fs = require("fs");
const path = require("path");
const { vars } = require("./variables");
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

const add = (args) => {
  if (args.length == 0) {
    message('"add" has no arguments.', { all: true });
  }

  let dict = argsAux.process(args);
  if (argsAux.check(dict, ["t", "ip", "u", "path"])) {
    let raw = fs.readFileSync(vars.defaultFiles.config.path);
    let data = JSON.parse(raw);
    data.hosts.push(dict);
    fs.writeFileSync(
      vars.defaultFiles.config.path,
      JSON.stringify(data, null, 2)
    );
    message("Host successfully add.", { all: true });
  } else {
    message('"add" arguments are not valid.', { all: true });
  }
};

const clear = () => {
  let raw = fs.readFileSync(vars.defaultFiles.config.path);
  let data = JSON.parse(raw);

  data.hosts = [];

  fs.writeFileSync(
    vars.defaultFiles.config.path,
    JSON.stringify(data, null, 2)
  );

  message("All hosts removed", { all: true });
};

const list = () => {
  let raw = fs.readFileSync(vars.defaultFiles.config.path);
  let data = JSON.parse(raw);
  message("", { introMessage: true });
  console.table(data.hosts);
  message("", { exitMessage: true, exitProcess: true });
};

const files = {
  verifyPaths,
  add,
  clear,
  list,
};

module.exports = { files };
