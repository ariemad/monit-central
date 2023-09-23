const messageExit = () => {
  console.log("Monit Collector will exit.");
};

const messageIntro = () => {
  console.log("Monit Collector:");
};

const message = (message, options = {}) => {
  const defaultOptions = {
    introMessage: false,
    exitMessage: false,
    exitProcess: false,
    all: false,
  };

  //All overrides all options
  options = { ...defaultOptions, ...options };
  if (options.all) {
    for (const option in options) {
      options[option] = true;
    }
  }

  options.introMessage && messageIntro();
  console.log();
  console.log(message);
  console.log();
  options.exitMessage && messageExit();
  console.log();

  options.exitProcess && process.exit();
};

module.exports = { message };
