const { message } = require("./message");
const { vars } = require("./vars");

const help = () => {
  let string = `Commands:

help - This text

add -t [${vars.hostConnTypes.join(
    ", "
  )}] -ip [123.1.2.3] -u [admin] -path [/path/to/key] - Add a host connection

clear - Clear all host connections 

start - Start monitoring all the hosts
    `;

  message(string, { all: true });
};

module.exports = { help };
