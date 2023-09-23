const fs = require("fs");
const path = require("path");
const { paths } = require("./variables");
const { message } = require("./message");

const verify = () => {
  for (const filePath of paths.fileStructure) {
    let dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "");
    }
  }
};

const add = (args) => {
  if (args.length == 0) {
    throw new Error(`'add' must have one of the following arguments`);
  }

  if (!paths.addFiles.includes(args[0])) {
    let string = `'${args}' is not a proper 'add' argument.
Consider using one of the following: ${paths.addFiles.join(", ")}
    `;
    message(string, { all: true });
  }

  fs.appendFileSync(
    path.join(global.scriptPath, `./data/${args[0]}.txt`),
    args.slice(1).join("\n") + "\n"
  );
};

const clear = (args) => {
  if (!paths.addFiles.includes(args[0])) {
    let message = `'${args}' is not a proper 'clear' argument.
Consider using one of the following: ${data.addFiles.join(", ")}
    `;
    messageAndExit(message);
  }

  fs.writeFileSync(path.join(global.scriptPath, `./data/${args[0]}.txt`), "");
};

const list = (args) => {
  if (!paths.addFiles.includes(args[0])) {
    let message = `'${args}' is not a proper 'list' argument.
Consider using one of the following: ${paths.addFiles.join(", ")}
    `;
    messageAndExit(message);
  }

  let data = fs.readFileSync(
    path.join(global.scriptPath, `./data/${args[0]}.txt`),
    { encoding: "utf8" }
  );

  if (data == "") {
    message("There are no hosts defined", { all: true });
  }

  console.log(data);
};

const files = {
  verify,
  add,
  clear,
  list,
};

module.exports = { files };
