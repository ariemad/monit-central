#!/usr/bin/env node

const path = require("path");
global.scriptPath = path.dirname(process.argv[1]);

const { files } = require("./scripts/files");
const { help } = require("./scripts/help");
const { message } = require("./scripts/message");
const { start, Status } = require("./scripts/status");

let args = process.argv.slice(2);

const functions = {
  help: help,
  add: files.add,
  clear: files.clear,
  list: files.list,
  start: () => {
    new Status().start();
  },
};

files.verifyPaths();

if (args.length > 0 && functions.hasOwnProperty(args[0])) {
  functions[args[0]](args.slice(1));
} else {
  message(help(), { all: true });
}
