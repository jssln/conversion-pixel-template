// @flow

function getRandomString(): string {
  return String(Math.floor(Math.random() * 100000));
}

module.exports = {
  getRandomString,
};
