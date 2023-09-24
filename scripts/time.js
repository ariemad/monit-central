const wait = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};
const time = {
  wait,
};

module.exports = { time };
