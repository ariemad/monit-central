#!/usr/bin/env node

let args = process.argv.slice(2);

const functions = {
  help: "Give help",
  doStuff: "Do stuff",
};

if (args.length > 0 && functions.hasOwnProperty(args[0])) {
  console.log(functions[args[0]]);
} else {
  console.log(functions["help"]);
}
