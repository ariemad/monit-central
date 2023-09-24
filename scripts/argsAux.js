const { message } = require("./message");

const process = (args) => {
  let dict = {};

  for (let i = 0; i < args.length; i++) {
    if (i % 2 == 0) {
      if (!args[i].match(/^-/)) {
        message(`"${args[i]}" is a value but should be a key`, { all: true });
      }
    } else {
      if (args[i].match(/^-/)) {
        message(`"${args[i]}" is a key but should be a value`, { all: true });
      }
      dict[args[i - 1].slice(1)] = args[i];
    }
  }

  return dict;
};

const check = (dict, args) => {
  for (let i = 0; i < args.length; i++) {
    if (!dict.hasOwnProperty(args[i])) {
      return false;
    }
  }
  return true;
};

const argsAux = {
  process,
  check,
};

module.exports = { argsAux };
