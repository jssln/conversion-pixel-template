// @flow

function getRandomString(): string {
  return String(Math.floor(Math.random() * 100000));
}

function isValidObject(data: ?Object): boolean {
  return data && typeof(data) === 'object';
}

module.exports = {
  getRandomString,
  isValidObject,
};
