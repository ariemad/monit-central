const { message } = require("./message");
const { paths: data } = require("./variables");

const help = () => {
  let string = `Commands:

help - Get help

add [${data.addFiles.join(", ")}] [hostname1] [...] - Add a host connection

clear [${data.addFiles.join(", ")}] - Clear all host connection 
    `;

  message(string, { all: true });
};

module.exports = { help };
