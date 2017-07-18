// @flow

function getRandomString(): string {
  return String(Math.floor(Math.random() * (99999-10000) + 10000));
}

function isValidObject(data: ?Object): boolean {
  return (data != null) && (typeof(data) === 'object');
}

module.exports = {
  getRandomString,
  isValidObject,
};
