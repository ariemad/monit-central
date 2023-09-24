const { message } = require("./message");
const { vars } = require("./variables");

const help = () => {
  let string = `Commands:

help - Get help

add -t [${vars.hostConnTypes.join(
    ", "
  )}] -ip [123.1.2.3] -u [admin] -path [/path/to/key] - Add a host connection

clear [${vars.hostConnTypes.join(", ")}] - Clear all host connection 
    `;

  message(string, { all: true });
};

module.exports = { help };
