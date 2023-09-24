const messageExit = () => {
  console.log("Monit Collector will exit.");
};

const messageIntro = () => {
  console.log("Monit Collector:");
};

const defaultOptions = {
  introMessage: false,
  exitMessage: false,
  exitProcess: false,
  all: false,
};
const message = (message, options = defaultOptions) => {
  //All overrides all options
  options = { ...defaultOptions, ...options };
  if (options.all) {
    for (const option in options) {
      options[option] = true;
    }
  }

  options.introMessage && messageIntro();
  options.introMessage && console.log();
  message && console.log(message);
  options.exitMessage && console.log();
  options.exitMessage && messageExit();

  options.exitProcess && process.exit();
};

module.exports = { message };
