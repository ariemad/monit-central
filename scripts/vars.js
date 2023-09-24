const configDefault = {
  hosts: [],
  delay: 5,
  interval: 120,
  response: 20,
};

const defaultFiles = {
  config: {
    path: "config/monitCollector.json",
    content: JSON.stringify(configDefault, null, 2),
  },
};

const hostConnTypes = ["ssh"];

const vars = {
  hostConnTypes,
  defaultFiles,
};

module.exports = { vars };
