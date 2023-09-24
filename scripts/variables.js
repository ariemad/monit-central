const defaultFiles = {
  config: {
    path: "config/monitCollector.json",
    content: JSON.stringify({ hosts: [] }, null, 2),
  },
};

const hostConnTypes = ["ssh"];

const vars = {
  hostConnTypes,
  defaultFiles,
};

module.exports = { vars };
